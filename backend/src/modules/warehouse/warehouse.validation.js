import { z } from 'zod';

const uuidSchema = z.string().uuid('ID không hợp lệ');

export const listWarehousesSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().max(100).optional(),
    search: z.string().trim().optional(),
    status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
    sortBy: z.enum(['code', 'name', 'createdAt']).optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
  }),
});

export const warehouseIdSchema = z.object({
  params: z.object({ id: uuidSchema }),
});

export const createWarehouseSchema = z.object({
  body: z.object({
    code: z.string().trim().min(1, 'Mã kho là bắt buộc').max(50),
    name: z.string().trim().min(2, 'Tên kho tối thiểu 2 ký tự').max(255),
    address: z.string().trim().max(500).nullable().optional(),
    phone: z.string().trim().max(20).nullable().optional(),
    email: z.string().trim().email('Email không hợp lệ').nullable().optional(),
    description: z.string().trim().max(1000).nullable().optional(),
  }),
});

export const updateWarehouseSchema = z.object({
  params: z.object({ id: uuidSchema }),
  body: z.object({
    code: z.string().trim().min(1).max(50).optional(),
    name: z.string().trim().min(2).max(255).optional(),
    address: z.string().trim().max(500).nullable().optional(),
    phone: z.string().trim().max(20).nullable().optional(),
    email: z.string().trim().email().nullable().optional(),
    description: z.string().trim().max(1000).nullable().optional(),
  }),
});

export const changeWarehouseStatusSchema = z.object({
  params: z.object({ id: uuidSchema }),
  body: z.object({
    status: z.enum(['ACTIVE', 'INACTIVE']),
  }),
});
