import { createGoodsIssueSchema } from '../goodsIssue.validation.js';

describe('goodsIssue.validation', () => {
  it('accepts valid create payload', () => {
    const result = createGoodsIssueSchema.safeParse({
      body: {
        warehouseId: '11111111-1111-1111-1111-111111111111',
        issueDate: '2026-07-26',
        items: [
          {
            productId: '22222222-2222-2222-2222-222222222222',
            quantity: 5,
            unitPrice: 2000,
          },
        ],
      },
    });

    expect(result.success).toBe(true);
  });

  it('rejects empty items', () => {
    const result = createGoodsIssueSchema.safeParse({
      body: {
        warehouseId: '11111111-1111-1111-1111-111111111111',
        issueDate: '2026-07-26',
        items: [],
      },
    });

    expect(result.success).toBe(false);
  });
});
