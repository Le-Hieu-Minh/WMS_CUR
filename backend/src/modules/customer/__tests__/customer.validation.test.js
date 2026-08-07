import {
  changeCustomerStatusSchema,
  createCustomerSchema,
  listCustomersSchema,
} from '../customer.validation.js';

const CUSTOMER_ID = '550e8400-e29b-41d4-a716-446655440000';

describe('customer.validation', () => {
  it('accepts valid create payload', () => {
    const result = createCustomerSchema.safeParse({
      body: {
        code: 'CUS-001',
        name: 'Retail Co',
        phone: '0901234567',
      },
    });

    expect(result.success).toBe(true);
  });

  it('rejects invalid email', () => {
    const result = createCustomerSchema.safeParse({
      body: {
        code: 'CUS-001',
        name: 'Retail Co',
        email: 'bad-email',
      },
    });

    expect(result.success).toBe(false);
  });

  it('accepts list filters', () => {
    const result = listCustomersSchema.safeParse({
      query: { page: '1', search: 'Retail' },
    });

    expect(result.success).toBe(true);
  });

  it('accepts status change payload', () => {
    const result = changeCustomerStatusSchema.safeParse({
      params: { id: CUSTOMER_ID },
      body: { status: 'ACTIVE' },
    });

    expect(result.success).toBe(true);
  });
});
