# Report – Phân tích 23 mục

## 1. Giới thiệu

Module báo cáo đọc dữ liệu nghiệp vụ, lọc theo khoảng thời gian/kho/SP, xem trên UI và xuất Excel/PDF.

## 2. Mục tiêu

- 6 loại báo cáo theo Master Prompt
- Filter chuẩn (dateFrom, dateTo, warehouseId, …)
- Export Excel + PDF
- Không sửa dữ liệu nguồn

## 3. Nghiệp vụ

Báo cáo = truy vấn read-only + presentation. Dữ liệu lấy từ inventories, goods_receipts/items, goods_issues/items, stock_takes, stock_adjustments.

## 4. User Story

| ID | Story | P |
|----|-------|---|
| RP-01 | Xem báo cáo tồn kho | Must |
| RP-02 | Xem báo cáo nhập/xuất theo ngày | Must |
| RP-03 | Xem báo cáo kiểm kê / điều chỉnh | Must |
| RP-04 | Xem giá trị tồn | Must |
| RP-05 | Xuất Excel | Must |
| RP-06 | Xuất PDF | Must |

## 5–7. Flow

```
/reports → chọn loại → filter → Xem bảng → Export Excel/PDF
```

## 8. Business Rules

| ID | Rule |
|----|------|
| BR-RP01 | Chỉ phiếu CONFIRMED (nhập/xuất/kiểm kê/điều chỉnh) |
| BR-RP02 | dateFrom ≤ dateTo |
| BR-RP03 | Giá trị tồn = qty × costPrice |
| BR-RP04 | Export giới hạn max rows (vd 10_000) tránh OOM |
| BR-RP05 | Không cache phức tạp MVP |

## 9. Validation

type enum, dateFrom/dateTo optional ISO date, warehouseId optional, format excel|pdf

## 10. Exception

400 filter sai · 403 · 404 loại không hỗ trợ · 500 generate file fail

## 11. Permission

| Action | Permission |
|--------|------------|
| Xem báo cáo | report:read |
| Export | report:export |

## 12. Database

Không bảng mới. Query từ bảng hiện có (+ ST/SA sau khi có).

## 13. API

Xem [api.md](./api.md)

## 14. Frontend

- Page tabs hoặc select loại báo cáo
- Filter bar + Table
- Nút Export Excel / PDF (download blob)
- Loading/Empty/Error

## 15. Backend

```
modules/report/
  report.route|controller|service
  exporters/excel.exporter.js
  exporters/pdf.exporter.js
  queries/*.js
```

Libs: `exceljs`, `pdfkit` (thêm dependency khi code).

## 16. AC

- Mỗi loại báo cáo trả đúng cột
- Filter ngày/kho hoạt động
- File Excel/PDF tải được

## 17. Testing

Unit: query builders, value calc  
Integration: each report 200/400/401/403  
FE: filter schema

## 18–23. Docs / Guides

Triển khai sau Stock Take & Adjustment để đủ dữ liệu kiểm kê/điều chỉnh.
