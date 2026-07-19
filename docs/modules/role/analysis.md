# Role & Permission – Phân tích nghiệp vụ (tổng hợp 23 mục)

## 1. Giới thiệu

Quản lý vai trò (Role) và gán quyền (Permission) cho người dùng. Permission được seed sẵn; Admin tạo role tùy chỉnh và chọn quyền.

## 2. Mục tiêu

- Phân quyền chi tiết theo `{module}:{action}`  
- Bảo vệ role hệ thống (Admin, Manager, Staff)  
- Cung cấp meta API cho form gán quyền  
- Tách biệt với Module User (User chỉ gán `roleId`)  

## 3. Nghiệp vụ

| Tác vụ | Actor |
|--------|-------|
| Xem danh sách / chi tiết role | Admin |
| Tạo / sửa role tùy chỉnh | Admin |
| Gán / cập nhật permissionIds | Admin |
| Xóa role (hard delete) | Admin |
| Xem danh sách permission | Admin |

## 4. User Story

| ID | Story | P |
|----|-------|---|
| ROL-01 | Xem danh sách role + search | Must |
| ROL-02 | Tạo role + chọn quyền | Must |
| ROL-03 | Sửa mô tả / quyền role tùy chỉnh | Must |
| ROL-04 | Không đổi tên / xóa role hệ thống | Must |
| ROL-05 | Không xóa role đang có user | Must |
| ROL-06 | Meta permissions nhóm theo module | Must |

## 5. Use Case

UC-List · UC-Create · UC-Update · UC-Delete · UC-ListPermissions  

## 6–7. Flow

Admin → `/roles` (`role:read`) → Table → Dialog tạo/sửa → chọn checkbox quyền → Lưu  
Xóa: confirm → hard delete (chỉ role tùy chỉnh, userCount = 0)  

## 8. Business Rules

| ID | Rule |
|----|------|
| BR-R01 | Chỉ `role:*` mới thao tác |
| BR-R02 | Tên role unique |
| BR-R03 | Admin/Manager/Staff = system role, không xóa |
| BR-R04 | System role không đổi tên |
| BR-R05 | Phải chọn ≥ 1 permission khi tạo/sửa |
| BR-R06 | Không xóa role có userCount > 0 |
| BR-R07 | Cập nhật permission = replace toàn bộ RolePermission |

## 9. Validation

- name: 2–100 ký tự  
- description: max 500, nullable  
- permissionIds: array UUID, min 1  
- List: page, limit, search, sortBy (name|createdAt), sortOrder  

## 10. Exception

400 validation / system role / permission không tồn tại · 401 · 403 · 404 · 409 tên trùng / role có user · 500  

## 11. Permission Matrix

| Endpoint | Permission |
|----------|------------|
| GET list / detail / meta | role:read |
| POST create | role:create |
| PUT update | role:update |
| DELETE | role:delete |

## 12–15. Design

Xem [database.md](./database.md), [api.md](./api.md), [frontend.md](./frontend.md), [backend.md](./backend.md).

## 16. Acceptance Criteria

- CRUD role tùy chỉnh OK  
- System role protected  
- Permission meta grouped  
- userCount hiển thị đúng  
- User module dùng role options  

## 17. Testing Strategy

Unit: service rules (system role, unique name, permission assert)  
Integration: mỗi endpoint Success/400/401/403/404/409  
FE: roleSchema + permission checkbox logic  

## 18–23. Docs

Đã tách thành các file trong thư mục này.
