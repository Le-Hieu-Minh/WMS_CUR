import { prisma } from '../../config/database.js';

const roleSelect = {
  id: true,
  name: true,
};

const userInclude = {
  role: {
    select: roleSelect,
  },
};

export const userRepository = {
  findMany({ where, skip, take, orderBy }) {
    return prisma.user.findMany({
      where,
      skip,
      take,
      orderBy,
      include: userInclude,
    });
  },

  count(where) {
    return prisma.user.count({ where });
  },

  findById(id) {
    return prisma.user.findUnique({
      where: { id },
      include: userInclude,
    });
  },

  findByEmail(email) {
    return prisma.user.findUnique({
      where: { email },
      include: userInclude,
    });
  },

  create(data) {
    return prisma.user.create({
      data,
      include: userInclude,
    });
  },

  update(id, data) {
    return prisma.user.update({
      where: { id },
      data,
      include: userInclude,
    });
  },

  findRoleById(id) {
    return prisma.role.findUnique({ where: { id } });
  },

  listRoleOptions() {
    return prisma.role.findMany({
      select: roleSelect,
      orderBy: { name: 'asc' },
    });
  },

  countActiveAdmins(excludeUserId = null) {
    return prisma.user.count({
      where: {
        status: 'ACTIVE',
        role: { name: 'Admin' },
        ...(excludeUserId ? { id: { not: excludeUserId } } : {}),
      },
    });
  },

  isAdminUser(userId) {
    return prisma.user.findFirst({
      where: {
        id: userId,
        role: { name: 'Admin' },
      },
      select: { id: true },
    });
  },
};
