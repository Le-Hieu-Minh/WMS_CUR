# Goods Receipt – Developer Guide

## Overview

Ghi chú triển khai và mở rộng module Goods Receipt cho developer backend/frontend.

## Purpose

Onboarding nhanh, pattern tái sử dụng cho goods-issue và các chứng từ khác.

## Scope

Local dev, test, debug confirm/inventory. Không cover deploy infra.

## Workflow

### Chạy local

```bash
# Backend
cd backend && npm run dev

# Frontend
cd frontend && npm run dev
```

### Test validation

```bash
cd backend && npm test -- goodsReceipt.validation
cd frontend && npm test -- goodsReceiptSchema
```

## Business Rules

Khi sửa code, **không** phá vỡ:

1. Confirm-only inventory mutation.
2. assertDraft trên update/delete/cancel/confirm.
3. Transaction bọc confirm.

## Technical Design

### Document pattern (template)

```text
DRAFT create → optional update → confirm (tx + stock) | cancel | delete
Code: PREFIX-YYYYMMDD-SEQ
Items: replace-all on update
Permissions: read | create | update | delete
```

Goods Issue mirror pattern với `decreaseStock` và check đủ tồn.

### File map

```text
backend/src/modules/goods-receipt/
  goodsReceipt.route.js
  goodsReceipt.controller.js
  goodsReceipt.service.js      ← business logic chính
  goodsReceipt.repository.js
  goodsReceipt.validation.js

frontend/src/features/goods-receipts/
  pages/GoodsReceiptsPage.jsx
  api/goodsReceiptApi.js
  schemas/goodsReceiptSchema.js
```

### Thêm field mới (ví dụ: referenceNo)

1. Prisma migration → `goods_receipts`
2. Zod create/update schema
3. Service create/update map
4. Repository create/update
5. FE schema + form field
6. Docs api + database

### Debug confirm không cộng tồn

- Kiểm tra transaction rollback (lỗi giữa chừng).
- Query: `SELECT * FROM inventories WHERE warehouse_id = ? AND product_id = ?`
- Log Prisma trong dev nếu cần.

## API / Database (nếu có)

Mount route trong app (thường `app.js` / routes index). Permission seed trong role Admin.

## Validation

BE và FE schema nên đồng bộ. BE là source of truth (UUID format, max length).

## Security

Seed permissions: `goods-receipt:read`, `create`, `update`, `delete`. Gán vào role Warehouse Staff / Manager.

## Error Handling

Dùng `ApiError` — không throw raw Error ra client.

Integration test gợi ý: create → confirm → assert inventory quantity.

## Examples

**Gọi API thủ công (curl):**

```bash
curl -X POST http://localhost:3000/api/v1/goods-receipts \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"warehouseId":"...","receiptDate":"2026-08-07","items":[{"productId":"...","quantity":1}]}'
```

## Design Decisions

| Topic | Chi tiết |
|-------|----------|
| inventoryRepository shared | goods-receipt, goods-issue, stock-* dùng chung |
| Audit after commit | Action `GOODS_RECEIPT_CONFIRM` |
| No movement table | Reconstruct history từ documents |

## Notes

- Decimal Prisma → Number khi JSON response.
- `countByCodePrefix` race: MVP chấp nhận; production có thể cần advisory lock.
- Future: reverse confirm → cần goods-issue hoặc stock-adjustment IN.

## Checklist (dev)

- [ ] Prisma schema sync
- [ ] Zod BE + FE aligned
- [ ] Permission trong seed
- [ ] Unit tests pass
- [ ] Manual confirm → inventory verified
- [ ] Docs updated
