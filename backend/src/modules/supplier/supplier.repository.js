import { prisma } from '../../config/database.js';

export const supplierRepository = {
  findMany({ where, skip, take, orderBy }) {
    return prisma.supplier.findMany({ where, skip, take, orderBy });
  },

  count(where) {
    return prisma.supplier.count({ where });
  },

  findById(id) {
    return prisma.supplier.findUnique({ where: { id } });
  },

  findByCode(code) {
    return prisma.supplier.findUnique({ where: { code } });
  },

  create(data) {
    return prisma.supplier.create({ data });
  },

  update(id, data) {
    return prisma.supplier.update({ where: { id }, data });
  },
};
