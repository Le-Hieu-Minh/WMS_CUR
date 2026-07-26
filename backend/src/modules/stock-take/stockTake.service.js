import { prisma } from '../../config/database.js';
import { ApiError, HttpStatus } from '../../utils/apiError.js';
import { buildPagination, parsePagination } from '../../utils/pagination.js';
import { auditService } from '../audit-log/audit.service.js';
import { inventoryRepository } from '../inventory/inventory.repository.js';
import { stockTakeRepository } from './stockTake.repository.js';

function toNumber(value) {
  return Number(value);
}

function mapItem(item) {
  const systemQty = toNumber(item.systemQty);
  const countedQty = toNumber(item.countedQty);

  return {
    id: item.id,
    productId: item.productId,
    product: item.product,
    systemQty,
    countedQty,
    variance: countedQty - systemQty,
    note: item.note,
  };
}

function mapStockTake(doc) {
  return {
    id: doc.id,
    code: doc.code,
    warehouseId: doc.warehouseId,
    warehouse: doc.warehouse,
    status: doc.status,
    takeDate: doc.takeDate,
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
      { note: { contains: filters.search, mode: 'insensitive' } },
    ];
  }

  if (filters.status) where.status = filters.status;
  if (filters.warehouseId) where.warehouseId = filters.warehouseId;

  return where;
}

function parseTakeDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new ApiError(HttpStatus.BAD_REQUEST, 'Ngày kiểm kê không hợp lệ');
  }
  return date;
}

async function generateCode() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const prefix = `ST-${yyyy}${mm}${dd}-`;
  const count = await stockTakeRepository.countByCodePrefix(prefix);
  return `${prefix}${String(count + 1).padStart(4, '0')}`;
}

async function assertDraft(doc) {
  if (!doc) {
    throw new ApiError(HttpStatus.NOT_FOUND, 'Không tìm thấy phiếu kiểm kê');
  }
  if (doc.status !== 'DRAFT') {
    throw new ApiError(HttpStatus.CONFLICT, 'Chỉ thao tác được trên phiếu ở trạng thái Nháp');
  }
}

async function buildItemsWithSnapshot(warehouseId, items) {
  const productIds = items.map((item) => item.productId);
  if (new Set(productIds).size !== productIds.length) {
    throw new ApiError(HttpStatus.BAD_REQUEST, 'Không được trùng sản phẩm trong cùng phiếu kiểm kê');
  }

  const products = await stockTakeRepository.findProductsByIds(productIds);
  if (products.length !== productIds.length) {
    throw new ApiError(HttpStatus.BAD_REQUEST, 'Có sản phẩm không tồn tại');
  }

  const inactive = products.find((p) => p.status !== 'ACTIVE');
  if (inactive) {
    throw new ApiError(HttpStatus.BAD_REQUEST, `Sản phẩm ${inactive.code} đã ngừng hoạt động`);
  }

  const result = [];
  for (const item of items) {
    const inventory = await inventoryRepository.findByWarehouseAndProduct(warehouseId, item.productId);
    result.push({
      productId: item.productId,
      systemQty: inventory ? Number(inventory.quantity) : 0,
      countedQty: item.countedQty,
      note: item.note || null,
    });
  }

  return result;
}

export const stockTakeService = {
  async list(query) {
    const { page, limit, skip, sortBy, sortOrder } = parsePagination(query, 'createdAt');
    const where = buildWhere(query);

    const [items, total] = await Promise.all([
      stockTakeRepository.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
      stockTakeRepository.count(where),
    ]);

    return {
      items: items.map(mapStockTake),
      pagination: buildPagination(page, limit, total),
    };
  },

  async getById(id) {
    const doc = await stockTakeRepository.findById(id);
    if (!doc) {
      throw new ApiError(HttpStatus.NOT_FOUND, 'Không tìm thấy phiếu kiểm kê');
    }
    return mapStockTake(doc);
  },

  async getWarehouseProducts(warehouseId) {
    const warehouse = await stockTakeRepository.findWarehouseById(warehouseId);
    if (!warehouse || warehouse.status !== 'ACTIVE') {
      throw new ApiError(HttpStatus.BAD_REQUEST, 'Kho không tồn tại hoặc đã ngừng hoạt động');
    }

    const inventories = await inventoryRepository.findByWarehouse(warehouseId);

    return inventories
      .filter((row) => row.product.status === 'ACTIVE')
      .map((row) => ({
        productId: row.productId,
        product: row.product,
        systemQty: toNumber(row.quantity),
        countedQty: toNumber(row.quantity),
      }));
  },

  async create(payload, userId) {
    const warehouse = await stockTakeRepository.findWarehouseById(payload.warehouseId);
    if (!warehouse || warehouse.status !== 'ACTIVE') {
      throw new ApiError(HttpStatus.BAD_REQUEST, 'Kho không tồn tại hoặc đã ngừng hoạt động');
    }

    const items = await buildItemsWithSnapshot(payload.warehouseId, payload.items);
    const code = await generateCode();

    const doc = await stockTakeRepository.create(
      {
        code,
        warehouseId: payload.warehouseId,
        takeDate: parseTakeDate(payload.takeDate),
        note: payload.note || null,
        createdById: userId,
        status: 'DRAFT',
      },
      items
    );

    return mapStockTake(doc);
  },

  async update(id, payload) {
    const existing = await stockTakeRepository.findById(id);
    await assertDraft(existing);

    const warehouse = await stockTakeRepository.findWarehouseById(payload.warehouseId);
    if (!warehouse || warehouse.status !== 'ACTIVE') {
      throw new ApiError(HttpStatus.BAD_REQUEST, 'Kho không tồn tại hoặc đã ngừng hoạt động');
    }

    const items = await buildItemsWithSnapshot(payload.warehouseId, payload.items);

    const doc = await prisma.$transaction((tx) =>
      stockTakeRepository.updateDraft(
        id,
        {
          warehouseId: payload.warehouseId,
          takeDate: parseTakeDate(payload.takeDate),
          note: payload.note || null,
        },
        items,
        tx
      )
    );

    return mapStockTake(doc);
  },

  async confirm(id, userId, meta = {}) {
    const confirmed = await prisma.$transaction(async (tx) => {
      const doc = await stockTakeRepository.findById(id, tx);
      await assertDraft(doc);

      for (const item of doc.items) {
        if (item.product.status !== 'ACTIVE') {
          throw new ApiError(HttpStatus.BAD_REQUEST, `Sản phẩm ${item.product.code} đã ngừng hoạt động`);
        }

        await inventoryRepository.setStock(doc.warehouseId, item.productId, item.countedQty, tx);
      }

      return stockTakeRepository.updateStatus(
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
      action: 'STOCK_TAKE_CONFIRM',
      module: 'stock-take',
      entityType: 'StockTake',
      entityId: confirmed.id,
      description: `Xác nhận phiếu kiểm kê ${confirmed.code}`,
      newData: { code: confirmed.code, warehouseId: confirmed.warehouseId },
      ...meta,
    });

    return mapStockTake(confirmed);
  },

  async cancel(id) {
    const existing = await stockTakeRepository.findById(id);
    await assertDraft(existing);

    const cancelled = await stockTakeRepository.updateStatus(id, {
      status: 'CANCELLED',
    });

    return mapStockTake(cancelled);
  },

  async remove(id) {
    const existing = await stockTakeRepository.findById(id);
    await assertDraft(existing);
    await stockTakeRepository.delete(id);
    return null;
  },
};
