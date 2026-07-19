import { describe, it, expect } from 'vitest';
import { loginSchema, changePasswordSchema } from '@/features/auth/schemas/authSchema';

describe('authSchema', () => {
  it('validates login form', () => {
    const result = loginSchema.safeParse({
      email: 'admin@wms.com',
      password: 'Admin@123',
    });

    expect(result.success).toBe(true);
  });

  it('rejects invalid login email', () => {
    const result = loginSchema.safeParse({
      email: 'bad-email',
      password: 'Admin@123',
    });

    expect(result.success).toBe(false);
  });

  it('validates change password confirmation', () => {
    const result = changePasswordSchema.safeParse({
      currentPassword: 'Admin@123',
      newPassword: 'NewPass@456',
      confirmPassword: 'NewPass@456',
    });

    expect(result.success).toBe(true);
  });
});
