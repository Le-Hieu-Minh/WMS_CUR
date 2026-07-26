import { z } from 'zod';

const uuid = z.string().uuid('ID không hợp lệ');

const itemSchema = z.object({
  productId: uuid,
  type: z.enum(['INCREASE', 'DECREASE']),
  quantity: z.coerce.number().positive('Số lượng phải lớn hơn 0'),
  note: z.string().trim().max(500).optional().nullable(),
});

const bodySchema = z.object({
  warehouseId: uuid,
  adjustDate: z.string().min(1, 'Ngày điều chỉnh là bắt buộc'),
  reason: z.string().trim().min(3, 'Lý do phải có ít nhất 3 ký tự').max(500),
  note: z.string().trim().max(1000).optional().nullable(),
  items: z.array(itemSchema).min(1, 'Phiếu điều chỉnh cần ít nhất 1 sản phẩm'),
});

export const listStockAdjustmentsSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().max(100).optional(),
    search: z.string().optional(),
    status: z.enum(['DRAFT', 'CONFIRMED', 'CANCELLED']).optional(),
    warehouseId: uuid.optional(),
    sortBy: z.enum(['createdAt', 'adjustDate', 'code']).optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
  }),
});

export const stockAdjustmentIdSchema = z.object({
  params: z.object({ id: uuid }),
});

export const createStockAdjustmentSchema = z.object({ body: bodySchema });
export const updateStockAdjustmentSchema = z.object({
  params: z.object({ id: uuid }),
  body: bodySchema,
});
