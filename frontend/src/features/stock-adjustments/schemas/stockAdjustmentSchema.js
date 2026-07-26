import { z } from 'zod';

const itemSchema = z.object({
  productId: z.string().min(1, 'Chọn sản phẩm'),
  type: z.enum(['INCREASE', 'DECREASE'], { required_error: 'Chọn loại điều chỉnh' }),
  quantity: z.coerce.number().positive('Số lượng phải lớn hơn 0'),
  note: z.string().optional().nullable(),
});

export const stockAdjustmentSchema = z.object({
  warehouseId: z.string().min(1, 'Chọn kho'),
  adjustDate: z.string().min(1, 'Ngày điều chỉnh là bắt buộc'),
  reason: z.string().trim().min(3, 'Lý do phải có ít nhất 3 ký tự'),
  note: z.string().optional().nullable(),
  items: z.array(itemSchema).min(1, 'Cần ít nhất 1 sản phẩm'),
});
