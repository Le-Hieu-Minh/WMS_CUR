import {
  changeWarehouseStatusSchema,
  createWarehouseSchema,
  listWarehousesSchema,
} from '../warehouse.validation.js';

const WAREHOUSE_ID = '550e8400-e29b-41d4-a716-446655440000';

describe('warehouse.validation', () => {
  it('accepts valid create payload', () => {
    const result = createWarehouseSchema.safeParse({
      body: {
        code: 'WH-01',
        name: 'Main Warehouse',
        email: 'wh@example.com',
      },
    });

    expect(result.success).toBe(true);
  });

  it('rejects invalid email', () => {
    const result = createWarehouseSchema.safeParse({
      body: {
        code: 'WH-01',
        name: 'Main Warehouse',
        email: 'not-an-email',
      },
    });

    expect(result.success).toBe(false);
  });

  it('accepts list filters', () => {
    const result = listWarehousesSchema.safeParse({
      query: { page: '1', status: 'ACTIVE' },
    });

    expect(result.success).toBe(true);
  });

  it('accepts status change payload', () => {
    const result = changeWarehouseStatusSchema.safeParse({
      params: { id: WAREHOUSE_ID },
      body: { status: 'INACTIVE' },
    });

    expect(result.success).toBe(true);
  });
});
