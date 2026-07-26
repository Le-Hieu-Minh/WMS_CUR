# Goods Receipt – API

Base: `/api/v1/goods-receipts`

| Method | Endpoint | Permission |
|--------|----------|------------|
| GET | `/` | goods-receipt:read |
| GET | `/:id` | goods-receipt:read |
| POST | `/` | goods-receipt:create |
| PUT | `/:id` | goods-receipt:update |
| POST | `/:id/confirm` | goods-receipt:update |
| POST | `/:id/cancel` | goods-receipt:update |
| DELETE | `/:id` | goods-receipt:delete |

## Create / Update body

```json
{
  "warehouseId": "uuid",
  "supplierId": "uuid|null",
  "receiptDate": "2026-07-23",
  "note": "string",
  "items": [
    { "productId": "uuid", "quantity": 10, "unitCost": 1000, "note": null }
  ]
}
```

Confirm tăng tồn kho theo từng dòng trong transaction.
