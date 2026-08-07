# Stock Take – Backend

## Overview

Triển khai server-side module kiểm kê: route → controller → service → repository, tích hợp inventory và audit.

## Purpose

Mô tả kiến trúc backend, điểm mở rộng và luồng transaction khi confirm.

## Scope

Files trong `backend/src/modules/stock-take/`. Không bao gồm inventory module (dependency).

## Workflow

```
Route → Controller (asyncHandler) → stockTakeService → stockTakeRepository / inventoryRepository
```

Confirm path: transaction → assertDraft → loop setStock → updateStatus → auditService.log (ngoài tx).

## Business Rules

Implement trong service: `buildItemsWithSnapshot`, `assertDraft`, `generateCode`, `mapItem` (variance).

## Technical Design

| File | Vai trò |
|------|---------|
| stockTake.route.js | Mount routes + swagger tag |
| stockTake.controller.js | HTTP mapping |
| stockTake.service.js | Business logic |
| stockTake.repository.js | Prisma queries |
| stockTake.validation.js | Zod schemas |

**Dependencies:** `inventoryRepository`, `auditService`, `prisma.$transaction`.

**updateDraft:** deleteMany items + create mới (atomic trong tx).

## API / Database

Prisma models `StockTake`, `StockTakeItem`. Repository `detailInclude` / `listInclude` cho warehouse, user, product.

## Validation

Zod at route; service throws `ApiError` với message tiếng Việt.

## Security

`router.use(authenticate)` global. `authorize()` per route.

## Error Handling

`ApiError` + `HttpStatus`: NOT_FOUND, CONFLICT, BAD_REQUEST. Controller qua `asyncHandler`.

## Examples

```javascript
// Confirm loop (conceptual)
for (const item of doc.items) {
  await inventoryRepository.setStock(doc.warehouseId, item.productId, item.countedQty, tx);
}
```

## Design Decisions

| Quyết định | Lý do |
|------------|-------|
| Audit sau transaction | Không rollback nghiệp vụ nếu audit fail |
| Code prefix theo ngày | Dễ tra cứu theo batch kiểm kê |
| Controller mỏng | Logic tập trung service |

## Notes

Unit test: `__tests__/stockTake.validation.test.js`. Integration có thể mock prisma hoặc DB test.

## Checklist

- [x] Service confirm + snapshot
- [x] Repository includes
- [x] Validation tests
- [ ] Integration test confirm → inventory
- [ ] Swagger examples đầy đủ
