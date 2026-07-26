import { prisma } from '../../config/database.js';
import { ApiError, HttpStatus } from '../../utils/apiError.js';
import { buildPagination, parsePagination } from '../../utils/pagination.js';
import { auditService } from '../audit-log/audit.service.js';
import { inventoryRepository } from '../inventory/inventory.repository.js';
import { goodsIssueRepository } from './goodsIssue.repository.js';

function toNumber(value) {
  return Number(value);
}

function mapItem(item) {
  return {
    id: item.id,
    productId: item.productId,
    product: item.product,
    quantity: toNumber(item.quantity),
    unitPrice: toNumber(item.unitPrice),
    note: item.note,
  };
}

function mapIssue(issue) {
  return {
    id: issue.id,
    code: issue.code,
    warehouseId: issue.warehouseId,
    warehouse: issue.warehouse,
    customerId: issue.customerId,
    customer: issue.customer,
    status: issue.status,
    issueDate: issue.issueDate,
    note: issue.note,
    createdBy: issue.createdBy,
    confirmedBy: issue.confirmedBy ?? null,
    confirmedAt: issue.confirmedAt,
    itemCount: issue._count?.items ?? issue.items?.length ?? 0,
    items: issue.items ? issue.items.map(mapItem) : undefined,
    createdAt: issue.createdAt,
    updatedAt: issue.updatedAt,
  };
}

function buildWhere(filters) {
  const where = {};

  if (filters.search) {
    where.OR = [
      { code: { contains: filters.search, mode: 'insensitive' } },
      { note: { contains: filters.search, mode: 'insensitive' } },
    ];
  }

  if (filters.status) where.status = filters.status;
  if (filters.warehouseId) where.warehouseId = filters.warehouseId;
  if (filters.customerId) where.customerId = filters.customerId;

  return where;
}

function parseIssueDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new ApiError(HttpStatus.BAD_REQUEST, 'Ngày xuất không hợp lệ');
  }
  return date;
}

function normalizeItems(items) {
  const productIds = items.map((item) => item.productId);
  if (new Set(productIds).size !== productIds.length) {
    throw new ApiError(HttpStatus.BAD_REQUEST, 'Không được trùng sản phẩm trong cùng phiếu xuất');
  }

  return items.map((item) => ({
    productId: item.productId,
    quantity: item.quantity,
    unitPrice: item.unitPrice ?? 0,
    note: item.note || null,
  }));
}

async function generateCode() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const prefix = `GI-${yyyy}${mm}${dd}-`;
  const count = await goodsIssueRepository.countByCodePrefix(prefix);
  return `${prefix}${String(count + 1).padStart(4, '0')}`;
}

async function assertDraft(issue) {
  if (!issue) {
    throw new ApiError(HttpStatus.NOT_FOUND, 'Không tìm thấy phiếu xuất');
  }
  if (issue.status !== 'DRAFT') {
    throw new ApiError(HttpStatus.CONFLICT, 'Chỉ thao tác được trên phiếu ở trạng thái Nháp');
  }
}

async function validateReferences({ warehouseId, customerId, items }) {
  const warehouse = await goodsIssueRepository.findWarehouseById(warehouseId);
  if (!warehouse || warehouse.status !== 'ACTIVE') {
    throw new ApiError(HttpStatus.BAD_REQUEST, 'Kho không tồn tại hoặc đã ngừng hoạt động');
  }

  if (customerId) {
    const customer = await goodsIssueRepository.findCustomerById(customerId);
    if (!customer || customer.status !== 'ACTIVE') {
      throw new ApiError(HttpStatus.BAD_REQUEST, 'Khách hàng không tồn tại hoặc đã ngừng hoạt động');
    }
  }

  const normalizedItems = normalizeItems(items);
  const products = await goodsIssueRepository.findProductsByIds(
    normalizedItems.map((item) => item.productId)
  );

  if (products.length !== normalizedItems.length) {
    throw new ApiError(HttpStatus.BAD_REQUEST, 'Có sản phẩm không tồn tại');
  }

  const inactive = products.find((product) => product.status !== 'ACTIVE');
  if (inactive) {
    throw new ApiError(HttpStatus.BAD_REQUEST, `Sản phẩm ${inactive.code} đã ngừng hoạt động`);
  }

  return normalizedItems;
}

export const goodsIssueService = {
  async list(query) {
    const { page, limit, skip, sortBy, sortOrder } = parsePagination(query, 'createdAt');
    const where = buildWhere(query);

    const [items, total] = await Promise.all([
      goodsIssueRepository.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
      goodsIssueRepository.count(where),
    ]);

    return {
      items: items.map(mapIssue),
      pagination: buildPagination(page, limit, total),
    };
  },

  async getById(id) {
    const issue = await goodsIssueRepository.findById(id);
    if (!issue) {
      throw new ApiError(HttpStatus.NOT_FOUND, 'Không tìm thấy phiếu xuất');
    }
    return mapIssue(issue);
  },

  async create(payload, userId) {
    const items = await validateReferences(payload);
    const code = await generateCode();

    const issue = await goodsIssueRepository.create(
      {
        code,
        warehouseId: payload.warehouseId,
        customerId: payload.customerId || null,
        issueDate: parseIssueDate(payload.issueDate),
        note: payload.note || null,
        createdById: userId,
        status: 'DRAFT',
      },
      items
    );

    return mapIssue(issue);
  },

  async update(id, payload) {
    const existing = await goodsIssueRepository.findById(id);
    await assertDraft(existing);

    const items = await validateReferences(payload);

    const issue = await prisma.$transaction((tx) =>
      goodsIssueRepository.updateDraft(
        id,
        {
          warehouseId: payload.warehouseId,
          customerId: payload.customerId || null,
          issueDate: parseIssueDate(payload.issueDate),
          note: payload.note || null,
        },
        items,
        tx
      )
    );

    return mapIssue(issue);
  },

  async confirm(id, userId, meta = {}) {
    const confirmed = await prisma.$transaction(async (tx) => {
      const issue = await goodsIssueRepository.findById(id, tx);
      await assertDraft(issue);

      for (const item of issue.items) {
        if (item.product.status !== 'ACTIVE') {
          throw new ApiError(HttpStatus.BAD_REQUEST, `Sản phẩm ${item.product.code} đã ngừng hoạt động`);
        }

        const result = await inventoryRepository.decreaseStock(
          issue.warehouseId,
          item.productId,
          item.quantity,
          tx
        );

        if (!result.ok) {
          throw new ApiError(
            HttpStatus.CONFLICT,
            `Không đủ tồn kho cho sản phẩm ${item.product.code}. Hiện có: ${result.available}`
          );
        }
      }

      return goodsIssueRepository.updateStatus(
        id,
        {
          status: 'CONFIRMED',
          confirmedById: userId,
          confirmedAt: new Date(),
        },
        tx
      );
    });

    await auditService.log({
      userId,
      action: 'GOODS_ISSUE_CONFIRM',
      module: 'goods-issue',
      entityType: 'GoodsIssue',
      entityId: confirmed.id,
      description: `Xác nhận phiếu xuất ${confirmed.code}`,
      newData: { code: confirmed.code, warehouseId: confirmed.warehouseId },
      ...meta,
    });

    return mapIssue(confirmed);
  },

  async cancel(id) {
    const existing = await goodsIssueRepository.findById(id);
    await assertDraft(existing);

    const cancelled = await goodsIssueRepository.updateStatus(id, {
      status: 'CANCELLED',
    });

    return mapIssue(cancelled);
  },

  async remove(id) {
    const existing = await goodsIssueRepository.findById(id);
    await assertDraft(existing);
    await goodsIssueRepository.delete(id);
    return null;
  },
};
