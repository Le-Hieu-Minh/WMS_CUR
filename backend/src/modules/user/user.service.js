import bcrypt from 'bcryptjs';
import { authRepository } from '../auth/auth.repository.js';
import { ADMIN_ROLE_NAME } from '../../constants/roles.js';
import { ApiError, HttpStatus } from '../../utils/apiError.js';
import { buildPagination, parsePagination } from '../../utils/pagination.js';
import { userRepository } from './user.repository.js';

const BCRYPT_ROUNDS = 12;

function mapUser(user, { includeLockFields = false } = {}) {
  const base = {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    avatarUrl: user.avatarUrl,
    status: user.status,
    role: user.role,
    lastLoginAt: user.lastLoginAt,
    createdAt: user.createdAt,
  };

  if (includeLockFields) {
    return {
      ...base,
      failedLoginAttempts: user.failedLoginAttempts,
      lockedUntil: user.lockedUntil,
    };
  }

  return base;
}

function buildWhere(filters) {
  const where = {};

  if (filters.search) {
    where.OR = [
      { email: { contains: filters.search, mode: 'insensitive' } },
      { fullName: { contains: filters.search, mode: 'insensitive' } },
    ];
  }

  if (filters.status) {
    where.status = filters.status;
  }

  if (filters.roleId) {
    where.roleId = filters.roleId;
  }

  return where;
}

async function assertNotLastAdmin(userId, actionMessage) {
  const isAdmin = await userRepository.isAdminUser(userId);
  if (!isAdmin) return;

  const otherAdmins = await userRepository.countActiveAdmins(userId);
  if (otherAdmins === 0) {
    throw new ApiError(HttpStatus.CONFLICT, actionMessage);
  }
}

async function assertRoleExists(roleId) {
  const role = await userRepository.findRoleById(roleId);
  if (!role) {
    throw new ApiError(HttpStatus.BAD_REQUEST, 'Vai trò không tồn tại');
  }
  return role;
}

export const userService = {
  async listUsers(query) {
    const { page, limit, skip, sortBy, sortOrder } = parsePagination(query, 'createdAt');
    const where = buildWhere(query);

    const [items, total] = await Promise.all([
      userRepository.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
      userRepository.count(where),
    ]);

    return {
      items: items.map((user) => mapUser(user)),
      pagination: buildPagination(page, limit, total),
    };
  },

  async getUserById(id) {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new ApiError(HttpStatus.NOT_FOUND, 'Không tìm thấy người dùng');
    }
    return mapUser(user, { includeLockFields: true });
  },

  async createUser(payload) {
    const existing = await userRepository.findByEmail(payload.email);
    if (existing) {
      throw new ApiError(HttpStatus.CONFLICT, 'Email đã tồn tại');
    }

    await assertRoleExists(payload.roleId);

    const passwordHash = await bcrypt.hash(payload.password, BCRYPT_ROUNDS);

    const user = await userRepository.create({
      email: payload.email,
      fullName: payload.fullName,
      passwordHash,
      roleId: payload.roleId,
      avatarUrl: payload.avatarUrl ?? null,
      status: 'ACTIVE',
    });

    return mapUser(user);
  },

  async updateUser(id, payload, actorId) {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new ApiError(HttpStatus.NOT_FOUND, 'Không tìm thấy người dùng');
    }

    if (payload.roleId && payload.roleId !== user.roleId) {
      await assertRoleExists(payload.roleId);

      if (user.role.name === ADMIN_ROLE_NAME && user.status === 'ACTIVE') {
        await assertNotLastAdmin(id, 'Không thể đổi vai trò Admin cuối cùng');
      }
    }

    const updated = await userRepository.update(id, {
      ...(payload.fullName !== undefined && { fullName: payload.fullName }),
      ...(payload.roleId !== undefined && { roleId: payload.roleId }),
      ...(payload.avatarUrl !== undefined && { avatarUrl: payload.avatarUrl }),
    });

    return mapUser(updated);
  },

  async changeStatus(id, status, actorId) {
    if (id === actorId && status === 'INACTIVE') {
      throw new ApiError(HttpStatus.BAD_REQUEST, 'Không thể tự vô hiệu hóa tài khoản của mình');
    }

    const user = await userRepository.findById(id);
    if (!user) {
      throw new ApiError(HttpStatus.NOT_FOUND, 'Không tìm thấy người dùng');
    }

    if (status === 'INACTIVE' && user.status === 'ACTIVE' && user.role.name === ADMIN_ROLE_NAME) {
      await assertNotLastAdmin(id, 'Không thể vô hiệu hóa Admin cuối cùng');
    }

    const updated = await userRepository.update(id, { status });

    if (status === 'INACTIVE') {
      await authRepository.revokeAllUserTokens(id);
    }

    return mapUser(updated);
  },

  async unlockUser(id) {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new ApiError(HttpStatus.NOT_FOUND, 'Không tìm thấy người dùng');
    }

    const updated = await userRepository.update(id, {
      status: 'ACTIVE',
      failedLoginAttempts: 0,
      lockedUntil: null,
    });

    return mapUser(updated, { includeLockFields: true });
  },

  async resetPassword(id, newPassword) {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new ApiError(HttpStatus.NOT_FOUND, 'Không tìm thấy người dùng');
    }

    const passwordHash = await bcrypt.hash(newPassword, BCRYPT_ROUNDS);

    await userRepository.update(id, { passwordHash });
    await authRepository.revokeAllUserTokens(id);
  },

  async softDelete(id, actorId) {
    if (id === actorId) {
      throw new ApiError(HttpStatus.BAD_REQUEST, 'Không thể xóa tài khoản của chính mình');
    }

    return this.changeStatus(id, 'INACTIVE', actorId);
  },

  async listRoleOptions() {
    return userRepository.listRoleOptions();
  },

  mapUser,
};
