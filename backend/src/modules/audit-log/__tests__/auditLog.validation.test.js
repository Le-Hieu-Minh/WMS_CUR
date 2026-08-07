import { auditLogIdSchema, listAuditLogsSchema } from '../auditLog.validation.js';

const AUDIT_ID = '550e8400-e29b-41d4-a716-446655440000';
const USER_ID = '660e8400-e29b-41d4-a716-446655440001';

describe('auditLog.validation', () => {
  it('accepts list filters', () => {
    const result = listAuditLogsSchema.safeParse({
      query: {
        page: '1',
        module: 'goods-receipt',
        userId: USER_ID,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      },
    });

    expect(result.success).toBe(true);
  });

  it('rejects invalid userId in list filters', () => {
    const result = listAuditLogsSchema.safeParse({
      query: { userId: 'not-a-uuid' },
    });

    expect(result.success).toBe(false);
  });

  it('validates audit log id param', () => {
    const result = auditLogIdSchema.safeParse({ params: { id: AUDIT_ID } });
    expect(result.success).toBe(true);
  });
});
