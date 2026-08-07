import {
  changeProductStatusSchema,
  createProductSchema,
  listProductsSchema,
} from '../product.validation.js';

const PRODUCT_ID = '550e8400-e29b-41d4-a716-446655440000';

describe('product.validation', () => {
  it('accepts valid create payload', () => {
    const result = createProductSchema.safeParse({
      body: {
        code: 'PRD-001',
        name: 'Sample Product',
        unit: 'pcs',
        price: 10000,
      },
    });

    expect(result.success).toBe(true);
  });

  it('rejects negative price', () => {
    const result = createProductSchema.safeParse({
      body: {
        code: 'PRD-001',
        name: 'Sample Product',
        price: -1,
      },
    });

    expect(result.success).toBe(false);
  });

  it('accepts list filters', () => {
    const result = listProductsSchema.safeParse({
      query: { page: '1', status: 'ACTIVE', category: 'Electronics' },
    });

    expect(result.success).toBe(true);
  });

  it('accepts status change payload', () => {
    const result = changeProductStatusSchema.safeParse({
      params: { id: PRODUCT_ID },
      body: { status: 'INACTIVE' },
    });

    expect(result.success).toBe(true);
  });
});
