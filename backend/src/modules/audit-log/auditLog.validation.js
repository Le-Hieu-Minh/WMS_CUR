import { z } from 'zod';

export const listAuditLogsSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().max(100).optional(),
    search: z.string().optional(),
    module: z.string().optional(),
    action: z.string().optional(),
    userId: z.string().uuid().optional(),
    dateFrom: z.string().optional(),
    dateTo: z.string().optional(),
    sortBy: z.enum(['createdAt', 'action', 'module']).optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
  }),
});

export const auditLogIdSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
});
