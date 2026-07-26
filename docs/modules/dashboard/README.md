# Module Dashboard

| Thuộc tính | Giá trị |
|------------|---------|
| Sprint | 2 – Module 4 |
| Trạng thái | ✅ Đã triển khai |
| Base path | `/api/v1/dashboard` |
| FE route | `/` |

## API

`GET /dashboard/overview` — permission `dashboard:read`

## Dữ liệu trả về

- **summary:** totalProducts, totalWarehouses, totalStockQty, totalStockValue, receiptsToday, issuesToday
- **lowStock:** hàng sắp hết (top 10)
- **topReceived / topIssued:** top 5 sản phẩm
- **monthlyChart:** nhập/xuất 12 tháng

## UI

- KPI cards
- Bar chart (Recharts)
- Bảng top nhập/xuất
- Bảng hàng sắp hết
