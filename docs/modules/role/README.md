# Module Role & Permission

| Thuộc tính | Giá trị |
|------------|---------|
| Sprint | 1 – Module 3 |
| Trạng thái | ✅ Đã triển khai |
| Base path | `/api/v1/roles` |
| FE route | `/roles` |

## Tài liệu con

| File | Nội dung |
|------|----------|
| [analysis.md](./analysis.md) | 23 mục nghiệp vụ |
| [api.md](./api.md) | API Design |
| [database.md](./database.md) | Schema Role / Permission |
| [frontend.md](./frontend.md) | UI / feature structure |
| [backend.md](./backend.md) | Layer BE |
| [user-guide.md](./user-guide.md) | Hướng dẫn Admin |
| [developer-guide.md](./developer-guide.md) | Ghi chú triển khai |

## Permissions

`role:read` · `role:create` · `role:update` · `role:delete`

## Tóm tắt nhanh

- CRUD vai trò tùy chỉnh, gán quyền theo module
- Bảo vệ 3 vai trò hệ thống: Admin, Manager, Staff
- Không xóa vai trò đang có user hoặc vai trò hệ thống
- API meta: danh sách quyền nhóm theo module
