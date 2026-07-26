import { describe, it, expect } from 'vitest';
import { stockTakeSchema } from '../stockTakeSchema';

describe('stockTakeSchema', () => {
  it('accepts valid stock take', () => {
    const result = stockTakeSchema.safeParse({
      warehouseId: 'wh-1',
      takeDate: '2026-07-26',
      items: [{ productId: 'p-1', countedQty: 8 }],
    });

    expect(result.success).toBe(true);
  });

  it('rejects negative countedQty', () => {
    const result = stockTakeSchema.safeParse({
      warehouseId: 'wh-1',
      takeDate: '2026-07-26',
      items: [{ productId: 'p-1', countedQty: -2 }],
    });

    expect(result.success).toBe(false);
  });
});
