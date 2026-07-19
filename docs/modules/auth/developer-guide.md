# Auth – Developer Guide

## Đã triển khai

Module Auth đã code xong. Tham chiếu:

- BE: `backend/src/modules/auth/`
- FE: `frontend/src/features/auth/`
- Schema: `backend/prisma/schema.prisma`
- Seed: `backend/prisma/seed.js`
- Permissions: `backend/src/constants/permissions.js`

## Chạy local

```bash
# PostgreSQL phải đang chạy
cd backend
npx prisma db push
npm run db:seed
cd ..
npm run dev
```

## Thêm permission mới

1. Thêm vào `PERMISSIONS` trong `src/constants/permissions.js`  
2. Cập nhật `ROLE_DEFINITIONS` nếu cần  
3. Chạy lại `npm run db:seed`  

## Tái sử dụng từ Auth

| Thành phần | Dùng cho module khác |
|------------|----------------------|
| `authenticate` / `authorize` | Mọi API bảo vệ |
| `authRepository.revokeAllUserTokens` | User deactivate / reset password |
| Password policy (Zod) | User create / reset password |
| `mapUserResponse` pattern | Không trả passwordHash |

## Checklist bảo mật

- [x] bcrypt cost 12  
- [x] JWT secret ≥ 32  
- [x] Refresh hash trong DB  
- [x] Rate limit login  
- [x] Account lockout  
- [x] Không leak email existence  
- [x] Revoke on logout / change password  
