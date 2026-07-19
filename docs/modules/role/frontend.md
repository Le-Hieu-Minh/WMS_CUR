# Role & Permission – Frontend Design

## Routes

| Path | Page | Guard |
|------|------|-------|
| `/roles` | RolesPage | Protected + `role:read` |

## Layout

- AppLayout + Sidebar mục **Phân quyền**  
- Breadcrumb: `Trang chủ / Phân quyền`

## RolesPage

Trang độc lập (không dùng MasterDataListPage).

| Thành phần | Mô tả |
|------------|--------|
| Search | Tìm theo tên / mô tả |
| Table | Tên, mô tả, số quyền, số user, loại (Hệ thống/Tùy chỉnh) |
| Pagination | page / limit = 10 |
| Dialog | Tạo/sửa với checkbox quyền nhóm theo module |
| ConfirmDialog | Xóa role |

### Actions theo permission

- `role:create` → nút Thêm vai trò  
- `role:update` → Sửa (disable tên nếu isSystem)  
- `role:delete` → Xóa (ẩn nếu isSystem hoặc userCount > 0)  

## Feature structure

```
frontend/src/features/roles/
├── pages/RolesPage.jsx
├── api/roleApi.js
└── schemas/roleSchema.js
```

## API client (`roleApi.js`)

- `list`, `getById`, `create`, `update`, `remove`, `getPermissions`

## Query keys

```
['roles', { page, search }]
['roles', 'meta', 'permissions']
```

## Form stack

React Hook Form + Zod (`createRoleSchema` / `updateRoleSchema`) + Shadcn UI

## Permission UI

Dùng `usePermissions()` → `hasPermission('role:*')`
