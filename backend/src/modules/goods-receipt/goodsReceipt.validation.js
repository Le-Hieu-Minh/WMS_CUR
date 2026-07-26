import { z } from 'zod';

const uuid = z.string().uuid('ID không hợp lệ');

const itemSchema = z.object({
  productId: uuid,
  quantity: z.coerce.number().positive('Số lượng phải lớn hơn 0'),
  unitCost: z.coerce.number().min(0, 'Đơn giá không hợp lệ').default(0),
  note: z.string().trim().max(500).optional().nullable(),
});

const receiptBodySchema = z.object({
  warehouseId: uuid,
  supplierId: uuid.optional().nullable(),
  receiptDate: z.string().min(1, 'Ngày nhập là bắt buộc'),
  note: z.string().trim().max(1000).optional().nullable(),
  items: z.array(itemSchema).min(1, 'Phiếu nhập cần ít nhất 1 sản phẩm'),
});

export const listGoodsReceiptsSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().max(100).optional(),
    search: z.string().optional(),
    status: z.enum(['DRAFT', 'CONFIRMED', 'CANCELLED']).optional(),
    warehouseId: uuid.optional(),
    supplierId: uuid.optional(),
    sortBy: z.enum(['createdAt', 'receiptDate', 'code']).optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
  }),
});

export const goodsReceiptIdSchema = z.object({
  params: z.object({
    id: uuid,
  }),
});

export const createGoodsReceiptSchema = z.object({
  body: receiptBodySchema,
});

export const updateGoodsReceiptSchema = z.object({
  params: z.object({ id: uuid }),
  body: receiptBodySchema,
});
