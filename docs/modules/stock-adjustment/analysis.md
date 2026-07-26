# Stock Adjustment – Phân tích 23 mục

## 1. Giới thiệu

Điều chỉnh tồn kho khi có sai lệch, hư hỏng, mất mát, hàng tìm lại — không đi qua phiếu nhập/xuất thông thường.

## 2. Mục tiêu

- Tạo phiếu điều chỉnh có lý do rõ ràng
- Tăng/giảm tồn theo dòng hàng khi Confirm
- Lịch sử phục vụ báo cáo

## 3. Nghiệp vụ

Khác Stock Take: không snapshot toàn bộ kho; điều chỉnh có chủ đích từng SP với lý do.

## 4. User Story

| ID | Story | P |
|----|-------|---|
| SA-01 | Tạo phiếu điều chỉnh + lý do | Must |
| SA-02 | Thêm dòng tăng/giảm | Must |
| SA-03 | Confirm cập nhật tồn | Must |
| SA-04 | Không giảm quá tồn hiện có | Must |
| SA-05 | Hủy/xóa nháp | Must |

## 5–7. Use Case / Flow

Tương tự GR/GI: Draft → Confirm (transaction apply +/-) → Done.

## 8. Business Rules

| ID | Rule |
|----|------|
| BR-SA01 | reason bắt buộc (min 3 ký tự) |
| BR-SA02 | quantity > 0; type INCREASE\|DECREASE |
| BR-SA03 | Không trùng product |
| BR-SA04 | DECREASE không vượt tồn |
| BR-SA05 | Confirm transaction |
| BR-SA06 | CONFIRMED immutable |

## 9. Validation

warehouseId, adjustDate, reason, items[{productId, type, quantity, note?}]

## 10. Exception

409 thiếu tồn khi confirm · 409 không DRAFT · 400 validation · 404

## 11. Permission

`stock-adjustment:read|create|update|delete` (confirm dùng update)

## 12–13. DB / API

Xem database.md, api.md

## 14. Frontend

List + Dialog form (reason textarea, items type select, qty) + Confirm/Cancel/Delete

## 15. Backend

`modules/stock-adjustment/*` · reuse inventory increase/decrease

## 16. AC

- Increase confirm → tồn tăng
- Decrease vượt tồn → 409
- Reason bắt buộc

## 17. Testing

Unit service apply; Integration confirm cases; FE schema

## 18–23. Docs / Guides

Theo cấu trúc module; triển khai sau Stock Take.
