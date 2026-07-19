import { z } from 'zod';
import { passwordPolicy } from '../../utils/passwordPolicy.js';

export const loginSchema = z.object({
  body: z.object({
    email: z.string().trim().email('Email không hợp lệ'),
    password: z.string().min(1, 'Mật khẩu là bắt buộc'),
  }),
});

export const refreshSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(1, 'Refresh token là bắt buộc'),
  }),
});

export const logoutSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(1, 'Refresh token là bắt buộc'),
  }),
});

export const changePasswordSchema = z
  .object({
    body: z.object({
      currentPassword: z.string().min(1, 'Mật khẩu hiện tại là bắt buộc'),
      newPassword: passwordPolicy,
      confirmPassword: z.string().min(1, 'Xác nhận mật khẩu là bắt buộc'),
    }),
  })
  .refine((data) => data.body.newPassword === data.body.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['body', 'confirmPassword'],
  });
