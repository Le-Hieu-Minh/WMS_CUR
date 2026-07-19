import { describe, expect, it } from 'vitest';
import { createUserSchema, resetPasswordSchema } from '../userSchema';

describe('userSchema', () => {
  it('validates create user', () => {
    const result = createUserSchema.safeParse({
      email: 'staff@wms.com',
      fullName: 'Nguyen Van A',
      password: 'Staff@123',
      roleId: '550e8400-e29b-41d4-a716-446655440000',
    });
    expect(result.success).toBe(true);
  });

  it('rejects mismatched reset password', () => {
    const result = resetPasswordSchema.safeParse({
      newPassword: 'NewPass@456',
      confirmPassword: 'Other@456',
    });
    expect(result.success).toBe(false);
  });
});
