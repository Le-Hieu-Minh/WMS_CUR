# Dashboard – Hướng dẫn sử dụng

## Overview

Hướng dẫn đọc màn **Tổng quan** (Dashboard) trên WMS.

## Purpose

Giúp quản lý nắm nhanh tình hình kho trong một màn hình.

## Scope

User có quyền `dashboard:read` (thường Manager, Admin).

## Workflow

### Truy cập

1. Đăng nhập → tự vào trang chủ `/`.
2. Nếu **không có quyền**: chỉ thấy lời chào và hướng dẫn liên hệ Admin.
3. Nếu **có quyền**: xem KPI, biểu đồ, bảng.

### Đọc KPI

| Thẻ | Ý nghĩa |
|-----|---------|
| Tổng sản phẩm | SP đang hoạt động |
| Tổng kho | Kho đang hoạt động |
| Tổng tồn kho | Tổng số lượng tất cả kho |
| Giá trị tồn kho | Tồn × giá vốn |
| Phiếu nhập hôm nay | Số phiếu nhập **đã xác nhận** trong ngày |
| Phiếu xuất hôm nay | Số phiếu xuất **đã xác nhận** trong ngày |

### Biểu đồ 12 tháng

Cột **Nhập** / **Xuất** = **số phiếu** đã xác nhận mỗi tháng (không phải tổng số lượng hàng).

### Bảng hỗ trợ

| Bảng | Nội dung |
|------|----------|
| Top nhập | 5 SP được nhập nhiều nhất (tổng qty) |
| Top xuất | 5 SP được xuất nhiều nhất |
| Sắp hết hàng | 10 dòng tồn thấp nhất (≤ min) |

## Business Rules

Dữ liệu cập nhật khi tải lại trang (F5). Phiếu Nháp **không** tính vào KPI ngày/chart.

## Technical Design

Thẻ số + biểu đồ cột Recharts.

## API / Database (nếu có)

N/A user.

## Validation

N/A.

## Security

Không thấy số liệu → yêu cầu Admin cấp `dashboard:read`.

## Error Handling

Banner đỏ "Không tải được dữ liệu dashboard" → thử F5.

## Examples

Sáng confirm 3 phiếu xuất → "Phiếu xuất hôm nay" tăng (nếu issue_date = hôm nay).

## Design Decisions

Tách quyền dashboard — nhân viên kho có thể chỉ dùng nhập/xuất không cần KPI.

## Notes

Giá trị tồn ước lượng theo giá vốn master, không phải giá từng phiếu nhập.

## Checklist (user)

- [ ] Hiểu phiếu Nháp không vào KPI
- [ ] Biểu đồ đếm phiếu không phải qty
- [ ] Theo dõi bảng sắp hết hàng
