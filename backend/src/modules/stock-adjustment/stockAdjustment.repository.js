import { prisma } from '../../config/database.js';

const listInclude = {
  warehouse: { select: { id: true, code: true, name: true } },
  createdBy: { select: { id: true, fullName: true, email: true } },
  _count: { select: { items: true } },
};

const detailInclude = {
  warehouse: { select: { id: true, code: true, name: true, status: true } },
  createdBy: { select: { id: true, fullName: true, email: true } },
  confirmedBy: { select: { id: true, fullName: true, email: true } },
  items: {
    include: {
      product: {
        select: { id: true, code: true, name: true, unit: true, status: true },
      },
    },
    orderBy: { createdAt: 'asc' },
  },
};

export const stockAdjustmentRepository = {
  findMany({ where, skip, take, orderBy }) {
    return prisma.stockAdjustment.findMany({ where, skip, take, orderBy, include: listInclude });
  },
  count(where) {
    return prisma.stockAdjustment.count({ where });
  },
  findById(id, tx = prisma) {
    return tx.stockAdjustment.findUnique({ where: { id }, include: detailInclude });
  },
  countByCodePrefix(prefix) {
    return prisma.stockAdjustment.count({ where: { code: { startsWith: prefix } } });
  },
  create(data, items, tx = prisma) {
    return tx.stockAdjustment.create({
      data: { ...data, items: { create: items } },
      include: detailInclude,
    });
  },
  async updateDraft(id, data, items, tx = prisma) {
    await tx.stockAdjustmentItem.deleteMany({ where: { stockAdjustmentId: id } });
    return tx.stockAdjustment.update({
      where: { id },
      data: { ...data, items: { create: items } },
      include: detailInclude,
    });
  },
  updateStatus(id, data, tx = prisma) {
    return tx.stockAdjustment.update({ where: { id }, data, include: detailInclude });
  },
  delete(id) {
    return prisma.stockAdjustment.delete({ where: { id } });
  },
  findWarehouseById(id) {
    return prisma.warehouse.findUnique({ where: { id } });
  },
  findProductsByIds(ids) {
    return prisma.product.findMany({ where: { id: { in: ids } } });
  },
};
