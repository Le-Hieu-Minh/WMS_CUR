import { prisma } from '../../config/database.js';

export const warehouseRepository = {
  findMany({ where, skip, take, orderBy }) {
    return prisma.warehouse.findMany({ where, skip, take, orderBy });
  },

  count(where) {
    return prisma.warehouse.count({ where });
  },

  findById(id) {
    return prisma.warehouse.findUnique({ where: { id } });
  },

  findByCode(code) {
    return prisma.warehouse.findUnique({ where: { code } });
  },

  create(data) {
    return prisma.warehouse.create({ data });
  },

  update(id, data) {
    return prisma.warehouse.update({ where: { id }, data });
  },
};
