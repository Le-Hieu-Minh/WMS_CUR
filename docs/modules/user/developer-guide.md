# User – Developer Guide

## Trạng thái

✅ **Đã triển khai** — backend `backend/src/modules/user/`, frontend `frontend/src/features/users/`.

## Thứ tự triển khai đã áp dụng

```
1. Shared passwordPolicy (tách từ Auth validation)
2. user.validation.js → repository → service → controller → route
3. GET /users/meta/roles (trước /:id)
4. Backend unit tests (user.service, user.validation)
5. FE: userSchema → userApi → UsersPage
6. PermissionRoute user:read + Sidebar
```

## Phụ thuộc

| Module | Quan hệ |
|--------|---------|
| Auth | Login fields, revoke tokens, password policy |
| Role & Permission | CRUD role sau; User chỉ assign `roleId` |
| Audit Log | Ghi create/update/status (Sprint 3) |

## Test thủ công sau khi code

```bash
npm run db:push
npm run db:seed
npm run dev

# Admin → CRUD /users
# Tạo Staff → login staff → gọi /users expect 403
```

## File sẽ tạo

**Backend**
- `backend/src/modules/user/*`

**Frontend**
- `frontend/src/features/users/*`
- Cập nhật `Sidebar.jsx`, `routes/index.jsx`
