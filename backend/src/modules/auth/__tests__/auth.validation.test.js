import { loginSchema, changePasswordSchema } from '../auth.validation.js';

describe('auth.validation', () => {
  describe('loginSchema', () => {
    it('accepts valid login payload', () => {
      const result = loginSchema.safeParse({
        body: { email: 'admin@wms.com', password: 'Admin@123' },
      });

      expect(result.success).toBe(true);
    });

    it('rejects invalid email', () => {
      const result = loginSchema.safeParse({
        body: { email: 'invalid', password: 'Admin@123' },
      });

      expect(result.success).toBe(false);
    });
  });

  describe('changePasswordSchema', () => {
    it('rejects mismatched confirm password', () => {
      const result = changePasswordSchema.safeParse({
        body: {
          currentPassword: 'Admin@123',
          newPassword: 'NewPass@456',
          confirmPassword: 'Different@456',
        },
      });

      expect(result.success).toBe(false);
    });

    it('accepts valid change password payload', () => {
      const result = changePasswordSchema.safeParse({
        body: {
          currentPassword: 'Admin@123',
          newPassword: 'NewPass@456',
          confirmPassword: 'NewPass@456',
        },
      });

      expect(result.success).toBe(true);
    });
  });
});
