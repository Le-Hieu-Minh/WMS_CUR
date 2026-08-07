# Product – Hướng dẫn người dùng

## Overview

Hướng dẫn quản lý **Sản phẩm** trên WMS cho user có quyền product.

## Purpose

Hướng dẫn thao tác catalog: tạo, sửa, tìm kiếm, vô hiệu hóa sản phẩm.

## Scope

Trang `/products`. Không hướng dẫn nhập hàng chi tiết.

## Workflow

### Xem & tìm kiếm

Menu **Sản phẩm** → tìm theo mã/tên/danh mục → lọc Hoạt động/Ngừng.

### Tạo sản phẩm

Thêm mới → Mã SP + Tên (bắt buộc) → Danh mục, ĐVT (mặc định pcs), Giá bán, Giá vốn, Tồn tối thiểu → Lưu.

### Sửa / Vô hiệu hóa

Bút: sửa thông tin. Thùng rác (ACTIVE only): vô hiệu hóa — không dùng trên phiếu mới.

## Business Rules

| Quy tắc | Ý nghĩa |
|---------|---------|
| Mã không trùng | Đổi mã nếu báo lỗi |
| Tồn tối thiểu | Ngưỡng cảnh báo hết hàng (dashboard) |
| SP Ngừng | Không chọn khi tạo phiếu mới |
| Giá ≥ 0 | Không nhập số âm |

## Technical Design

Không áp dụng — [frontend.md](./frontend.md)

## API / Database

Không áp dụng — [api.md](./api.md) cho admin kỹ thuật.

## Validation

Mã + tên bắt buộc; tên tối thiểu 2 ký tự; email N/A.

## Security

Nút theo quyền product:create/update/delete.

## Error Handling

| Lỗi | Xử lý |
|-----|-------|
| Mã sản phẩm đã tồn tại | Đổi mã |
| Validation form | Sửa field đỏ |

## Examples

Tạo PRD-001 Laptop, category Electronics, minStock 5, giá 15.000.000 ₫.

## Design Decisions

UI đồng bộ với Kho/NCC/KH.

## Notes

Chưa upload ảnh trên UI. Giá hiển thị có dấu phân cách VN.

## Checklist

- [x] CRUD steps
- [x] minStock explained
- [ ] Category list chuẩn hóa (future)
