import { prisma } from '../../config/database.js';

const listInclude = {
  warehouse: { select: { id: true, code: true, name: true } },
  customer: { select: { id: true, code: true, name: true } },
  createdBy: { select: { id: true, fullName: true, email: true } },
  _count: { select: { items: true } },
};

const detailInclude = {
  warehouse: { select: { id: true, code: true, name: true, status: true } },
  customer: { select: { id: true, code: true, name: true, status: true } },
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
          price: true,
        },
      },
    },
    orderBy: { createdAt: 'asc' },
  },
};

export const goodsIssueRepository = {
  findMany({ where, skip, take, orderBy }) {
    return prisma.goodsIssue.findMany({
      where,
      skip,
      take,
      orderBy,
      include: listInclude,
    });
  },

  count(where) {
    return prisma.goodsIssue.count({ where });
  },

  findById(id, tx = prisma) {
    return tx.goodsIssue.findUnique({
      where: { id },
      include: detailInclude,
    });
  },

  countByCodePrefix(prefix) {
    return prisma.goodsIssue.count({
      where: { code: { startsWith: prefix } },
    });
  },

  create(data, items, tx = prisma) {
    return tx.goodsIssue.create({
      data: {
        ...data,
        items: { create: items },
      },
      include: detailInclude,
    });
  },

  async updateDraft(id, data, items, tx = prisma) {
    await tx.goodsIssueItem.deleteMany({ where: { goodsIssueId: id } });

    return tx.goodsIssue.update({
      where: { id },
      data: {
        ...data,
        items: { create: items },
      },
      include: detailInclude,
    });
  },

  updateStatus(id, data, tx = prisma) {
    return tx.goodsIssue.update({
      where: { id },
      data,
      include: detailInclude,
    });
  },

  delete(id) {
    return prisma.goodsIssue.delete({ where: { id } });
  },

  findWarehouseById(id) {
    return prisma.warehouse.findUnique({ where: { id } });
  },

  findCustomerById(id) {
    return prisma.customer.findUnique({ where: { id } });
  },

  findProductsByIds(ids) {
    return prisma.product.findMany({
      where: { id: { in: ids } },
    });
  },
};
