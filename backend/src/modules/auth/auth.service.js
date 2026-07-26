import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env.js';
import { ApiError, HttpStatus } from '../../utils/apiError.js';
import { auditService } from '../audit-log/audit.service.js';
import { authRepository } from './auth.repository.js';

const MAX_FAILED_ATTEMPTS = 5;
const LOCK_DURATION_MINUTES = 15;
const BCRYPT_ROUNDS = 12;

function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

function getPermissions(user) {
  return user.role.permissions.map((item) => item.permission.code);
}

function mapUserResponse(user) {
  return {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    avatarUrl: user.avatarUrl,
    status: user.status,
    role: {
      id: user.role.id,
      name: user.role.name,
      permissions: getPermissions(user),
    },
    lastLoginAt: user.lastLoginAt,
  };
}

function createAccessToken(user) {
  const permissions = getPermissions(user);

  return jwt.sign(
    {
      email: user.email,
      roleId: user.role.id,
      roleName: user.role.name,
      permissions,
    },
    env.JWT_ACCESS_SECRET,
    {
      subject: user.id,
      expiresIn: env.JWT_ACCESS_EXPIRES_IN,
    }
  );
}

function createRefreshToken(user) {
  return jwt.sign(
    {
      type: 'refresh',
    },
    env.JWT_REFRESH_SECRET,
    {
      subject: user.id,
      expiresIn: env.JWT_REFRESH_EXPIRES_IN,
    }
  );
}

function getExpiresInSeconds(duration) {
  const match = duration.match(/^(\d+)([smhd])$/);
  if (!match) return 900;

  const value = Number(match[1]);
  const unit = match[2];

  switch (unit) {
    case 's':
      return value;
    case 'm':
      return value * 60;
    case 'h':
      return value * 3600;
    case 'd':
      return value * 86400;
    default:
      return 900;
  }
}

async function saveRefreshToken(userId, refreshToken, meta = {}) {
  const decoded = jwt.decode(refreshToken);
  const expiresAt = decoded?.exp ? new Date(decoded.exp * 1000) : new Date(Date.now() + 7 * 86400000);

  await authRepository.saveRefreshToken({
    userId,
    tokenHash: hashToken(refreshToken),
    expiresAt,
    ipAddress: meta.ipAddress || null,
    userAgent: meta.userAgent || null,
  });
}

function assertAccountCanLogin(user) {
  if (!user) {
    throw new ApiError(HttpStatus.UNAUTHORIZED, 'Email hoặc mật khẩu không đúng');
  }

  if (user.status === 'INACTIVE') {
    throw new ApiError(HttpStatus.FORBIDDEN, 'Tài khoản đã bị vô hiệu hóa');
  }

  if (user.lockedUntil && user.lockedUntil > new Date()) {
    const minutesLeft = Math.ceil((user.lockedUntil.getTime() - Date.now()) / 60000);
    throw new ApiError(HttpStatus.LOCKED, `Tài khoản tạm khóa, thử lại sau ${minutesLeft} phút`);
  }
}

async function handleFailedLogin(user) {
  const attempts = user.failedLoginAttempts + 1;

  if (attempts >= MAX_FAILED_ATTEMPTS) {
    const lockedUntil = new Date(Date.now() + LOCK_DURATION_MINUTES * 60 * 1000);
    await authRepository.incrementLoginAttempts(user.id, attempts, lockedUntil);
    throw new ApiError(
      HttpStatus.LOCKED,
      `Tài khoản tạm khóa, thử lại sau ${LOCK_DURATION_MINUTES} phút`
    );
  }

  await authRepository.incrementLoginAttempts(user.id, attempts);
  throw new ApiError(HttpStatus.UNAUTHORIZED, 'Email hoặc mật khẩu không đúng');
}

export const authService = {
  async login(email, password, meta = {}) {
    const normalizedEmail = email.trim().toLowerCase();
    const user = await authRepository.findUserByEmail(normalizedEmail);

    if (user?.lockedUntil && user.lockedUntil <= new Date()) {
      await authRepository.unlockUserIfExpired(user.id);
      user.status = 'ACTIVE';
      user.failedLoginAttempts = 0;
      user.lockedUntil = null;
    }

    assertAccountCanLogin(user);

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      await handleFailedLogin(user);
    }

    const accessToken = createAccessToken(user);
    const refreshToken = createRefreshToken(user);

    await saveRefreshToken(user.id, refreshToken, meta);
    await authRepository.resetLoginAttempts(user.id);

    const updatedUser = await authRepository.findUserById(user.id);

    await auditService.log({
      userId: user.id,
      action: 'LOGIN',
      module: 'auth',
      entityType: 'User',
      entityId: user.id,
      description: `Đăng nhập: ${normalizedEmail}`,
      ipAddress: meta.ipAddress,
      userAgent: meta.userAgent,
    });

    return {
      accessToken,
      refreshToken,
      expiresIn: getExpiresInSeconds(env.JWT_ACCESS_EXPIRES_IN),
      user: mapUserResponse(updatedUser),
    };
  },

  async refresh(refreshToken) {
    let decoded;

    try {
      decoded = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET);
    } catch {
      throw new ApiError(HttpStatus.UNAUTHORIZED, 'Refresh token không hợp lệ');
    }

    const tokenRecord = await authRepository.findRefreshToken(hashToken(refreshToken));

    if (!tokenRecord || tokenRecord.revokedAt) {
      throw new ApiError(HttpStatus.UNAUTHORIZED, 'Refresh token không hợp lệ');
    }

    if (tokenRecord.expiresAt <= new Date()) {
      throw new ApiError(HttpStatus.UNAUTHORIZED, 'Refresh token đã hết hạn');
    }

    if (tokenRecord.user.status === 'INACTIVE') {
      throw new ApiError(HttpStatus.FORBIDDEN, 'Tài khoản đã bị vô hiệu hóa');
    }

    const accessToken = createAccessToken(tokenRecord.user);

    return {
      accessToken,
      expiresIn: getExpiresInSeconds(env.JWT_ACCESS_EXPIRES_IN),
    };
  },

  async logout(refreshToken, userId = null, meta = {}) {
    const tokenHash = hashToken(refreshToken);
    const tokenRecord = await authRepository.findRefreshToken(tokenHash);

    if (!tokenRecord || tokenRecord.revokedAt) {
      return;
    }

    await authRepository.revokeRefreshToken(tokenHash);

    await auditService.log({
      userId: userId || tokenRecord.userId,
      action: 'LOGOUT',
      module: 'auth',
      entityType: 'User',
      entityId: userId || tokenRecord.userId,
      description: 'Đăng xuất',
      ipAddress: meta.ipAddress,
      userAgent: meta.userAgent,
    });
  },

  async getMe(userId) {
    const user = await authRepository.findUserById(userId);

    if (!user) {
      throw new ApiError(HttpStatus.NOT_FOUND, 'Không tìm thấy người dùng');
    }

    return mapUserResponse(user);
  },

  async changePassword(userId, { currentPassword, newPassword }, meta = {}) {
    const user = await authRepository.findUserById(userId);

    if (!user) {
      throw new ApiError(HttpStatus.NOT_FOUND, 'Không tìm thấy người dùng');
    }

    const isCurrentValid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isCurrentValid) {
      throw new ApiError(HttpStatus.BAD_REQUEST, 'Mật khẩu hiện tại không đúng');
    }

    const isSamePassword = await bcrypt.compare(newPassword, user.passwordHash);
    if (isSamePassword) {
      throw new ApiError(HttpStatus.BAD_REQUEST, 'Mật khẩu mới phải khác mật khẩu hiện tại');
    }

    const passwordHash = await bcrypt.hash(newPassword, BCRYPT_ROUNDS);
    await authRepository.updatePassword(userId, passwordHash);
    await authRepository.revokeAllUserTokens(userId);

    await auditService.log({
      userId,
      action: 'CHANGE_PASSWORD',
      module: 'auth',
      entityType: 'User',
      entityId: userId,
      description: 'Đổi mật khẩu',
      ipAddress: meta.ipAddress,
      userAgent: meta.userAgent,
    });
  },

  hashToken,
  getPermissions,
  mapUserResponse,
  createAccessToken,
  createRefreshToken,
  getExpiresInSeconds,
  MAX_FAILED_ATTEMPTS,
  LOCK_DURATION_MINUTES,
};
