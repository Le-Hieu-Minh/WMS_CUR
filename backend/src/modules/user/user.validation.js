import { z } from 'zod';
import { passwordPolicy } from '../../utils/passwordPolicy.js';

const uuidSchema = z.string().uuid('ID không hợp lệ');

export const listUsersSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().max(100).optional(),
    search: z.string().trim().optional(),
    status: z.enum(['ACTIVE', 'INACTIVE', 'LOCKED']).optional(),
    roleId: uuidSchema.optional(),
    sortBy: z.enum(['fullName', 'email', 'createdAt', 'lastLoginAt']).optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
  }),
});

export const userIdSchema = z.object({
  params: z.object({
    id: uuidSchema,
  }),
});

export const createUserSchema = z.object({
  body: z.object({
    email: z.string().trim().email('Email không hợp lệ').transform((v) => v.toLowerCase()),
    fullName: z.string().trim().min(2, 'Họ tên tối thiểu 2 ký tự').max(255),
    password: passwordPolicy,
    roleId: uuidSchema,
    avatarUrl: z.string().url('URL avatar không hợp lệ').nullable().optional(),
  }),
});

export const updateUserSchema = z.object({
  params: z.object({
    id: uuidSchema,
  }),
  body: z.object({
    fullName: z.string().trim().min(2).max(255).optional(),
    roleId: uuidSchema.optional(),
    avatarUrl: z.string().url().nullable().optional(),
  }),
});

export const changeUserStatusSchema = z.object({
  params: z.object({
    id: uuidSchema,
  }),
  body: z.object({
    status: z.enum(['ACTIVE', 'INACTIVE']),
  }),
});

export const resetPasswordSchema = z
  .object({
    params: z.object({
      id: uuidSchema,
    }),
    body: z.object({
      newPassword: passwordPolicy,
      confirmPassword: z.string().min(1, 'Xác nhận mật khẩu là bắt buộc'),
    }),
  })
  .refine((data) => data.body.newPassword === data.body.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['body', 'confirmPassword'],
  });
