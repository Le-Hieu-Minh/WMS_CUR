import { prisma } from '../../config/database.js';
import { buildPagination, parsePagination } from '../../utils/pagination.js';
import { inventoryRepository } from './inventory.repository.js';

function toNumber(value) {
  return Number(value);
}

function mapInventory(item) {
  const quantity = toNumber(item.quantity);
  const minStock = item.product?.minStock ?? 0;
  const costPrice = toNumber(item.product?.costPrice ?? 0);

  return {
    id: item.id,
    warehouseId: item.warehouseId,
    warehouse: item.warehouse,
    productId: item.productId,
    product: item.product,
    quantity,
    minStock,
    isLowStock: quantity <= minStock,
    stockValue: quantity * costPrice,
    updatedAt: item.updatedAt,
    createdAt: item.createdAt,
  };
}

export const inventoryService = {
  async list(query) {
    const { page, limit, skip, sortBy, sortOrder } = parsePagination(query, 'updatedAt');

    const where = {};

    if (query.warehouseId) where.warehouseId = query.warehouseId;
    if (query.productId) where.productId = query.productId;

    if (query.search) {
      where.OR = [
        { product: { name: { contains: query.search, mode: 'insensitive' } } },
        { product: { code: { contains: query.search, mode: 'insensitive' } } },
        { warehouse: { name: { contains: query.search, mode: 'insensitive' } } },
        { warehouse: { code: { contains: query.search, mode: 'insensitive' } } },
      ];
    }

    if (query.lowStock) {
      // Prisma không so sánh cross-field dễ dàng → filter sau khi query hoặc raw
      // Dùng approach: lấy nhiều hơn rồi filter, hoặc dùng $queryRaw
      // MVP: findMany không skip trước, filter in memory cho lowStock khi bật
      const all = await prisma.inventory.findMany({
        where,
        include: {
          warehouse: { select: { id: true, code: true, name: true } },
          product: {
            select: {
              id: true,
              code: true,
              name: true,
              unit: true,
              minStock: true,
              costPrice: true,
              price: true,
              status: true,
            },
          },
        },
        orderBy: { [sortBy]: sortOrder },
      });

      const filtered = all
        .map(mapInventory)
        .filter((item) => item.isLowStock);

      const total = filtered.length;
      const items = filtered.slice(skip, skip + limit);

      return {
        items,
        pagination: buildPagination(page, limit, total),
      };
    }

    const [rows, total] = await Promise.all([
      inventoryRepository.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
      inventoryRepository.count(where),
    ]);

    return {
      items: rows.map(mapInventory),
      pagination: buildPagination(page, limit, total),
    };
  },
};
