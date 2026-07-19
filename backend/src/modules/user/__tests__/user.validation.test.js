import { describe, expect, it } from '@jest/globals';
import { createUserSchema, resetPasswordSchema } from '../user.validation.js';

describe('user validation', () => {
  it('createUserSchema validates valid payload', () => {
    const result = createUserSchema.safeParse({
      body: {
        email: 'Staff@Example.com',
        fullName: 'Nguyen Van A',
        password: 'Staff@123',
        roleId: '550e8400-e29b-41d4-a716-446655440000',
      },
    });

    expect(result.success).toBe(true);
    expect(result.data.body.email).toBe('staff@example.com');
  });

  it('createUserSchema rejects weak password', () => {
    const result = createUserSchema.safeParse({
      body: {
        email: 'staff@wms.com',
        fullName: 'Nguyen Van A',
        password: 'weak',
        roleId: '550e8400-e29b-41d4-a716-446655440000',
      },
    });

    expect(result.success).toBe(false);
  });

  it('resetPasswordSchema requires matching confirm', () => {
    const result = resetPasswordSchema.safeParse({
      params: { id: '550e8400-e29b-41d4-a716-446655440000' },
      body: {
        newPassword: 'NewPass@456',
        confirmPassword: 'Different@456',
      },
    });

    expect(result.success).toBe(false);
  });
});
