# Auth — Hướng dẫn người dùng

## Overview

Hướng dẫn thao tác đăng nhập, đăng xuất và đổi mật khẩu trên giao diện WMS dành cho mọi người dùng nội bộ.

## Purpose

Giúp user cuối sử dụng Auth mà không cần hiểu kỹ thuật: các bước thao tác, lỗi thường gặp và cách xử lý.

## Scope

Đăng nhập, đăng xuất, đổi mật khẩu. Quản lý tài khoản khác → [User user-guide](../user/user-guide.md).

## Workflow

### Đăng nhập

1. Mở hệ thống WMS → trang **Đăng nhập** (`/login`)
2. Nhập **email** và **mật khẩu** do Admin cấp
3. Nhấn **Đăng nhập**
4. Thành công → vào trang chủ theo quyền vai trò

Tài khoản mặc định môi trường dev: `admin@wms.com` / `Admin@123`

### Đăng xuất

Nhấn icon **Đăng xuất** ở góc phải Header. Phiên hiện tại bị thu hồi; cần đăng nhập lại để tiếp tục.

### Đổi mật khẩu

1. Header → **Đổi MK** (hoặc `/change-password`)
2. Nhập mật khẩu hiện tại, mật khẩu mới và xác nhận
3. Mật khẩu mới: tối thiểu 8 ký tự, có chữ hoa, chữ thường và số
4. Lưu → hệ thống đăng xuất và yêu cầu đăng nhập lại

## Business Rules

| Quy tắc | Ảnh hưởng user |
|---------|----------------|
| Không tự đăng ký | Liên hệ Admin để được cấp tài khoản |
| 5 lần sai mật khẩu | Tài khoản khóa ~15 phút |
| Tài khoản vô hiệu | Không đăng nhập được — liên hệ Admin |
| Đổi MK | Mọi thiết bị đang đăng nhập bị đăng xuất |

## Technical Design

Không áp dụng — xem [frontend.md](./frontend.md) nếu cần chi tiết kỹ thuật.

## API / Database

Không áp dụng — người dùng thao tác qua giao diện web.

## Validation

Form kiểm tra email hợp lệ và chính sách mật khẩu trước khi gửi. Thông báo lỗi hiển thị dưới từng trường hoặc alert chung.

## Security

Không chia sẻ mật khẩu. Đổi mật khẩu định kỳ nếu chính sách công ty yêu cầu. Báo Admin nếu nghi ngờ tài khoản bị lạm dụng.

## Error Handling

| Thông báo | Nguyên nhân | Cách xử lý |
|-----------|-------------|------------|
| Email hoặc mật khẩu không đúng | Sai thông tin | Kiểm tra lại Caps Lock, email |
| Tài khoản đã bị vô hiệu hóa | Admin deactivate | Liên hệ Admin |
| Tài khoản tạm khóa | Đăng nhập sai nhiều lần | Đợi ~15 phút hoặc nhờ Admin mở khóa |
| Tự về trang login | Phiên hết hạn | Đăng nhập lại |
| Mật khẩu xác nhận không khớp | Nhập sai confirm | Nhập lại |

## Examples

**Kịch bản:** Nhân viên mới nhận email/mật khẩu tạm từ Admin → đăng nhập → vào **Đổi MK** → đặt mật khẩu riêng → tiếp tục làm việc.

## Design Decisions

Không áp dụng tại tài liệu user — quyết định kỹ thuật xem [README.md](./README.md#design-decisions).

## Notes

Admin mở khóa tài khoản LOCKED: [User user-guide — Mở khóa](../user/user-guide.md). Không có chức năng "Quên mật khẩu" tự phục vụ trong MVP.

## Checklist

- [x] Hướng dẫn login/logout/change-password
- [x] Bảng lỗi thường gặp
- [x] Cross-ref User module cho Admin tasks
- [x] Không jargon kỹ thuật
