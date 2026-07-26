import { z } from 'zod';

const itemSchema = z.object({
  productId: z.string().min(1, 'Chọn sản phẩm'),
  countedQty: z.coerce.number().min(0, 'Số lượng đếm phải ≥ 0'),
  systemQty: z.coerce.number().min(0).optional(),
  note: z.string().optional().nullable(),
});

export const stockTakeSchema = z.object({
  warehouseId: z.string().min(1, 'Chọn kho'),
  takeDate: z.string().min(1, 'Ngày kiểm kê là bắt buộc'),
  note: z.string().optional().nullable(),
  items: z.array(itemSchema).min(1, 'Cần ít nhất 1 sản phẩm'),
});
