# Stock Adjustment – API

Base: `/api/v1/stock-adjustments`

| Method | Endpoint | Permission |
|--------|----------|------------|
| GET | `/` | stock-adjustment:read |
| GET | `/:id` | stock-adjustment:read |
| POST | `/` | stock-adjustment:create |
| PUT | `/:id` | stock-adjustment:update |
| POST | `/:id/confirm` | stock-adjustment:update |
| POST | `/:id/cancel` | stock-adjustment:update |
| DELETE | `/:id` | stock-adjustment:delete |

## Body

```json
{
  "warehouseId": "uuid",
  "adjustDate": "2026-07-26",
  "reason": "Hàng hư hỏng",
  "note": null,
  "items": [
    { "productId": "uuid", "type": "DECREASE", "quantity": 2, "note": "Rách bao" }
  ]
}
```
