import { describe, it, expect } from 'vitest';
import { goodsReceiptSchema } from '../goodsReceiptSchema';

describe('goodsReceiptSchema', () => {
  it('accepts valid receipt', () => {
    const result = goodsReceiptSchema.safeParse({
      warehouseId: 'wh-1',
      receiptDate: '2026-07-23',
      items: [{ productId: 'p-1', quantity: 5, unitCost: 1000 }],
    });

    expect(result.success).toBe(true);
  });

  it('rejects empty items', () => {
    const result = goodsReceiptSchema.safeParse({
      warehouseId: 'wh-1',
      receiptDate: '2026-07-23',
      items: [],
    });

    expect(result.success).toBe(false);
  });
});
