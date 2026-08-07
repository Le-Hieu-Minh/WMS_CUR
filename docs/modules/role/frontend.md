# Role & Permission — Frontend Documentation

## Overview

Thiết kế giao diện trang `/roles`: quản lý vai trò, checkbox quyền nhóm theo module, actions theo permission.

## Purpose

Mô tả routes, components, state và API integration cho dev FE bảo trì Role feature.

## Scope

`frontend/src/features/roles/` — không bao gồm User assign role hay Auth.

## Workflow

```mermaid
flowchart TD
    A[/roles] --> B[listQuery roles]
    B --> C[Table]
    C --> D[Open dialog]
    D --> E[permissionsQuery meta]
    E --> F[Checkbox by module]
    F --> G[Submit create/update]
    C --> H[Delete confirm]
```

## Business Rules

| UI | Rule |
|----|------|
| Nút Thêm vai trò | `role:create` |
| Sửa | `role:update`; disable name input if `isSystem` |
| Xóa | `role:delete`; hidden if `isSystem` or `userCount > 0` |
| Submit | ≥ 1 permission selected (`selectedPermissions`) |

## Technical Design

### Routes

| Path | Page | Guard |
|------|------|-------|
| `/roles` | `RolesPage` | ProtectedRoute + `role:read` |

Layout: AppLayout, Sidebar **Phân quyền**, Breadcrumb `Trang chủ / Phân quyền`.

Trang độc lập — **không** dùng `MasterDataListPage`.

### Feature structure

```
frontend/src/features/roles/
├── pages/RolesPage.jsx
├── api/roleApi.js
└── schemas/roleSchema.js
```

### RolesPage components

| Thành phần | Mô tả |
|------------|--------|
| Search | Tìm theo tên/mô tả |
| Table | Tên, mô tả, số quyền, số user, badge Hệ thống/Tùy chỉnh |
| Pagination | limit=10 |
| Dialog | Tạo/sửa — name, description, permission checkboxes grouped |
| ConfirmDialog | Xóa role |
| selectedPermissions | Local state array UUID — merge với form submit |

### API client (`roleApi.js`)

| Method | Endpoint |
|--------|----------|
| list(params) | GET /roles |
| getById(id) | GET /roles/:id |
| create(data) | POST /roles |
| update(id, data) | PUT /roles/:id |
| remove(id) | DELETE /roles/:id |
| getPermissions() | GET /roles/meta/permissions |

### Query keys

```
['roles', { page, search }]
['roles', 'meta', 'permissions']   # enabled when dialogOpen
```

### Form stack

React Hook Form + Zod (`roleFormSchema`) + Shadcn Dialog/Input/Textarea/Badge/Checkbox.

Permission groups: iterate `Object.entries(permissionsQuery.data)` by module key.

## API / Database

[api.md](./api.md). No direct DB access.

## Validation

`roleSchema.js` — name 2–100, description max 500, client-side check min 1 permission before submit. Tests: `schemas/__tests__/roleSchema.test.js`.

## Security

`usePermissions().hasPermission('role:*')`. Sidebar item hidden without `role:read`.

## Error Handling

`getErrorMessage(error)` in dialog. Common: 409 name duplicate, 409 role has users, 400 system role.

## Examples

```javascript
// Open edit — prefill selectedPermissions from role.permissions
setSelectedPermissions(role.permissions.map(p => p.id));
```

## Design Decisions

| Decision | Reason | Advantages | Trade-offs |
|----------|--------|------------|------------|
| selectedPermissions separate state | Checkbox UX | Toggle without RHF array complexity | Manual sync on edit |
| Lazy load permissions | Performance | Fetch only when dialog opens | Loading spinner |
| Badge for isSystem | Visual clarity | Admin knows protected roles | Extra UI element |

## Notes

After creating role, assign to users via [User frontend](../user/frontend.md). `roleFormSchema` used for both create and update — permissionIds appended on submit.

## Checklist

- [x] Route + guard
- [x] Feature structure
- [x] API client + query keys
- [x] Permission checkbox UX
- [x] Action visibility rules
