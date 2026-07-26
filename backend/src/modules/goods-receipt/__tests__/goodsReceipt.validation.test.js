import {
  createGoodsReceiptSchema,
  listGoodsReceiptsSchema,
} from '../goodsReceipt.validation.js';

describe('goodsReceipt.validation', () => {
  it('accepts valid create payload', () => {
    const result = createGoodsReceiptSchema.safeParse({
      body: {
        warehouseId: '11111111-1111-1111-1111-111111111111',
        receiptDate: '2026-07-23',
        items: [
          {
            productId: '22222222-2222-2222-2222-222222222222',
            quantity: 10,
            unitCost: 1000,
          },
        ],
      },
    });

    expect(result.success).toBe(true);
  });

  it('rejects empty items', () => {
    const result = createGoodsReceiptSchema.safeParse({
      body: {
        warehouseId: '11111111-1111-1111-1111-111111111111',
        receiptDate: '2026-07-23',
        items: [],
      },
    });

    expect(result.success).toBe(false);
  });

  it('accepts list filters', () => {
    const result = listGoodsReceiptsSchema.safeParse({
      query: { page: '1', status: 'DRAFT' },
    });

    expect(result.success).toBe(true);
  });
});
