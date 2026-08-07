# Customer – Hướng dẫn người dùng

## Overview

Hướng dẫn quản lý **Khách hàng** trên WMS.

## Purpose

Hướng dẫn nghiệp vụ CRUD KH qua giao diện.

## Scope

Trang `/customers`

## Workflow

1. Menu **Khách hàng**
2. **Thêm mới:** Mã KH + Tên (bắt buộc), thông tin liên hệ
3. **Sửa:** icon bút
4. **Ngừng:** icon thùng rác → xác nhận

KH Hoạt động dùng khi tạo **Phiếu xuất**.

## Business Rules

Mã không trùng · không xóa hẳn · KH Ngừng không phiếu xuất mới

## Technical Design

[frontend.md](./frontend.md)

## API / Database

Không áp dụng (UI)

## Validation

Mã + tên bắt buộc; email hợp lệ nếu có

## Security

customer:create/update/delete

## Error Handling

Mã trùng → đổi mã

## Examples

CUS-001, Công ty Alpha, liên hệ Trần B

## Design Decisions

Giống flow NCC — một lần học dùng cả hai

## Notes

Phiếu xuất cũ vẫn hiển thị KH đã Ngừng

## Checklist

- [x] Steps + goods issue usage
