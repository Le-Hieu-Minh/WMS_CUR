import { prisma } from '../../config/database.js';

export const productRepository = {
  findMany({ where, skip, take, orderBy }) {
    return prisma.product.findMany({ where, skip, take, orderBy });
  },

  count(where) {
    return prisma.product.count({ where });
  },

  findById(id) {
    return prisma.product.findUnique({ where: { id } });
  },

  findByCode(code) {
    return prisma.product.findUnique({ where: { code } });
  },

  create(data) {
    return prisma.product.create({ data });
  },

  update(id, data) {
    return prisma.product.update({ where: { id }, data });
  },
};
