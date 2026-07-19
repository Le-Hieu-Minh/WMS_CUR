import { describe, expect, it } from 'vitest';
import { warehouseSchema, productSchema } from '../masterDataSchema';

describe('masterDataSchema', () => {
  it('validates warehouse', () => {
    const result = warehouseSchema.safeParse({
      code: 'WH-001',
      name: 'Kho chính',
    });
    expect(result.success).toBe(true);
  });

  it('validates product with numbers', () => {
    const result = productSchema.safeParse({
      code: 'PRD-001',
      name: 'Laptop',
      price: 1000000,
      costPrice: 800000,
      minStock: 5,
    });
    expect(result.success).toBe(true);
  });
});
