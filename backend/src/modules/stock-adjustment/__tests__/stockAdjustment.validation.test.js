import { createStockAdjustmentSchema } from '../stockAdjustment.validation.js';

describe('stockAdjustment.validation', () => {
  it('accepts valid payload', () => {
    const result = createStockAdjustmentSchema.safeParse({
      body: {
        warehouseId: '11111111-1111-1111-1111-111111111111',
        adjustDate: '2026-07-26',
        reason: 'Hàng hư hỏng',
        items: [
          {
            productId: '22222222-2222-2222-2222-222222222222',
            type: 'DECREASE',
            quantity: 2,
          },
        ],
      },
    });
    expect(result.success).toBe(true);
  });

  it('rejects short reason', () => {
    const result = createStockAdjustmentSchema.safeParse({
      body: {
        warehouseId: '11111111-1111-1111-1111-111111111111',
        adjustDate: '2026-07-26',
        reason: 'ab',
        items: [
          {
            productId: '22222222-2222-2222-2222-222222222222',
            type: 'INCREASE',
            quantity: 1,
          },
        ],
      },
    });
    expect(result.success).toBe(false);
  });
});
