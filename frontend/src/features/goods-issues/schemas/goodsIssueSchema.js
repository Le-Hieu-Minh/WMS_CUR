import { z } from 'zod';

const itemSchema = z.object({
  productId: z.string().min(1, 'Chọn sản phẩm'),
  quantity: z.coerce.number().positive('Số lượng phải lớn hơn 0'),
  unitPrice: z.coerce.number().min(0, 'Đơn giá không hợp lệ').default(0),
  note: z.string().optional().nullable(),
});

export const goodsIssueSchema = z.object({
  warehouseId: z.string().min(1, 'Chọn kho'),
  customerId: z.string().optional().nullable(),
  issueDate: z.string().min(1, 'Ngày xuất là bắt buộc'),
  note: z.string().optional().nullable(),
  items: z.array(itemSchema).min(1, 'Cần ít nhất 1 sản phẩm'),
});
