import { prisma } from '../../config/database.js';
import { ApiError, HttpStatus } from '../../utils/apiError.js';
import { buildPagination, parsePagination } from '../../utils/pagination.js';
import { inventoryRepository } from '../inventory/inventory.repository.js';
import { auditService } from '../audit-log/audit.service.js';
import { stockAdjustmentRepository } from './stockAdjustment.repository.js';

function toNumber(value) {
  return Number(value);
}

function mapItem(item) {
  return {
    id: item.id,
    productId: item.productId,
    product: item.product,
    type: item.type,
    quantity: toNumber(item.quantity),
    note: item.note,
  };
}

function mapDoc(doc) {
  return {
    id: doc.id,
    code: doc.code,
    warehouseId: doc.warehouseId,
    warehouse: doc.warehouse,
    status: doc.status,
    adjustDate: doc.adjustDate,
    reason: doc.reason,
    note: doc.note,
    createdBy: doc.createdBy,
    confirmedBy: doc.confirmedBy ?? null,
    confirmedAt: doc.confirmedAt,
    itemCount: doc._count?.items ?? doc.items?.length ?? 0,
    items: doc.items ? doc.items.map(mapItem) : undefined,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

function buildWhere(filters) {
  const where = {};
  if (filters.search) {
    where.OR = [
      { code: { contains: filters.search, mode: 'insensitive' } },
      { reason: { contains: filters.search, mode: 'insensitive' } },
      { note: { contains: filters.search, mode: 'insensitive' } },
    ];
  }
  if (filters.status) where.status = filters.status;
  if (filters.warehouseId) where.warehouseId = filters.warehouseId;
  return where;
}

function parseDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new ApiError(HttpStatus.BAD_REQUEST, 'Ngày điều chỉnh không hợp lệ');
  }
  return date;
}

async function generateCode() {
  const now = new Date();
  const prefix = `SA-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-`;
  const count = await stockAdjustmentRepository.countByCodePrefix(prefix);
  return `${prefix}${String(count + 1).padStart(4, '0')}`;
}

async function assertDraft(doc) {
  if (!doc) throw new ApiError(HttpStatus.NOT_FOUND, 'Không tìm thấy phiếu điều chỉnh');
  if (doc.status !== 'DRAFT') {
    throw new ApiError(HttpStatus.CONFLICT, 'Chỉ thao tác được trên phiếu ở trạng thái Nháp');
  }
}

async function validateItems(warehouseId, items) {
  const warehouse = await stockAdjustmentRepository.findWarehouseById(warehouseId);
  if (!warehouse || warehouse.status !== 'ACTIVE') {
    throw new ApiError(HttpStatus.BAD_REQUEST, 'Kho không tồn tại hoặc đã ngừng hoạt động');
  }

  const productIds = items.map((i) => i.productId);
  if (new Set(productIds).size !== productIds.length) {
    throw new ApiError(HttpStatus.BAD_REQUEST, 'Không được trùng sản phẩm trong cùng phiếu');
  }

  const products = await stockAdjustmentRepository.findProductsByIds(productIds);
  if (products.length !== productIds.length) {
    throw new ApiError(HttpStatus.BAD_REQUEST, 'Có sản phẩm không tồn tại');
  }
  const inactive = products.find((p) => p.status !== 'ACTIVE');
  if (inactive) {
    throw new ApiError(HttpStatus.BAD_REQUEST, `Sản phẩm ${inactive.code} đã ngừng hoạt động`);
  }

  return items.map((item) => ({
    productId: item.productId,
    type: item.type,
    quantity: item.quantity,
    note: item.note || null,
  }));
}

export const stockAdjustmentService = {
  async list(query) {
    const { page, limit, skip, sortBy, sortOrder } = parsePagination(query, 'createdAt');
    const where = buildWhere(query);
    const [items, total] = await Promise.all([
      stockAdjustmentRepository.findMany({ where, skip, take: limit, orderBy: { [sortBy]: sortOrder } }),
      stockAdjustmentRepository.count(where),
    ]);
    return { items: items.map(mapDoc), pagination: buildPagination(page, limit, total) };
  },

  async getById(id) {
    const doc = await stockAdjustmentRepository.findById(id);
    if (!doc) throw new ApiError(HttpStatus.NOT_FOUND, 'Không tìm thấy phiếu điều chỉnh');
    return mapDoc(doc);
  },

  async create(payload, userId) {
    const items = await validateItems(payload.warehouseId, payload.items);
    const code = await generateCode();
    const doc = await stockAdjustmentRepository.create(
      {
        code,
        warehouseId: payload.warehouseId,
        adjustDate: parseDate(payload.adjustDate),
        reason: payload.reason.trim(),
        note: payload.note || null,
        createdById: userId,
        status: 'DRAFT',
      },
      items
    );
    return mapDoc(doc);
  },

  async update(id, payload) {
    const existing = await stockAdjustmentRepository.findById(id);
    await assertDraft(existing);
    const items = await validateItems(payload.warehouseId, payload.items);
    const doc = await prisma.$transaction((tx) =>
      stockAdjustmentRepository.updateDraft(
        id,
        {
          warehouseId: payload.warehouseId,
          adjustDate: parseDate(payload.adjustDate),
          reason: payload.reason.trim(),
          note: payload.note || null,
        },
        items,
        tx
      )
    );
    return mapDoc(doc);
  },

  async confirm(id, userId, meta = {}) {
    const confirmed = await prisma.$transaction(async (tx) => {
      const doc = await stockAdjustmentRepository.findById(id, tx);
      await assertDraft(doc);

      for (const item of doc.items) {
        if (item.product.status !== 'ACTIVE') {
          throw new ApiError(HttpStatus.BAD_REQUEST, `Sản phẩm ${item.product.code} đã ngừng hoạt động`);
        }

        if (item.type === 'INCREASE') {
          await inventoryRepository.increaseStock(doc.warehouseId, item.productId, item.quantity, tx);
        } else {
          const result = await inventoryRepository.decreaseStock(
            doc.warehouseId,
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
      }

      return stockAdjustmentRepository.updateStatus(
        id,
        { status: 'CONFIRMED', confirmedById: userId, confirmedAt: new Date() },
        tx
      );
    });

    await auditService.log({
      userId,
      action: 'STOCK_ADJUSTMENT_CONFIRM',
      module: 'stock-adjustment',
      entityType: 'StockAdjustment',
      entityId: confirmed.id,
      description: `Xác nhận phiếu điều chỉnh ${confirmed.code}`,
      newData: { code: confirmed.code, warehouseId: confirmed.warehouseId },
      ...meta,
    });

    return mapDoc(confirmed);
  },

  async cancel(id) {
    const existing = await stockAdjustmentRepository.findById(id);
    await assertDraft(existing);
    return mapDoc(await stockAdjustmentRepository.updateStatus(id, { status: 'CANCELLED' }));
  },

  async remove(id) {
    const existing = await stockAdjustmentRepository.findById(id);
    await assertDraft(existing);
    await stockAdjustmentRepository.delete(id);
    return null;
  },
};
