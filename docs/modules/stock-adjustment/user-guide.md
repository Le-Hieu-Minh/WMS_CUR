# Stock Adjustment – Hướng dẫn người dùng

## Overview

Hướng dẫn lập và xác nhận phiếu **Điều chỉnh tồn** trên WMS.

## Purpose

Giúp user chọn đúng loại điều chỉnh và tránh lỗi không đủ tồn khi giảm.

## Scope

Menu **Điều chỉnh tồn** (`/stock-adjustments`).

## Workflow

1. **Tạo phiếu** → chọn kho, ngày điều chỉnh.
2. Nhập **Lý do** (bắt buộc, ví dụ: "Vỡ bao bì").
3. Thêm dòng: sản phẩm, **Loại** (Tăng/Giảm), **Số lượng**.
4. **Lưu** (Nháp).
5. **Xác nhận** → hệ thống cập nhật tồn.

## Business Rules

| Loại | Ý nghĩa | Lưu ý |
|------|---------|-------|
| Tăng (INCREASE) | Cộng thêm vào tồn | SP chưa có tồn vẫn tạo được |
| Giảm (DECREASE) | Trừ khỏi tồn | Không trừ quá tồn hiện có |

Không sửa phiếu đã xác nhận. Kiểm kê định kỳ nên dùng **Kiểm kê**, không dùng điều chỉnh.

## Technical Design

N/A cho end-user.

## API / Database

N/A.

## Validation

Lý do tối thiểu 3 ký tự. Số lượng phải > 0. Mỗi sản phẩm một dòng.

## Security

Cần quyền tạo/sửa/xác nhận tùy thao tác.

## Error Handling

"Không đủ tồn kho" — giảm số lượng hoặc kiểm tra tồn thực tế trước.

## Examples

Hư 3 cái SP001 → DECREASE 3, lý do "Hư hỏng kho".

## Design Decisions

Bắt buộc lý do — phục vụ kiểm tra nội bộ.

## Notes

Sau xác nhận xem **Báo cáo → Điều chỉnh** hoặc **Nhật ký hoạt động**.

## Checklist

- [ ] Training DECREASE vs INCREASE
- [ ] Quy trình phê duyệt nội bộ (ngoài hệ thống)
