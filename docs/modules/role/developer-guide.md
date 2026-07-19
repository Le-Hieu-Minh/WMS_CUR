# Role & Permission – Developer Guide

## Trạng thái

✅ **Đã triển khai** — backend `backend/src/modules/role/`, frontend `frontend/src/features/roles/`.

## Thứ tự triển khai đã áp dụng

```
1. Prisma: Role, Permission, RolePermission + seed
2. role.validation.js → repository → service → controller → route
3. GET /meta/permissions (trước /:id)
4. FE: roleSchema → roleApi → RolesPage (checkbox permissions)
5. PermissionRoute role:read + Sidebar
```

## Phụ thuộc

| Module | Quan hệ |
|--------|---------|
| Auth | JWT + authorize middleware |
| User | Gán roleId; GET /users/meta/roles đọc từ bảng roles |
| Seed | permissions theo module |

## Điểm cần nhớ khi sửa

- `SYSTEM_ROLE_NAMES` phải khớp seed  
- Update permissionIds = xóa hết RolePermission cũ rồi insert mới  
- `mapRole` thêm `isSystem` từ tên role, không có cột DB  
- FE validate permissionIds client-side trước khi submit  

## Test thủ công

```bash
npm run db:seed
npm run dev

# Admin → /roles → CRUD role tùy chỉnh
# Thử xóa Admin → 400
# Tạo role + gán user → thử xóa role → 409
```

## Mở rộng Sprint sau

Khi thêm module mới (Goods Receipt, …), seed thêm permissions và role Admin sẽ tự có quyền qua seed script.
