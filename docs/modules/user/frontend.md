# User — Frontend Documentation

## Overview

Thiết kế giao diện quản lý người dùng: trang `/users` với bảng, filter, dialog tạo/sửa/reset và actions theo permission.

## Purpose

Mô tả routes, components, state management và permission UI cho dev FE bảo trì User feature.

## Scope

`frontend/src/features/users/` — không bao gồm Auth login hay Role management page.

## Workflow

```mermaid
flowchart TD
    A[/users] --> B[useQuery users list]
    B --> C[Table + Pagination]
    C --> D{Action}
    D --> E[Dialog create/edit]
    D --> F[Confirm status/delete]
    D --> G[Reset password dialog]
    D --> H[Unlock button]
    E --> I[useMutation → invalidate users]
```

## Business Rules

| UI | Rule |
|----|------|
| Sidebar "Người dùng" | Chỉ hiện nếu `user:read` |
| Nút Tạo | `user:create` |
| Sửa / Status / Unlock / Reset | `user:update` |
| Xóa | `user:delete` |
| Không self-delete | FE có thể disable (BE enforce) |

## Technical Design

### Routes

| Path | Page | Guard |
|------|------|-------|
| `/users` | `UsersPage` | ProtectedRoute + `user:read` |

Layout: AppLayout, Sidebar, Breadcrumb `Trang chủ / Người dùng`.

### Feature structure (triển khai)

```
frontend/src/features/users/
├── pages/UsersPage.jsx       # All-in-one page (table + dialogs)
├── api/userApi.js
└── schemas/userSchema.js
```

> MVP gom UI trong `UsersPage.jsx` — chưa tách component con riêng file.

### UsersPage thành phần

| Thành phần | Mô tả |
|------------|--------|
| Search | Debounce email / họ tên |
| Filter | Status (Select) |
| Table | Shadcn Table — avatar, họ tên, email, role, status badge, last login |
| Pagination | Shared `Pagination`, limit=10 |
| Dialogs | Create, Edit, Reset password (mode `dialogMode`) |
| ConfirmDialog | Status change, soft delete |
| Actions | Pencil, KeyRound (reset), LockOpen (unlock), Trash2 |

### API client (`userApi.js`)

| Method | Endpoint |
|--------|----------|
| list(params) | GET /users |
| getById(id) | GET /users/:id |
| create(data) | POST /users |
| update(id, data) | PUT /users/:id |
| changeStatus(id, status) | PATCH /users/:id/status |
| unlock(id) | POST /users/:id/unlock |
| resetPassword(id, data) | POST /users/:id/reset-password |
| remove(id) | DELETE /users/:id |
| getRoles() | GET /users/meta/roles |

### Query keys

```
['users', { page, search, status }]
['users', 'meta', 'roles']   # enabled khi dialog create/edit
```

### Form stack

React Hook Form + Zod (`createUserSchema`, `updateUserSchema`, `resetPasswordSchema`) + Shadcn Dialog/Input/Select.

## API / Database

API: [api.md](./api.md). Không truy cập DB trực tiếp.

## Validation

`userSchema.js` mirror BE rules. Tests: `schemas/__tests__/userSchema.test.js`.

## Security

`usePermissions().hasPermission('user:*')` ẩn actions. Permissions từ `user.role.permissions` (AuthProvider).

## Error Handling

`getErrorMessage(error)` → `error.response.data.message` hoặc "Có lỗi xảy ra". Hiển thị trong dialog `formError`.

## Examples

```javascript
const { hasPermission } = usePermissions();
if (hasPermission('user:create')) { /* show Plus button */ }
```

## Design Decisions

| Decision | Reason | Advantages | Trade-offs |
|----------|--------|------------|------------|
| Single page file | MVP velocity | Ít boilerplate | File ~370 lines |
| Roles query lazy | Performance | Chỉ fetch khi mở dialog | Extra loading state |
| Shared StatusBadge | Consistency | Reuse across modules | Coupling to shared |

## Notes

Responsive: table scroll ngang trên mobile. Chi tiết BE: [backend.md](./backend.md). Role dropdown từ `/users/meta/roles` — không gọi Role API trực tiếp.

## Checklist

- [x] Route + permission guard
- [x] Feature structure
- [x] API client methods
- [x] Query keys + form stack
- [x] UI actions matrix
