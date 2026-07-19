import { z } from 'zod';

const uuidSchema = z.string().uuid('ID không hợp lệ');

export const listSuppliersSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().max(100).optional(),
    search: z.string().trim().optional(),
    status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
    sortBy: z.enum(['code', 'name', 'createdAt']).optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
  }),
});

export const supplierIdSchema = z.object({
  params: z.object({ id: uuidSchema }),
});

export const createSupplierSchema = z.object({
  body: z.object({
    code: z.string().trim().min(1, 'Mã NCC là bắt buộc').max(50),
    name: z.string().trim().min(2, 'Tên NCC tối thiểu 2 ký tự').max(255),
    contactPerson: z.string().trim().max(255).nullable().optional(),
    phone: z.string().trim().max(20).nullable().optional(),
    email: z.string().trim().email('Email không hợp lệ').nullable().optional(),
    address: z.string().trim().max(500).nullable().optional(),
    notes: z.string().trim().max(1000).nullable().optional(),
  }),
});

export const updateSupplierSchema = z.object({
  params: z.object({ id: uuidSchema }),
  body: z.object({
    code: z.string().trim().min(1).max(50).optional(),
    name: z.string().trim().min(2).max(255).optional(),
    contactPerson: z.string().trim().max(255).nullable().optional(),
    phone: z.string().trim().max(20).nullable().optional(),
    email: z.string().trim().email().nullable().optional(),
    address: z.string().trim().max(500).nullable().optional(),
    notes: z.string().trim().max(1000).nullable().optional(),
  }),
});

export const changeSupplierStatusSchema = z.object({
  params: z.object({ id: uuidSchema }),
  body: z.object({
    status: z.enum(['ACTIVE', 'INACTIVE']),
  }),
});
