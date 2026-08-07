# Auth — Developer Guide

## Overview

Hướng dẫn dev mở rộng, bảo trì và tích hợp module Auth với các module khác trong WMS.

## Purpose

Cung cấp checklist chạy local, điểm mở rộng (permissions, middleware), pattern tái sử dụng và test strategy.

## Scope

Backend `backend/src/modules/auth/`, FE `frontend/src/features/auth/`, shared utils, seed, middleware.

## Workflow

### Chạy local

```bash
# PostgreSQL phải đang chạy
cd backend
npx prisma db push
npm run db:seed
cd ..
npm run dev
```

Verify: `POST /api/v1/auth/login` → Swagger `/api-docs` tag Auth.

### Thêm permission mới

1. Thêm entry vào `backend/src/constants/permissions.js` (`PERMISSIONS` array)
2. Cập nhật `ROLE_DEFINITIONS` nếu Manager/Staff cần quyền mới
3. Chạy `npm run db:seed`
4. Thêm `authorize('module:action')` trên route module mới
5. FE: ẩn/hiện UI qua `usePermissions().hasPermission()`

## Business Rules

Khi tái sử dụng Auth: luôn revoke tokens khi vô hiệu hóa user; dùng `passwordPolicy` cho mọi set password; không expose `passwordHash`.

## Technical Design

### Tái sử dụng từ Auth

| Thành phần | Dùng cho |
|------------|----------|
| `authenticate` / `authorize` | Mọi protected API |
| `authRepository.revokeAllUserTokens` | User deactivate, reset password, change password |
| `passwordPolicy` (Zod) | User create, reset, change password |
| `mapUserResponse` pattern | Response user an toàn |
| `authService.createAccessToken` | Test/integration helpers |

### File tham chiếu

| Path | Vai trò |
|------|---------|
| `backend/src/modules/auth/` | Module code |
| `frontend/src/features/auth/` | FE feature |
| `backend/prisma/schema.prisma` | Schema |
| `backend/prisma/seed.js` | Seed roles/users |
| `backend/src/constants/permissions.js` | Permission catalog |
| `backend/src/middlewares/auth.middleware.js` | JWT verify + authorize |

### Test

```bash
cd backend && npm test -- auth
cd frontend && npm test -- authSchema
```

Integration: `backend/src/__tests__/integration/p0.integration.test.js` (nếu có auth scenarios).

## API / Database

Chi tiết: [api.md](./api.md), [database.md](./database.md).

## Validation

Extend bằng cách thêm schema Zod trong `auth.validation.js`; dùng chung `passwordPolicy` thay vì duplicate regex.

## Security

Checklist bảo mật:

- [x] bcrypt cost 12
- [x] JWT secret ≥ 32 chars
- [x] Refresh hash trong DB
- [x] Rate limit login
- [x] Account lockout
- [x] Không leak email existence
- [x] Revoke on logout / change password / deactivate

## Error Handling

Dùng `ApiError(HttpStatus.*, message)` trong service. Global handler format `{ success: false, message }`.

## Examples

Gọi revoke từ User service:

```javascript
import { authRepository } from '../auth/auth.repository.js';
await authRepository.revokeAllUserTokens(userId);
```

Protect route mới:

```javascript
router.get('/', authenticate, authorize('warehouse:read'), controller.list);
```

## Design Decisions

| Decision | Reason | Advantages | Trade-offs |
|----------|--------|------------|------------|
| Permissions in JWT | Performance | No DB per request | Stale until refresh |
| Shared passwordPolicy file | DRY | Consistent rules | Single source to update |
| Rate limit skip in test | CI stability | Tests không flaky | Prod-only behavior |

## Notes

- Đổi TTL token: env `JWT_ACCESS_EXPIRES_IN`, `JWT_REFRESH_EXPIRES_IN` — restart server
- Audit log module ghi LOGIN/LOGOUT/CHANGE_PASSWORD — không cần duplicate trong Auth
- User/Role modules phụ thuộc Auth — triển khai Auth trước Sprint 1

## Checklist

- [x] Local setup steps
- [x] Permission extension guide
- [x] Reusable components list
- [x] Test commands
- [x] Security checklist
- [x] Cross-ref sibling modules
