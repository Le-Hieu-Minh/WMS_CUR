import { z } from 'zod';

export const createRoleSchema = z.object({
  name: z.string().trim().min(2, 'Tên vai trò tối thiểu 2 ký tự'),
  description: z.string().trim().max(500).optional(),
  permissionIds: z.array(z.string()).min(1, 'Chọn ít nhất 1 quyền'),
});

export const updateRoleSchema = z.object({
  name: z.string().trim().min(2, 'Tên vai trò tối thiểu 2 ký tự'),
  description: z.string().trim().max(500).optional(),
  permissionIds: z.array(z.string()).min(1, 'Chọn ít nhất 1 quyền'),
});
