# User – Frontend Design

## Routes

| Path | Page | Guard |
|------|------|-------|
| `/users` | UsersPage | Protected + `user:read` |

## Layout

- AppLayout: Sidebar (enable mục Người dùng), Header, Breadcrumb  
- Breadcrumb: `Trang chủ / Người dùng`

## List page

| Thành phần | Mô tả |
|------------|--------|
| Search | Debounce email / họ tên |
| Filter | Status, Role |
| Table | TanStack Table |
| Sort | fullName, email, createdAt, lastLoginAt |
| Pagination | page / limit |
| Empty / Loading / Error | Skeleton, empty CTA, retry |

### Cột bảng

Avatar · Họ tên · Email · Role · Status badge · Last login · Actions

### Actions

Xem/Sửa · Đổi status · Unlock (LOCKED) · Reset password · Soft delete (confirm)

## Dialogs / Forms

- CreateUserDialog  
- EditUserDialog  
- ResetPasswordDialog  
- Confirm status/delete  

Stack: React Hook Form + Zod + Shadcn Dialog/Button/Input/Select

## Feature structure (dự kiến)

```
frontend/src/features/users/
├── pages/UsersPage.jsx
├── components/
│   ├── UserTable.jsx
│   ├── UserFilters.jsx
│   ├── CreateUserDialog.jsx
│   ├── EditUserDialog.jsx
│   ├── ResetPasswordDialog.jsx
│   └── UserStatusBadge.jsx
├── hooks/useUsers.js
├── api/userApi.js
└── schemas/userSchema.js
```

## Query keys

```
['users', filters]
['users', id]
['users', 'meta', 'roles']
```

## Permission UI

- Ẩn menu nếu không có `user:read`  
- Ẩn nút theo `user:create|update|delete`  
- Dùng `user.role.permissions` từ AuthProvider  

## Responsive

Desktop: full table. Mobile: scroll ngang hoặc card list.
