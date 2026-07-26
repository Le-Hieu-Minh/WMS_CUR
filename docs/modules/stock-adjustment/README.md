# Module Stock Adjustment (Điều chỉnh tồn)

| Thuộc tính | Giá trị |
|------------|---------|
| Sprint | 3 – Module 2 |
| Trạng thái | ✅ Đã triển khai |
| Base path | `/api/v1/stock-adjustments` |
| FE route | `/stock-adjustments` |
| Code | `SA-YYYYMMDD-XXXX` |

## Quyết định chính

| Hạng mục | Quyết định |
|----------|------------|
| Status | DRAFT → CONFIRMED / CANCELLED |
| Direction | `INCREASE` \| `DECREASE` per item (hoặc phiếu) |
| MVP | **per item** có `type` + `quantity` > 0 |
| Reason | Bắt buộc ở header (hư hỏng, mất mát, sai sót…) |
| Confirm INCREASE | `increaseStock` |
| Confirm DECREASE | `decreaseStock` (fail nếu thiếu) |
| Không âm kho | Bắt buộc |

Xem: [analysis.md](./analysis.md) · [api.md](./api.md) · [database.md](./database.md)
