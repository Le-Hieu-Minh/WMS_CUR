import { SYSTEM_ROLE_NAMES } from '../../constants/roles.js';
import { ApiError, HttpStatus } from '../../utils/apiError.js';
import { buildPagination, parsePagination } from '../../utils/pagination.js';
import { roleRepository } from './role.repository.js';

function mapRole(role) {
  return {
    id: role.id,
    name: role.name,
    description: role.description,
    isSystem: SYSTEM_ROLE_NAMES.includes(role.name),
    userCount: role._count?.users ?? 0,
    permissions: role.permissions?.map((item) => ({
      id: item.permission.id,
      code: item.permission.code,
      name: item.permission.name,
      module: item.permission.module,
    })) ?? [],
    createdAt: role.createdAt,
    updatedAt: role.updatedAt,
  };
}

function buildWhere(filters) {
  const where = {};

  if (filters.search) {
    where.OR = [
      { name: { contains: filters.search, mode: 'insensitive' } },
      { description: { contains: filters.search, mode: 'insensitive' } },
    ];
  }

  return where;
}

async function assertPermissionsExist(permissionIds) {
  const permissions = await roleRepository.findPermissionsByIds(permissionIds);
  if (permissions.length !== permissionIds.length) {
    throw new ApiError(HttpStatus.BAD_REQUEST, 'Một hoặc nhiều quyền không tồn tại');
  }
}

export const roleService = {
  async listRoles(query) {
    const { page, limit, skip, sortBy, sortOrder } = parsePagination(query, 'name');
    const where = buildWhere(query);

    const [items, total] = await Promise.all([
      roleRepository.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
      roleRepository.count(where),
    ]);

    return {
      items: items.map(mapRole),
      pagination: buildPagination(page, limit, total),
    };
  },

  async getRoleById(id) {
    const role = await roleRepository.findById(id);
    if (!role) {
      throw new ApiError(HttpStatus.NOT_FOUND, 'Không tìm thấy vai trò');
    }
    return mapRole(role);
  },

  async createRole(payload) {
    const existing = await roleRepository.findByName(payload.name);
    if (existing) {
      throw new ApiError(HttpStatus.CONFLICT, 'Tên vai trò đã tồn tại');
    }

    await assertPermissionsExist(payload.permissionIds);

    const role = await roleRepository.create(
      {
        name: payload.name,
        description: payload.description ?? null,
      },
      payload.permissionIds
    );

    return mapRole(role);
  },

  async updateRole(id, payload) {
    const role = await roleRepository.findById(id);
    if (!role) {
      throw new ApiError(HttpStatus.NOT_FOUND, 'Không tìm thấy vai trò');
    }

    const isSystem = SYSTEM_ROLE_NAMES.includes(role.name);

    if (payload.name && payload.name !== role.name) {
      if (isSystem) {
        throw new ApiError(HttpStatus.BAD_REQUEST, 'Không thể đổi tên vai trò hệ thống');
      }
      const existing = await roleRepository.findByName(payload.name);
      if (existing) {
        throw new ApiError(HttpStatus.CONFLICT, 'Tên vai trò đã tồn tại');
      }
    }

    if (payload.permissionIds) {
      await assertPermissionsExist(payload.permissionIds);
    }

    const updated = await roleRepository.update(
      id,
      {
        ...(payload.name !== undefined && { name: payload.name }),
        ...(payload.description !== undefined && { description: payload.description }),
      },
      payload.permissionIds
    );

    return mapRole(updated);
  },

  async deleteRole(id) {
    const role = await roleRepository.findById(id);
    if (!role) {
      throw new ApiError(HttpStatus.NOT_FOUND, 'Không tìm thấy vai trò');
    }

    if (SYSTEM_ROLE_NAMES.includes(role.name)) {
      throw new ApiError(HttpStatus.BAD_REQUEST, 'Không thể xóa vai trò hệ thống');
    }

    if (role._count.users > 0) {
      throw new ApiError(HttpStatus.CONFLICT, 'Không thể xóa vai trò đang được gán cho người dùng');
    }

    await roleRepository.delete(id);
  },

  async listPermissions() {
    const permissions = await roleRepository.listPermissions();
    const grouped = permissions.reduce((acc, permission) => {
      if (!acc[permission.module]) {
        acc[permission.module] = [];
      }
      acc[permission.module].push({
        id: permission.id,
        code: permission.code,
        name: permission.name,
      });
      return acc;
    }, {});

    return grouped;
  },

  mapRole,
};
