import { prisma } from '../../config/database.js';
import { ApiError, HttpStatus } from '../../utils/apiError.js';
import { buildPagination, parsePagination } from '../../utils/pagination.js';
import { auditService } from '../audit-log/audit.service.js';
import { inventoryRepository } from '../inventory/inventory.repository.js';
import { goodsReceiptRepository } from './goodsReceipt.repository.js';

function toNumber(value) {
  return Number(value);
}

function mapItem(item) {
  return {
    id: item.id,
    productId: item.productId,
    product: item.product,
    quantity: toNumber(item.quantity),
    unitCost: toNumber(item.unitCost),
    note: item.note,
  };
}

function mapReceipt(receipt) {
  return {
    id: receipt.id,
    code: receipt.code,
    warehouseId: receipt.warehouseId,
    warehouse: receipt.warehouse,
    supplierId: receipt.supplierId,
    supplier: receipt.supplier,
    status: receipt.status,
    receiptDate: receipt.receiptDate,
    note: receipt.note,
    createdBy: receipt.createdBy,
    confirmedBy: receipt.confirmedBy ?? null,
    confirmedAt: receipt.confirmedAt,
    itemCount: receipt._count?.items ?? receipt.items?.length ?? 0,
    items: receipt.items ? receipt.items.map(mapItem) : undefined,
    createdAt: receipt.createdAt,
    updatedAt: receipt.updatedAt,
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
  if (filters.supplierId) where.supplierId = filters.supplierId;

  return where;
}

function parseReceiptDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new ApiError(HttpStatus.BAD_REQUEST, 'Ngày nhập không hợp lệ');
  }
  return date;
}

function normalizeItems(items) {
  const productIds = items.map((item) => item.productId);
  const uniqueIds = new Set(productIds);

  if (uniqueIds.size !== productIds.length) {
    throw new ApiError(HttpStatus.BAD_REQUEST, 'Không được trùng sản phẩm trong cùng phiếu nhập');
  }

  return items.map((item) => ({
    productId: item.productId,
    quantity: item.quantity,
    unitCost: item.unitCost ?? 0,
    note: item.note || null,
  }));
}

async function generateCode() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const prefix = `GR-${yyyy}${mm}${dd}-`;
  const count = await goodsReceiptRepository.countByCodePrefix(prefix);
  return `${prefix}${String(count + 1).padStart(4, '0')}`;
}

async function assertDraft(receipt) {
  if (!receipt) {
    throw new ApiError(HttpStatus.NOT_FOUND, 'Không tìm thấy phiếu nhập');
  }
  if (receipt.status !== 'DRAFT') {
    throw new ApiError(HttpStatus.CONFLICT, 'Chỉ thao tác được trên phiếu ở trạng thái Nháp');
  }
}

async function validateReferences({ warehouseId, supplierId, items }) {
  const warehouse = await goodsReceiptRepository.findWarehouseById(warehouseId);
  if (!warehouse || warehouse.status !== 'ACTIVE') {
    throw new ApiError(HttpStatus.BAD_REQUEST, 'Kho không tồn tại hoặc đã ngừng hoạt động');
  }

  if (supplierId) {
    const supplier = await goodsReceiptRepository.findSupplierById(supplierId);
    if (!supplier || supplier.status !== 'ACTIVE') {
      throw new ApiError(HttpStatus.BAD_REQUEST, 'Nhà cung cấp không tồn tại hoặc đã ngừng hoạt động');
    }
  }

  const normalizedItems = normalizeItems(items);
  const products = await goodsReceiptRepository.findProductsByIds(
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

export const goodsReceiptService = {
  async list(query) {
    const { page, limit, skip, sortBy, sortOrder } = parsePagination(query, 'createdAt');
    const where = buildWhere(query);

    const [items, total] = await Promise.all([
      goodsReceiptRepository.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
      goodsReceiptRepository.count(where),
    ]);

    return {
      items: items.map(mapReceipt),
      pagination: buildPagination(page, limit, total),
    };
  },

  async getById(id) {
    const receipt = await goodsReceiptRepository.findById(id);
    if (!receipt) {
      throw new ApiError(HttpStatus.NOT_FOUND, 'Không tìm thấy phiếu nhập');
    }
    return mapReceipt(receipt);
  },

  async create(payload, userId) {
    const items = await validateReferences(payload);
    const code = await generateCode();

    const receipt = await goodsReceiptRepository.create(
      {
        code,
        warehouseId: payload.warehouseId,
        supplierId: payload.supplierId || null,
        receiptDate: parseReceiptDate(payload.receiptDate),
        note: payload.note || null,
        createdById: userId,
        status: 'DRAFT',
      },
      items
    );

    return mapReceipt(receipt);
  },

  async update(id, payload) {
    const existing = await goodsReceiptRepository.findById(id);
    await assertDraft(existing);

    const items = await validateReferences(payload);

    const receipt = await prisma.$transaction((tx) =>
      goodsReceiptRepository.updateDraft(
        id,
        {
          warehouseId: payload.warehouseId,
          supplierId: payload.supplierId || null,
          receiptDate: parseReceiptDate(payload.receiptDate),
          note: payload.note || null,
        },
        items,
        tx
      )
    );

    return mapReceipt(receipt);
  },

  async confirm(id, userId, meta = {}) {
    const confirmed = await prisma.$transaction(async (tx) => {
      const receipt = await goodsReceiptRepository.findById(id, tx);
      await assertDraft(receipt);

      for (const item of receipt.items) {
        if (item.product.status !== 'ACTIVE') {
          throw new ApiError(HttpStatus.BAD_REQUEST, `Sản phẩm ${item.product.code} đã ngừng hoạt động`);
        }

        await inventoryRepository.increaseStock(
          receipt.warehouseId,
          item.productId,
          item.quantity,
          tx
        );
      }

      return goodsReceiptRepository.updateStatus(
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
      action: 'GOODS_RECEIPT_CONFIRM',
      module: 'goods-receipt',
      entityType: 'GoodsReceipt',
      entityId: confirmed.id,
      description: `Xác nhận phiếu nhập ${confirmed.code}`,
      newData: { code: confirmed.code, warehouseId: confirmed.warehouseId },
      ...meta,
    });

    return mapReceipt(confirmed);
  },

  async cancel(id) {
    const existing = await goodsReceiptRepository.findById(id);
    await assertDraft(existing);

    const cancelled = await goodsReceiptRepository.updateStatus(id, {
      status: 'CANCELLED',
    });

    return mapReceipt(cancelled);
  },

  async remove(id) {
    const existing = await goodsReceiptRepository.findById(id);
    await assertDraft(existing);
    await goodsReceiptRepository.delete(id);
    return null;
  },
};
