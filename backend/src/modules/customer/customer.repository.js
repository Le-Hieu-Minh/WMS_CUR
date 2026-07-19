import { prisma } from '../../config/database.js';

export const customerRepository = {
  findMany({ where, skip, take, orderBy }) {
    return prisma.customer.findMany({ where, skip, take, orderBy });
  },

  count(where) {
    return prisma.customer.count({ where });
  },

  findById(id) {
    return prisma.customer.findUnique({ where: { id } });
  },

  findByCode(code) {
    return prisma.customer.findUnique({ where: { code } });
  },

  create(data) {
    return prisma.customer.create({ data });
  },

  update(id, data) {
    return prisma.customer.update({ where: { id }, data });
  },
};
