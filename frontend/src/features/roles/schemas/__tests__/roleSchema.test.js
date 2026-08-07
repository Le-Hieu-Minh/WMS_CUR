import { describe, expect, it } from 'vitest';
import { roleFormSchema } from '@/features/roles/schemas/roleSchema';

describe('roleFormSchema', () => {
  it('accepts name and optional description without permissionIds', () => {
    const result = roleFormSchema.safeParse({
      name: 'Supervisor',
      description: 'Quản lý ca',
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe('Supervisor');
      expect(result.data.description).toBe('Quản lý ca');
    }
  });

  it('rejects name shorter than 2 characters', () => {
    const result = roleFormSchema.safeParse({ name: 'A' });
    expect(result.success).toBe(false);
  });

  it('does not require permissionIds on the form schema', () => {
    const result = roleFormSchema.safeParse({ name: 'Custom Role' });
    expect(result.success).toBe(true);
  });
});
