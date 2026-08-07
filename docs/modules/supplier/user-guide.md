# Supplier – Hướng dẫn người dùng

## Overview

Hướng dẫn quản lý **Nhà cung cấp** trên WMS.

## Purpose

Thao tác CRUD NCC qua UI không cần API.

## Scope

Trang `/suppliers`

## Workflow

1. **Xem:** Menu Nhà cung cấp → tìm kiếm / lọc trạng thái
2. **Tạo:** Thêm mới → Mã NCC + Tên (bắt buộc) → liên hệ, địa chỉ, ghi chú → Lưu
3. **Sửa:** Icon bút
4. **Ngừng:** Icon thùng rác (ACTIVE) → xác nhận → Ngừng

NCC Hoạt động xuất hiện khi tạo phiếu nhập.

## Business Rules

Mã unique · không xóa vĩnh viễn · NCC Ngừng không chọn phiếu mới

## Technical Design

Không áp dụng — [frontend.md](./frontend.md)

## API / Database

Không áp dụng

## Validation

Mã + tên bắt buộc; email đúng định dạng nếu nhập

## Security

Quyền supplier:create/update/delete

## Error Handling

Mã trùng → đổi mã khác

## Examples

SUP-001 / Công ty ABC / liên hệ Nguyễn Văn A

## Design Decisions

UI giống Khách hàng — dễ học

## Notes

Phiếu nhập cũ vẫn hiển thị NCC đã Ngừng

## Checklist

- [x] User steps
- [x] Link to goods receipt usage
