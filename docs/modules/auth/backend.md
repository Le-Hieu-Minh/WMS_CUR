# Auth – Backend Documentation

## Cấu trúc

```
backend/src/modules/auth/
├── auth.route.js
├── auth.controller.js
├── auth.service.js
├── auth.repository.js
└── auth.validation.js
```

Đăng ký: `router.use('/auth', authRoutes)` trong `src/routes/index.js`.

## Middleware

| Middleware | Dùng cho |
|------------|----------|
| `validate(schema)` | login, refresh, logout, change-password |
| `authenticate` | logout, me, change-password |
| `loginRateLimiter` | login (10/15 phút) |

## Service – method chính

| Method | Mô tả |
|--------|--------|
| `login` | Verify user, lock, bcrypt, issue tokens |
| `refresh` | Verify JWT + DB record, cấp access mới |
| `logout` | Revoke refresh token |
| `getMe` | Load user + role + permissions |
| `changePassword` | Verify current, hash new, revoke all |

## Env liên quan

| Variable | Default |
|----------|---------|
| `JWT_ACCESS_SECRET` | (required, ≥32) |
| `JWT_REFRESH_SECRET` | (required, ≥32) |
| `JWT_ACCESS_EXPIRES_IN` | `15m` |
| `JWT_REFRESH_EXPIRES_IN` | `7d` |

## Access token payload

```json
{
  "sub": "user-uuid",
  "email": "admin@wms.com",
  "roleId": "role-uuid",
  "roleName": "Admin",
  "permissions": ["user:read"]
}
```

## Test

```bash
cd backend && npm test
```

Files: `auth.validation.test.js`, `auth.service.test.js`
