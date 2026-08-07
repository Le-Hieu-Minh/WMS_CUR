# Audit Log – Hướng dẫn người dùng

## Overview

Hướng dẫn tra cứu **Nhật ký hoạt động** dành cho quản trị viên.

## Purpose

Giúp supervisor kiểm tra ai đã xác nhận phiếu, đăng nhập, đổi mật khẩu.

## Scope

Menu **Nhật ký hoạt động** — thường chỉ Admin/Manager có quyền xem.

## Workflow

1. Mở trang Nhật ký.
2. (Tuỳ chọn) Nhập từ khóa tìm mô tả hoặc action.
3. Lọc **Module** (Auth, Nhập kho, Xuất kho, Kiểm kê, Điều chỉnh).
4. Chọn khoảng **Từ ngày – Đến ngày**.
5. Click một dòng → xem chi tiết (dữ liệu trước/sau nếu có).

## Business Rules

Nhật ký **không thể sửa hoặc xóa** trên giao diện. Mật khẩu và token không hiển thị (đã ẩn hệ thống).

## Technical Design

N/A.

## API / Database

N/A.

## Validation

Ngày đến bao gồm cả ngày chọn (đến 23:59).

## Security

Chỉ user có quyền `audit-log:read` truy cập được.

## Error Handling

Không có dữ liệu → bảng trống, không phải lỗi.

## Examples

Tìm module **Kiểm kê** tuần này → xem ai confirm phiếu ST-20260807-0001.

## Design Decisions

Read-only by design — đảm bảo tin cậy audit.

## Notes

Kết hợp với báo cáo nghiệp vụ để đối chiếu số liệu.

## Checklist

- [ ] Phân quyền read cho auditor role
- [ ] Quy trình điều tra sự cố nội bộ
