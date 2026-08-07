# Role & Permission — Hướng dẫn người dùng (Admin)

## Overview

Hướng dẫn Admin quản lý vai trò và quyền hạn trên giao diện WMS — tạo role tùy chỉnh, chỉnh quyền, xóa role không dùng.

## Purpose

Hướng dẫn thao tác thực tế cho quản trị viên phân quyền hệ thống.

## Scope

Module **Phân quyền** (`/roles`). Gán role cho user → [User user-guide](../user/user-guide.md).

## Workflow

### Xem danh sách vai trò

1. Đăng nhập Admin (hoặc tài khoản có `role:read`)
2. Sidebar → **Phân quyền**
3. Tìm kiếm theo tên hoặc mô tả

Bảng hiển thị: tên, mô tả, số quyền, số user, loại **Hệ thống** / **Tùy chỉnh**.

### Tạo vai trò mới

1. Nhấn **Thêm vai trò**
2. Nhập **tên** (2–100 ký tự) và **mô tả** (tuỳ chọn)
3. Chọn **ít nhất một quyền** — checkbox nhóm theo module (Kho, Sản phẩm, …)
4. **Lưu**
5. Vào **Người dùng** để gán vai trò mới cho nhân viên

### Sửa vai trò

1. Nhấn icon **bút** ở dòng vai trò
2. Cập nhật mô tả và/hoặc bộ quyền
3. **Lưu**

**Lưu ý:** Vai trò **Hệ thống** (Admin, Manager, Staff) — **không đổi được tên**, vẫn có thể sửa mô tả và quyền (cẩn trọng).

### Xóa vai trò

Chỉ xóa được vai trò **Tùy chỉnh** và **chưa gán cho ai** (`userCount = 0`).

Nếu còn người dùng: hệ thống báo lỗi — chuyển user sang vai trò khác trước khi xóa.

Không thể xóa vai trò **Hệ thống**.

## Business Rules

| Vai trò | Quyền (theo seed) | Ghi chú |
|---------|-------------------|---------|
| Admin | Toàn quyền | Không xóa/đổi tên |
| Manager | Vận hành kho (không user/role/audit-log) | Không xóa/đổi tên |
| Staff | Chủ yếu `:read` | Không xóa/đổi tên |

Thay đổi quyền role có hiệu lực với user sau khi họ **đăng nhập lại** hoặc token được refresh.

## Technical Design

Không áp dụng — xem [frontend.md](./frontend.md).

## API / Database

Không áp dụng — thao tác qua giao diện.

## Validation

Tên tối thiểu 2 ký tự; phải chọn ít nhất 1 quyền; tên không trùng role khác.

## Security

Chỉ tin tưởng Admin với quyền `role:*`. Tránh thu hẹp quyền Admin/Manger đang active nếu chưa có Admin dự phòng.

## Error Handling

| Thông báo | Xử lý |
|-----------|-------|
| Tên vai trò đã tồn tại | Chọn tên khác |
| Không thể xóa vai trò hệ thống | Không áp dụng — nút ẩn |
| Không thể xóa vai trò đang được gán... | Reassign users trước |
| Phải chọn ít nhất 1 quyền | Tick thêm checkbox |

## Examples

**Kịch bản:** Tạo role "Thu kho" với `goods-receipt:*`, `inventory:read` → gán cho 3 nhân viên → nếu không cần nữa, chuyển 3 user sang Staff → xóa role "Thu kho".

## Design Decisions

Không áp dụng tại user guide.

## Notes

Danh sách quyền cố định theo phiên bản hệ thống (seed) — thêm quyền module mới cần cập nhật phần mềm. Chi tiết dev: [developer-guide.md](./developer-guide.md).

## Checklist

- [x] List/create/edit/delete flows
- [x] System vs custom roles explained
- [x] userCount constraint
- [x] Cross-ref User module for assignment
