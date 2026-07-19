import { z } from 'zod';

const uuidSchema = z.string().uuid('ID không hợp lệ');

export const listProductsSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().max(100).optional(),
    search: z.string().trim().optional(),
    status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
    category: z.string().trim().optional(),
    sortBy: z.enum(['code', 'name', 'price', 'createdAt']).optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
  }),
});

export const productIdSchema = z.object({
  params: z.object({ id: uuidSchema }),
});

export const createProductSchema = z.object({
  body: z.object({
    code: z.string().trim().min(1, 'Mã sản phẩm là bắt buộc').max(50),
    name: z.string().trim().min(2, 'Tên sản phẩm tối thiểu 2 ký tự').max(255),
    description: z.string().trim().max(2000).nullable().optional(),
    category: z.string().trim().max(100).nullable().optional(),
    unit: z.string().trim().min(1).max(20).optional(),
    price: z.coerce.number().min(0).optional(),
    costPrice: z.coerce.number().min(0).optional(),
    minStock: z.coerce.number().int().min(0).optional(),
    imageUrl: z.string().url().nullable().optional(),
  }),
});

export const updateProductSchema = z.object({
  params: z.object({ id: uuidSchema }),
  body: z.object({
    code: z.string().trim().min(1).max(50).optional(),
    name: z.string().trim().min(2).max(255).optional(),
    description: z.string().trim().max(2000).nullable().optional(),
    category: z.string().trim().max(100).nullable().optional(),
    unit: z.string().trim().min(1).max(20).optional(),
    price: z.coerce.number().min(0).optional(),
    costPrice: z.coerce.number().min(0).optional(),
    minStock: z.coerce.number().int().min(0).optional(),
    imageUrl: z.string().url().nullable().optional(),
  }),
});

export const changeProductStatusSchema = z.object({
  params: z.object({ id: uuidSchema }),
  body: z.object({
    status: z.enum(['ACTIVE', 'INACTIVE']),
  }),
});
