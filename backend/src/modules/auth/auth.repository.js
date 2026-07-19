import { prisma } from '../../config/database.js';

const userWithRoleInclude = {
  role: {
    include: {
      permissions: {
        include: {
          permission: true,
        },
      },
    },
  },
};

export const authRepository = {
  findUserByEmail(email) {
    return prisma.user.findUnique({
      where: { email },
      include: userWithRoleInclude,
    });
  },

  findUserById(id) {
    return prisma.user.findUnique({
      where: { id },
      include: userWithRoleInclude,
    });
  },

  saveRefreshToken(data) {
    return prisma.refreshToken.create({ data });
  },

  findRefreshToken(tokenHash) {
    return prisma.refreshToken.findUnique({
      where: { tokenHash },
      include: {
        user: {
          include: userWithRoleInclude,
        },
      },
    });
  },

  revokeRefreshToken(tokenHash) {
    return prisma.refreshToken.update({
      where: { tokenHash },
      data: { revokedAt: new Date() },
    });
  },

  revokeAllUserTokens(userId) {
    return prisma.refreshToken.updateMany({
      where: {
        userId,
        revokedAt: null,
      },
      data: { revokedAt: new Date() },
    });
  },

  updatePassword(userId, passwordHash) {
    return prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    });
  },

  resetLoginAttempts(userId) {
    return prisma.user.update({
      where: { id: userId },
      data: {
        failedLoginAttempts: 0,
        lockedUntil: null,
        lastLoginAt: new Date(),
      },
    });
  },

  incrementLoginAttempts(userId, failedLoginAttempts, lockedUntil = null) {
    return prisma.user.update({
      where: { id: userId },
      data: {
        failedLoginAttempts,
        lockedUntil,
        status: lockedUntil ? 'LOCKED' : undefined,
      },
    });
  },

  unlockUserIfExpired(userId) {
    return prisma.user.update({
      where: { id: userId },
      data: {
        status: 'ACTIVE',
        failedLoginAttempts: 0,
        lockedUntil: null,
      },
    });
  },
};
