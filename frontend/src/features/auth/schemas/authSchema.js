import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().trim().email('Email không hợp lệ'),
  password: z.string().min(1, 'Mật khẩu là bắt buộc'),
});

const passwordPolicy = z
  .string()
  .min(8, 'Mật khẩu mới phải có ít nhất 8 ký tự')
  .regex(/[A-Z]/, 'Mật khẩu mới phải có ít nhất 1 chữ hoa')
  .regex(/[a-z]/, 'Mật khẩu mới phải có ít nhất 1 chữ thường')
  .regex(/[0-9]/, 'Mật khẩu mới phải có ít nhất 1 chữ số');

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Mật khẩu hiện tại là bắt buộc'),
    newPassword: passwordPolicy,
    confirmPassword: z.string().min(1, 'Xác nhận mật khẩu là bắt buộc'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['confirmPassword'],
  });
