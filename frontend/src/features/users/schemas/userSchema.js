import { z } from 'zod';

const passwordPolicy = z
  .string()
  .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
  .regex(/[A-Z]/, 'Mật khẩu phải có ít nhất 1 chữ hoa')
  .regex(/[a-z]/, 'Mật khẩu phải có ít nhất 1 chữ thường')
  .regex(/[0-9]/, 'Mật khẩu phải có ít nhất 1 chữ số');

export const createUserSchema = z.object({
  email: z.string().trim().email('Email không hợp lệ'),
  fullName: z.string().trim().min(2, 'Họ tên tối thiểu 2 ký tự'),
  password: passwordPolicy,
  roleId: z.string().uuid('Chọn vai trò'),
});

export const updateUserSchema = z.object({
  fullName: z.string().trim().min(2, 'Họ tên tối thiểu 2 ký tự'),
  roleId: z.string().uuid('Chọn vai trò'),
});

export const resetPasswordSchema = z
  .object({
    newPassword: passwordPolicy,
    confirmPassword: z.string().min(1, 'Xác nhận mật khẩu là bắt buộc'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['confirmPassword'],
  });
