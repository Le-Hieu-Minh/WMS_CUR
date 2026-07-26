# Stock Take – API

Base: `/api/v1/stock-takes`

| Method | Endpoint | Permission |
|--------|----------|------------|
| GET | `/` | stock-take:read |
| GET | `/:id` | stock-take:read |
| GET | `/meta/products?warehouseId=` | stock-take:create/update |
| POST | `/` | stock-take:create |
| PUT | `/:id` | stock-take:update |
| POST | `/:id/confirm` | stock-take:update |
| POST | `/:id/cancel` | stock-take:update |
| DELETE | `/:id` | stock-take:delete |

## Create / Update body

```json
{
  "warehouseId": "uuid",
  "takeDate": "2026-07-26",
  "note": "Kiểm kê cuối tháng",
  "items": [
    { "productId": "uuid", "countedQty": 10, "note": null }
  ]
}
```

Server tự điền `systemQty` từ inventory (0 nếu chưa có dòng tồn).

## Response item

```json
{
  "productId": "...",
  "systemQty": 12,
  "countedQty": 10,
  "variance": -2
}
```
