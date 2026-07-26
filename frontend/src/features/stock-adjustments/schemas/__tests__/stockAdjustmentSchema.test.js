import { stockAdjustmentSchema } from '../stockAdjustmentSchema';

describe('stockAdjustmentSchema', () => {
  it('accepts valid payload', () => {
    const result = stockAdjustmentSchema.safeParse({
      warehouseId: 'wh-1',
      adjustDate: '2026-07-26',
      reason: 'Hàng hư hỏng',
      items: [{ productId: 'p1', type: 'DECREASE', quantity: 2 }],
    });
    expect(result.success).toBe(true);
  });

  it('rejects short reason', () => {
    const result = stockAdjustmentSchema.safeParse({
      warehouseId: 'wh-1',
      adjustDate: '2026-07-26',
      reason: 'ab',
      items: [{ productId: 'p1', type: 'INCREASE', quantity: 1 }],
    });
    expect(result.success).toBe(false);
  });
});
