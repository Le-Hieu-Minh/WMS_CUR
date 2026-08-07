# Auth — Backend Documentation

## Overview

Thiết kế layered backend module Auth: route, controller, service, repository, validation và middleware tái sử dụng.

## Purpose

Mô tả kiến trúc BE, luồng xử lý request, dependencies và env để dev triển khai/bảo trì Auth API.

## Scope

`backend/src/modules/auth/*` và middleware `authenticate`/`authorize` trong `backend/src/middlewares/auth.middleware.js`.

## Workflow

```
Request → Route (rate limit / validate / authenticate)
       → Controller (asyncHandler)
       → Service (business logic, JWT, bcrypt)
       → Repository (Prisma)
       → Response (successResponse)
```

## Business Rules

Service enforce: lockout (BR-07), INACTIVE check (BR-08), token revoke (BR-05/06), generic login error (BR-10), password policy.

## Technical Design

### Cấu trúc file

```
backend/src/modules/auth/
├── auth.route.js
├── auth.controller.js
├── auth.service.js
├── auth.repository.js
└── auth.validation.js
```

Đăng ký: `router.use('/auth', authRoutes)` trong `backend/src/routes/index.js`.

### Middleware

| Middleware | Áp dụng |
|------------|---------|
| `loginRateLimiter` | POST `/login` — 10 req/15 phút (skip khi `NODE_ENV=test`) |
| `validate(schema)` | login, refresh, logout, change-password |
| `authenticate` | logout, me, change-password |

### Service methods

| Method | Input | Output / Side effects |
|--------|-------|----------------------|
| `login` | email, password, meta | tokens + user; reset attempts; audit LOGIN |
| `refresh` | refreshToken | new accessToken |
| `logout` | refreshToken, userId, meta | revoke token; audit LOGOUT |
| `getMe` | userId | mapUserResponse |
| `changePassword` | userId, passwords, meta | hash new; revoke all; audit CHANGE_PASSWORD |

### Helpers (exported for tests)

`hashToken`, `getPermissions`, `mapUserResponse`, `createAccessToken`, `createRefreshToken`, `getExpiresInSeconds`, `MAX_FAILED_ATTEMPTS`, `LOCK_DURATION_MINUTES`.

### Access token payload

```json
{
  "sub": "user-uuid",
  "email": "admin@wms.com",
  "roleId": "role-uuid",
  "roleName": "Admin",
  "permissions": ["user:read"]
}
```

### Env variables

| Variable | Default | Mô tả |
|----------|---------|-------|
| JWT_ACCESS_SECRET | required (≥32) | Ký access token |
| JWT_REFRESH_SECRET | required (≥32) | Ký refresh token |
| JWT_ACCESS_EXPIRES_IN | `15m` | TTL access |
| JWT_REFRESH_EXPIRES_IN | `7d` | TTL refresh |

## API / Database

Endpoints: [api.md](./api.md). Repository queries: [database.md](./database.md).

## Validation

| Schema | File |
|--------|------|
| loginSchema | email + password |
| refreshSchema / logoutSchema | refreshToken |
| changePasswordSchema | current + new + confirm + refine |

Shared: `backend/src/utils/passwordPolicy.js`.

## Security

- bcrypt rounds = 12
- Refresh stored as SHA-256 hash
- `assertAccountCanLogin` — không leak user existence
- Audit log ghi IP/userAgent từ request meta

## Error Handling

`ApiError` + `HttpStatus` enum. Controller bọc `asyncHandler` — lỗi propagate tới global error middleware.

| Service throw | Status |
|---------------|--------|
| User not found (login) | 401 (generic) |
| INACTIVE | 403 |
| LOCKED | 423 |
| Invalid refresh | 401 |
| Wrong current password | 400 |

## Examples

```bash
cd backend && npm test -- auth
```

Test files: `auth.validation.test.js`, `auth.service.test.js`.

## Design Decisions

| Decision | Reason | Advantages | Trade-offs |
|----------|--------|------------|------------|
| Repository tách Service | Testability | Mock DB dễ | Thêm layer |
| Export helpers | Unit test | Coverage tốt | Public surface rộng hơn |
| Auto unlock expired lock | UX | Không cần Admin | Edge case race |

## Notes

`authRepository.revokeAllUserTokens` được User module gọi khi deactivate/reset password. Permission constants: `backend/src/constants/permissions.js`.

## Checklist

- [x] Layer structure + registration
- [x] Middleware matrix
- [x] Service methods + side effects
- [x] Env + JWT payload
- [x] Test commands
