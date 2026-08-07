# User — Hướng dẫn người dùng (Admin)

## Overview

Hướng dẫn Admin quản lý tài khoản người dùng nội bộ trên giao diện WMS: tạo, sửa, vô hiệu hóa, mở khóa, reset mật khẩu.

## Purpose

Hướng dẫn thao tác thực tế cho người quản trị — không yêu cầu kiến thức kỹ thuật.

## Scope

Module **Người dùng** (`/users`). Đăng nhập bản thân → [Auth user-guide](../auth/user-guide.md). Vai trò → [Role user-guide](../role/user-guide.md).

## Workflow

### Xem danh sách

1. Đăng nhập tài khoản có quyền quản lý user (thường **Admin**)
2. Sidebar → **Người dùng**
3. Tìm kiếm theo email/họ tên; lọc theo trạng thái

### Tạo người dùng

1. Nhấn **Tạo người dùng** (icon +)
2. Nhập email, họ tên, mật khẩu tạm, chọn vai trò
3. **Lưu** → gửi thông tin đăng nhập cho nhân viên (thủ công, ngoài hệ thống)

Mật khẩu tạm: tối thiểu 8 ký tự, có hoa, thường, số.

### Cập nhật

Mở dialog sửa (icon bút) → thay họ tên, vai trò hoặc URL avatar. **Không đổi được email** trong phiên bản hiện tại.

### Vô hiệu hóa / kích hoạt

| Hành động | Kết quả |
|-----------|---------|
| Vô hiệu hóa (INACTIVE) | User không đăng nhập được; phiên hiện tại bị thu hồi |
| Kích hoạt (ACTIVE) | Cho phép đăng nhập lại |

**Lưu ý:** Không thể vô hiệu hóa chính tài khoản đang đăng nhập. Không thể vô hiệu hóa Admin duy nhất còn active.

### Mở khóa

Khi user ở trạng thái **LOCKED** (đăng nhập sai nhiều lần) → nhấn icon **Mở khóa** (LockOpen). Tài khoản về ACTIVE và reset bộ đếm sai.

### Reset mật khẩu

1. Chọn user → icon **Reset mật khẩu** (KeyRound)
2. Nhập mật khẩu mới + xác nhận
3. User phải đăng nhập lại; mọi thiết bị cũ bị đăng xuất

### Xóa (vô hiệu hóa)

Trong MVP, **Xóa** = vô hiệu hóa tài khoản (giữ dữ liệu lịch sử). Không xóa vĩnh viễn khỏi database.

## Business Rules

| Quy tắc | Hành vi UI |
|---------|------------|
| Chỉ Admin (hoặc role có `user:*`) | Menu ẩn nếu không đủ quyền |
| Không tự vô hiệu/xóa mình | Thông báo lỗi từ hệ thống |
| Bảo vệ Admin cuối | Lỗi khi cố deactivate/đổi role Admin duy nhất |
| Email trùng | Lỗi khi tạo user |

## Technical Design

Không áp dụng — xem [frontend.md](./frontend.md) nếu cần.

## API / Database

Không áp dụng — thao tác qua giao diện web.

## Validation

Form kiểm tra trước khi gửi: email hợp lệ, họ tên ≥2 ký tự, mật khẩu đúng policy, xác nhận khớp.

## Security

Chỉ cấp quyền `user:*` cho người tin cậy. Gửi mật khẩu tạm qua kênh bảo mật (không chat công khai).

## Error Handling

| Thông báo | Xử lý |
|-----------|-------|
| Email đã tồn tại | Dùng email khác |
| Không thể tự vô hiệu hóa... | Nhờ Admin khác thao tác |
| Không thể vô hiệu hóa Admin cuối cùng | Tạo/promote Admin khác trước |
| Vai trò không tồn tại | Refresh trang, chọn lại role |

## Examples

**Onboarding nhân viên mới:** Tạo user Staff → gửi email/mật khẩu → nhân viên login → đổi MK tại [Auth](../auth/user-guide.md).

## Design Decisions

Không áp dụng tại user guide.

## Notes

Gán vai trò mới tạo: làm tại module **Người dùng**, không tại **Phân quyền**. Chi tiết vai trò: [Role user-guide](../role/user-guide.md).

## Checklist

- [x] List/create/update flows
- [x] Status/unlock/reset/delete
- [x] Business constraints explained
- [x] Cross-ref Auth + Role
