import { createRoleSchema, listRolesSchema, roleIdSchema } from '../role.validation.js';

const PERM_ID = '550e8400-e29b-41d4-a716-446655440000';
const ROLE_ID = '660e8400-e29b-41d4-a716-446655440001';

describe('role.validation', () => {
  it('accepts valid create payload', () => {
    const result = createRoleSchema.safeParse({
      body: {
        name: 'Warehouse Lead',
        description: 'Manages warehouse ops',
        permissionIds: [PERM_ID],
      },
    });

    expect(result.success).toBe(true);
  });

  it('rejects create without permissions', () => {
    const result = createRoleSchema.safeParse({
      body: {
        name: 'Empty Role',
        permissionIds: [],
      },
    });

    expect(result.success).toBe(false);
  });

  it('accepts list filters', () => {
    const result = listRolesSchema.safeParse({
      query: { page: '1', sortBy: 'name', sortOrder: 'asc' },
    });

    expect(result.success).toBe(true);
  });

  it('validates role id param', () => {
    const result = roleIdSchema.safeParse({ params: { id: ROLE_ID } });
    expect(result.success).toBe(true);
  });
});
