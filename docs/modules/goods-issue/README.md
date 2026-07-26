# Module Goods Issue (Xuất kho)

| Thuộc tính | Giá trị |
|------------|---------|
| Sprint | 2 – Module 2 |
| Trạng thái | ✅ Đã triển khai |
| Base path | `/api/v1/goods-issues` |
| FE route | `/goods-issues` |

## Quyết định

| Hạng mục | Nội dung |
|----------|----------|
| Status | DRAFT → CONFIRMED / CANCELLED |
| Confirm | Trừ tồn kho (fail nếu không đủ) |
| Customer | Optional |
| Code | `GI-YYYYMMDD-XXXX` |

## Permissions

`goods-issue:read|create|update|delete`
