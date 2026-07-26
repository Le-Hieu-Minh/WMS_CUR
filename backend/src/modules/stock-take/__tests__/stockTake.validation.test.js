import { createStockTakeSchema } from '../stockTake.validation.js';

describe('stockTake.validation', () => {
  it('accepts valid create payload', () => {
    const result = createStockTakeSchema.safeParse({
      body: {
        warehouseId: '11111111-1111-1111-1111-111111111111',
        takeDate: '2026-07-26',
        items: [
          {
            productId: '22222222-2222-2222-2222-222222222222',
            countedQty: 10,
          },
        ],
      },
    });

    expect(result.success).toBe(true);
  });

  it('rejects negative countedQty', () => {
    const result = createStockTakeSchema.safeParse({
      body: {
        warehouseId: '11111111-1111-1111-1111-111111111111',
        takeDate: '2026-07-26',
        items: [
          {
            productId: '22222222-2222-2222-2222-222222222222',
            countedQty: -1,
          },
        ],
      },
    });

    expect(result.success).toBe(false);
  });
});
