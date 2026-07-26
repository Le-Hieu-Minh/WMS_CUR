import { z } from 'zod';

const uuid = z.string().uuid('ID không hợp lệ');

const itemSchema = z.object({
  productId: uuid,
  quantity: z.coerce.number().positive('Số lượng phải lớn hơn 0'),
  unitPrice: z.coerce.number().min(0, 'Đơn giá không hợp lệ').default(0),
  note: z.string().trim().max(500).optional().nullable(),
});

const issueBodySchema = z.object({
  warehouseId: uuid,
  customerId: uuid.optional().nullable(),
  issueDate: z.string().min(1, 'Ngày xuất là bắt buộc'),
  note: z.string().trim().max(1000).optional().nullable(),
  items: z.array(itemSchema).min(1, 'Phiếu xuất cần ít nhất 1 sản phẩm'),
});

export const listGoodsIssuesSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().max(100).optional(),
    search: z.string().optional(),
    status: z.enum(['DRAFT', 'CONFIRMED', 'CANCELLED']).optional(),
    warehouseId: uuid.optional(),
    customerId: uuid.optional(),
    sortBy: z.enum(['createdAt', 'issueDate', 'code']).optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
  }),
});

export const goodsIssueIdSchema = z.object({
  params: z.object({ id: uuid }),
});

export const createGoodsIssueSchema = z.object({
  body: issueBodySchema,
});

export const updateGoodsIssueSchema = z.object({
  params: z.object({ id: uuid }),
  body: issueBodySchema,
});
