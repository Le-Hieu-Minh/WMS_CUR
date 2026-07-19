import { z } from 'zod';

const uuidSchema = z.string().uuid('ID không hợp lệ');

export const listRolesSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().max(100).optional(),
    search: z.string().trim().optional(),
    sortBy: z.enum(['name', 'createdAt']).optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
  }),
});

export const roleIdSchema = z.object({
  params: z.object({
    id: uuidSchema,
  }),
});

export const createRoleSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2, 'Tên vai trò tối thiểu 2 ký tự').max(100),
    description: z.string().trim().max(500).nullable().optional(),
    permissionIds: z.array(uuidSchema).min(1, 'Phải chọn ít nhất 1 quyền'),
  }),
});

export const updateRoleSchema = z.object({
  params: z.object({
    id: uuidSchema,
  }),
  body: z.object({
    name: z.string().trim().min(2).max(100).optional(),
    description: z.string().trim().max(500).nullable().optional(),
    permissionIds: z.array(uuidSchema).min(1).optional(),
  }),
});
