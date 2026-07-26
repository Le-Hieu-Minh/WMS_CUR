# Sprint 3 – Control & Reporting

## Mục tiêu Sprint

Hoàn thiện kiểm soát tồn kho, báo cáo xuất file, nhật ký hoạt động và chuẩn bị deploy.

**Trạng thái:** Stock Take / Stock Adjustment / Audit Log / Report đã code. **Deploy để lại sau.**

## Thứ tự triển khai khuyến nghị

| # | Module | Lý do |
|---|--------|--------|
| 1 | **Stock Take** | Kiểm kê → chuẩn hóa tồn thực tế |
| 2 | **Stock Adjustment** | Điều chỉnh lệch / hư hỏng / mất mát |
| 3 | **Audit Log** | Ghi nhận thao tác nhạy cảm (có thể gắn dần vào ST/SA/Auth/GR/GI) |
| 4 | **Report** | Báo cáo + Excel/PDF (phụ thuộc dữ liệu ST/SA) |
| 5 | **Docs / Test / Deploy** | Hoàn thiện DoD, test E2E, hướng dẫn deploy |

## Ngoài phạm vi (giữ nguyên Master Prompt)

Workflow Approval, Batch/Lot/Serial, Barcode, Multi-company, Realtime, AI.

## Giả định chung

1. Tồn kho vẫn dùng bảng `inventories` (warehouse + product).
2. Chứng từ kiểm kê/điều chỉnh theo pattern DRAFT → CONFIRMED / CANCELLED như GR/GI.
3. Chỉ **Confirm** mới thay đổi tồn kho (transaction).
4. Không cho hủy/sửa phiếu đã CONFIRMED trong MVP (tránh reverse phức tạp).
5. Staff: chủ yếu `:read`; Manager/Admin: đủ quyền nghiệp vụ.

## Permissions sẽ bổ sung

```
stock-take:read|create|update|delete
stock-adjustment:read|create|update|delete
report:read|export
audit-log:read
```

## Tài liệu module

- [Stock Take](../modules/stock-take/README.md)
- [Stock Adjustment](../modules/stock-adjustment/README.md)
- [Report](../modules/report/README.md)
- [Audit Log](../modules/audit-log/README.md)
