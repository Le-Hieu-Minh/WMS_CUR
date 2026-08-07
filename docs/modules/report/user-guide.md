# Report – Hướng dẫn người dùng

## Overview

Hướng dẫn xem và tải báo cáo trên WMS.

## Purpose

Giúp user chọn đúng loại báo cáo và bộ lọc.

## Scope

Menu **Báo cáo** (`/reports`).

## Workflow

1. Chọn **Loại báo cáo** (Tồn kho, Giá trị tồn, Nhập, Xuất, Kiểm kê, Điều chỉnh).
2. (Tuỳ chọn) Chọn **Kho**.
3. Với Nhập/Xuất/Kiểm kê/Điều chỉnh: chọn **Từ ngày – Đến ngày**.
4. Xem bảng kết quả trên màn hình.
5. Bấm **Excel** hoặc **PDF** để tải (cần quyền export).

## Business Rules

| Loại | Ý nghĩa |
|------|---------|
| Tồn kho | Số lượng hiện tại theo kho/SP |
| Giá trị tồn | Tồn × giá vốn |
| Nhập/Xuất | Chỉ phiếu đã xác nhận trong khoảng ngày |
| Kiểm kê | Dòng CONFIRMED: tồn HT, số đếm, chênh lệch |
| Điều chỉnh | Dòng CONFIRMED: Tăng/Giảm và lý do |

PDF có thể rút gọn nếu quá 200 dòng; Excel chứa đầy đủ (tối đa 10.000 dòng).

## Technical Design

N/A.

## API / Database

N/A.

## Validation

Chọn kho trước khi lọc hẹp; ngày để trống = không lọc theo ngày (document reports).

## Security

Xem cần `report:read`; tải file cần `report:export`.

## Error Handling

Thông báo nếu export thất bại; bảng trống nếu không có dữ liệu.

## Examples

Cuối tháng: báo cáo Kiểm kê từ 01/08–31/08, export Excel gửi kế toán.

## Design Decisions

Preview trước khi export — tránh tải nhầm loại báo cáo.

## Notes

Cột tiêu đề file có thể là tiếng Anh (key kỹ thuật) — sẽ cải thiện i18n sau.

## Checklist

- [ ] Hướng dẫn phân quyền export
- [ ] Lịch báo cáo định kỳ (quy trình ngoài hệ thống)
