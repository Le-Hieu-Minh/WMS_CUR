import { prisma } from '../../config/database.js';

const permissionInclude = {
  permissions: {
    include: {
      permission: true,
    },
  },
};

export const roleRepository = {
  findMany({ where, skip, take, orderBy }) {
    return prisma.role.findMany({
      where,
      skip,
      take,
      orderBy,
      include: {
        _count: { select: { users: true } },
        permissions: { include: { permission: true } },
      },
    });
  },

  count(where) {
    return prisma.role.count({ where });
  },

  findById(id) {
    return prisma.role.findUnique({
      where: { id },
      include: {
        ...permissionInclude,
        _count: { select: { users: true } },
      },
    });
  },

  findByName(name) {
    return prisma.role.findUnique({ where: { name } });
  },

  create(data, permissionIds) {
    return prisma.$transaction(async (tx) => {
      const role = await tx.role.create({ data });

      await tx.rolePermission.createMany({
        data: permissionIds.map((permissionId) => ({
          roleId: role.id,
          permissionId,
        })),
      });

      return tx.role.findUnique({
        where: { id: role.id },
        include: {
          ...permissionInclude,
          _count: { select: { users: true } },
        },
      });
    });
  },

  update(id, data, permissionIds) {
    return prisma.$transaction(async (tx) => {
      await tx.role.update({ where: { id }, data });

      if (permissionIds) {
        await tx.rolePermission.deleteMany({ where: { roleId: id } });
        await tx.rolePermission.createMany({
          data: permissionIds.map((permissionId) => ({
            roleId: id,
            permissionId,
          })),
        });
      }

      return tx.role.findUnique({
        where: { id },
        include: {
          ...permissionInclude,
          _count: { select: { users: true } },
        },
      });
    });
  },

  delete(id) {
    return prisma.role.delete({ where: { id } });
  },

  listPermissions() {
    return prisma.permission.findMany({
      orderBy: [{ module: 'asc' }, { code: 'asc' }],
    });
  },

  findPermissionsByIds(ids) {
    return prisma.permission.findMany({
      where: { id: { in: ids } },
    });
  },
};
