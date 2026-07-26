import { prisma } from '../../config/database.js';

const listInclude = {
  warehouse: { select: { id: true, code: true, name: true } },
  supplier: { select: { id: true, code: true, name: true } },
  createdBy: { select: { id: true, fullName: true, email: true } },
  _count: { select: { items: true } },
};

const detailInclude = {
  warehouse: { select: { id: true, code: true, name: true, status: true } },
  supplier: { select: { id: true, code: true, name: true, status: true } },
  createdBy: { select: { id: true, fullName: true, email: true } },
  confirmedBy: { select: { id: true, fullName: true, email: true } },
  items: {
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
    orderBy: { createdAt: 'asc' },
  },
};

export const goodsReceiptRepository = {
  findMany({ where, skip, take, orderBy }) {
    return prisma.goodsReceipt.findMany({
      where,
      skip,
      take,
      orderBy,
      include: listInclude,
    });
  },

  count(where) {
    return prisma.goodsReceipt.count({ where });
  },

  findById(id, tx = prisma) {
    return tx.goodsReceipt.findUnique({
      where: { id },
      include: detailInclude,
    });
  },

  findByCode(code) {
    return prisma.goodsReceipt.findUnique({ where: { code } });
  },

  countByCodePrefix(prefix) {
    return prisma.goodsReceipt.count({
      where: { code: { startsWith: prefix } },
    });
  },

  create(data, items, tx = prisma) {
    return tx.goodsReceipt.create({
      data: {
        ...data,
        items: {
          create: items,
        },
      },
      include: detailInclude,
    });
  },

  async updateDraft(id, data, items, tx = prisma) {
    await tx.goodsReceiptItem.deleteMany({ where: { goodsReceiptId: id } });

    return tx.goodsReceipt.update({
      where: { id },
      data: {
        ...data,
        items: {
          create: items,
        },
      },
      include: detailInclude,
    });
  },

  updateStatus(id, data, tx = prisma) {
    return tx.goodsReceipt.update({
      where: { id },
      data,
      include: detailInclude,
    });
  },

  delete(id) {
    return prisma.goodsReceipt.delete({ where: { id } });
  },

  findWarehouseById(id) {
    return prisma.warehouse.findUnique({ where: { id } });
  },

  findSupplierById(id) {
    return prisma.supplier.findUnique({ where: { id } });
  },

  findProductsByIds(ids) {
    return prisma.product.findMany({
      where: { id: { in: ids } },
    });
  },
};
