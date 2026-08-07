import {
  changeSupplierStatusSchema,
  createSupplierSchema,
  listSuppliersSchema,
} from '../supplier.validation.js';

const SUPPLIER_ID = '550e8400-e29b-41d4-a716-446655440000';

describe('supplier.validation', () => {
  it('accepts valid create payload', () => {
    const result = createSupplierSchema.safeParse({
      body: {
        code: 'SUP-001',
        name: 'ACME Supplies',
        contactPerson: 'John Doe',
      },
    });

    expect(result.success).toBe(true);
  });

  it('rejects missing code', () => {
    const result = createSupplierSchema.safeParse({
      body: {
        name: 'ACME Supplies',
      },
    });

    expect(result.success).toBe(false);
  });

  it('accepts list filters', () => {
    const result = listSuppliersSchema.safeParse({
      query: { page: '1', status: 'ACTIVE' },
    });

    expect(result.success).toBe(true);
  });

  it('accepts status change payload', () => {
    const result = changeSupplierStatusSchema.safeParse({
      params: { id: SUPPLIER_ID },
      body: { status: 'INACTIVE' },
    });

    expect(result.success).toBe(true);
  });
});
