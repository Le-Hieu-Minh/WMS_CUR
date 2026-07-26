import { z } from 'zod';

const uuid = z.string().uuid('ID không hợp lệ');

export const listInventorySchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().max(100).optional(),
    search: z.string().optional(),
    warehouseId: uuid.optional(),
    productId: uuid.optional(),
    lowStock: z
      .enum(['true', 'false'])
      .optional()
      .transform((v) => v === 'true'),
    sortBy: z.enum(['quantity', 'updatedAt', 'createdAt']).optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
  }),
});
