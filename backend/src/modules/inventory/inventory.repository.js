import { prisma } from '../../config/database.js';

export const inventoryRepository = {
  findByWarehouseAndProduct(warehouseId, productId, tx = prisma) {
    return tx.inventory.findUnique({
      where: {
        warehouseId_productId: { warehouseId, productId },
      },
    });
  },

  findMany({ where, skip, take, orderBy }) {
    return prisma.inventory.findMany({
      where,
      skip,
      take,
      orderBy,
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
    });
  },

  count(where) {
    return prisma.inventory.count({ where });
  },

  async increaseStock(warehouseId, productId, quantity, tx = prisma) {
    const existing = await tx.inventory.findUnique({
      where: {
        warehouseId_productId: { warehouseId, productId },
      },
    });

    if (existing) {
      return tx.inventory.update({
        where: { id: existing.id },
        data: { quantity: { increment: quantity } },
      });
    }

    return tx.inventory.create({
      data: {
        warehouseId,
        productId,
        quantity,
      },
    });
  },

  async decreaseStock(warehouseId, productId, quantity, tx = prisma) {
    const existing = await tx.inventory.findUnique({
      where: {
        warehouseId_productId: { warehouseId, productId },
      },
    });

    const currentQty = existing ? Number(existing.quantity) : 0;
    const decreaseQty = Number(quantity);

    if (!existing || currentQty < decreaseQty) {
      return { ok: false, available: currentQty };
    }

    const updated = await tx.inventory.update({
      where: { id: existing.id },
      data: { quantity: { decrement: decreaseQty } },
    });

    return { ok: true, inventory: updated, available: currentQty };
  },

  async setStock(warehouseId, productId, quantity, tx = prisma) {
    const existing = await tx.inventory.findUnique({
      where: {
        warehouseId_productId: { warehouseId, productId },
      },
    });

    if (existing) {
      return tx.inventory.update({
        where: { id: existing.id },
        data: { quantity },
      });
    }

    return tx.inventory.create({
      data: {
        warehouseId,
        productId,
        quantity,
      },
    });
  },

  findByWarehouse(warehouseId) {
    return prisma.inventory.findMany({
      where: { warehouseId },
      include: {
        product: {
          select: {
            id: true,
            code: true,
            name: true,
            unit: true,
            status: true,
          },
        },
      },
      orderBy: { product: { code: 'asc' } },
    });
  },
};
