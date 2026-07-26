import { logger } from '../../config/logger.js';
import { prisma } from '../../config/database.js';
import { ApiError, HttpStatus } from '../../utils/apiError.js';
import { buildPagination, parsePagination } from '../../utils/pagination.js';

const SENSITIVE_KEYS = ['password', 'passwordHash', 'accessToken', 'refreshToken', 'token'];

function sanitize(value) {
  if (value == null || typeof value !== 'object') return value;
  if (Array.isArray(value)) return value.map(sanitize);

  const cleaned = {};
  for (const [key, val] of Object.entries(value)) {
    if (SENSITIVE_KEYS.some((s) => key.toLowerCase().includes(s.toLowerCase()))) {
      cleaned[key] = '[REDACTED]';
    } else {
      cleaned[key] = sanitize(val);
    }
  }
  return cleaned;
}

export const auditService = {
  async log({
    userId = null,
    action,
    module,
    entityType = null,
    entityId = null,
    description = null,
    oldData = null,
    newData = null,
    ipAddress = null,
    userAgent = null,
  }) {
    try {
      await prisma.auditLog.create({
        data: {
          userId,
          action,
          module,
          entityType,
          entityId,
          description,
          oldData: oldData ? sanitize(oldData) : undefined,
          newData: newData ? sanitize(newData) : undefined,
          ipAddress,
          userAgent,
        },
      });
    } catch (error) {
      logger.error(error, 'Failed to write audit log');
    }
  },

  async list(query) {
    const { page, limit, skip, sortBy, sortOrder } = parsePagination(query, 'createdAt');
    const where = {};

    if (query.module) where.module = query.module;
    if (query.action) where.action = query.action;
    if (query.userId) where.userId = query.userId;
    if (query.search) {
      where.OR = [
        { description: { contains: query.search, mode: 'insensitive' } },
        { entityId: { contains: query.search, mode: 'insensitive' } },
        { action: { contains: query.search, mode: 'insensitive' } },
      ];
    }
    if (query.dateFrom || query.dateTo) {
      where.createdAt = {};
      if (query.dateFrom) where.createdAt.gte = new Date(query.dateFrom);
      if (query.dateTo) {
        const end = new Date(query.dateTo);
        end.setHours(23, 59, 59, 999);
        where.createdAt.lte = end;
      }
    }

    const orderField = ['createdAt', 'action', 'module'].includes(sortBy) ? sortBy : 'createdAt';

    const [items, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [orderField]: sortOrder },
        include: {
          user: { select: { id: true, fullName: true, email: true } },
        },
      }),
      prisma.auditLog.count({ where }),
    ]);

    return { items, pagination: buildPagination(page, limit, total) };
  },

  async getById(id) {
    const item = await prisma.auditLog.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, fullName: true, email: true } },
      },
    });
    if (!item) throw new ApiError(HttpStatus.NOT_FOUND, 'Không tìm thấy nhật ký');
    return item;
  },
};
