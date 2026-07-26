import { z } from 'zod';

const uuid = z.string().uuid('ID không hợp lệ');

const itemSchema = z.object({
  productId: uuid,
  countedQty: z.coerce.number().min(0, 'Số lượng đếm phải ≥ 0'),
  note: z.string().trim().max(500).optional().nullable(),
});

const takeBodySchema = z.object({
  warehouseId: uuid,
  takeDate: z.string().min(1, 'Ngày kiểm kê là bắt buộc'),
  note: z.string().trim().max(1000).optional().nullable(),
  items: z.array(itemSchema).min(1, 'Phiếu kiểm kê cần ít nhất 1 sản phẩm'),
});

export const listStockTakesSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().max(100).optional(),
    search: z.string().optional(),
    status: z.enum(['DRAFT', 'CONFIRMED', 'CANCELLED']).optional(),
    warehouseId: uuid.optional(),
    sortBy: z.enum(['createdAt', 'takeDate', 'code']).optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
  }),
});

export const stockTakeIdSchema = z.object({
  params: z.object({ id: uuid }),
});

export const createStockTakeSchema = z.object({
  body: takeBodySchema,
});

export const updateStockTakeSchema = z.object({
  params: z.object({ id: uuid }),
  body: takeBodySchema,
});

export const warehouseProductsSchema = z.object({
  query: z.object({
    warehouseId: uuid,
  }),
});
