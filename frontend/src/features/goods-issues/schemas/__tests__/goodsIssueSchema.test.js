import { describe, it, expect } from 'vitest';
import { goodsIssueSchema } from '../goodsIssueSchema';

describe('goodsIssueSchema', () => {
  it('accepts valid issue', () => {
    const result = goodsIssueSchema.safeParse({
      warehouseId: 'wh-1',
      issueDate: '2026-07-26',
      items: [{ productId: 'p-1', quantity: 3, unitPrice: 5000 }],
    });

    expect(result.success).toBe(true);
  });

  it('rejects empty items', () => {
    const result = goodsIssueSchema.safeParse({
      warehouseId: 'wh-1',
      issueDate: '2026-07-26',
      items: [],
    });

    expect(result.success).toBe(false);
  });
});
