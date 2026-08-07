import { z } from 'zod';

/** Form fields only — permissionIds is managed outside RHF (checkbox state). */
export const roleFormSchema = z.object({
  name: z.string().trim().min(2, 'Tên vai trò tối thiểu 2 ký tự').max(100),
  description: z.string().trim().max(500).optional(),
});

export const createRoleSchema = roleFormSchema;
export const updateRoleSchema = roleFormSchema;
