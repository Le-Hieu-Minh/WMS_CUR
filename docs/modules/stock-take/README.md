# Module Stock Take (Kiểm kê)

| Thuộc tính | Giá trị |
|------------|---------|
| Sprint | 3 – Module 1 |
| Trạng thái | ✅ Đã triển khai |
| Base path | `/api/v1/stock-takes` |
| FE route | `/stock-takes` |
| Code | `ST-YYYYMMDD-XXXX` |

## Quyết định chính

| Hạng mục | Quyết định |
|----------|------------|
| Status | DRAFT → CONFIRMED / CANCELLED |
| Snapshot | Khi tạo/cập nhật nháp: lưu `systemQty` từ tồn hiện tại |
| Variance | `countedQty - systemQty` |
| Confirm | Set tồn = `countedQty` (tuyệt đối), không cộng dồn |
| Scope | Theo 1 warehouse; items = các SP chọn (hoặc load toàn bộ tồn kho đó) |
| Sửa/xóa | Chỉ DRAFT |

Xem: [analysis.md](./analysis.md) · [api.md](./api.md) · [database.md](./database.md)
