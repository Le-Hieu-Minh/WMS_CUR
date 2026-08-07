# Goods Receipt – Backend

## Overview

Backend module xử lý nghiệp vụ phiếu nhập kho theo kiến trúc **Route → Controller → Service → Repository**.

## Purpose

Cung cấp API an toàn, transaction khi confirm, và tích hợp inventory + audit.

## Scope

| Layer | File |
|-------|------|
| Route | `goodsReceipt.route.js` |
| Controller | `goodsReceipt.controller.js` |
| Service | `goodsReceipt.service.js` |
| Repository | `goodsReceipt.repository.js` |
| Validation | `goodsReceipt.validation.js` |
| Tests | `__tests__/goodsReceipt.validation.test.js` |

## Workflow

### Service methods

| Method | Mô tả |
|--------|-------|
| list | Pagination + filter |
| getById | Detail + items |
| create | Validate refs → generate code → DRAFT |
| update | assertDraft → replace items (transaction) |
| confirm | Transaction: increaseStock × N → CONFIRMED → audit |
| cancel | assertDraft → CANCELLED |
| remove | assertDraft → delete |

### Confirm transaction

```text
BEGIN
  findById (lock implicit via tx)
  assertDraft
  FOR each item: increaseStock(warehouseId, productId, quantity)
  updateStatus CONFIRMED + confirmedBy/At
COMMIT
→ auditService.log(GOODS_RECEIPT_CONFIRM)
```

## Business Rules

Implement trong `goodsReceipt.service.js`:

- `assertDraft` — 404 / 409
- `validateReferences` — kho, NCC, SP
- `normalizeItems` — unique productId
- `generateCode` — prefix GR-YYYYMMDD-

## Technical Design

### Repository highlights

| Method | Ghi chú |
|--------|---------|
| updateDraft | deleteMany items → update header → create items |
| countByCodePrefix | Đếm mã cùng ngày cho sequence |
| findById | detailInclude: warehouse, supplier, users, items+product |

### Dependencies

| Module | Usage |
|--------|-------|
| inventory | `inventoryRepository.increaseStock` |
| audit-log | Log sau confirm |
| prisma | `$transaction` |

### Mapping

Service map Prisma → API camelCase (`mapReceipt`, `mapItem`); Decimal → Number.

## API / Database (nếu có)

- Routes mount tại app router: `/api/v1/goods-receipts`
- Tables: [database.md](./database.md)

## Validation

Middleware `validate(schema)` trước controller. Business validation trong service sau Zod.

## Security

```javascript
router.use(authenticate);
router.get('/', authorize('goods-receipt:read'), ...);
```

## Error Handling

`ApiError` với HttpStatus: BAD_REQUEST, NOT_FOUND, CONFLICT.

| Function | Throws |
|----------|--------|
| assertDraft | 404, 409 |
| validateReferences | 400 |
| parseReceiptDate | 400 |

## Examples

**generateCode:** `GR-20260807-0001` (count prefix + 1, pad 4).

**increaseStock:** upsert inventory nếu chưa có row (warehouse+product).

## Design Decisions

| Quyết định | Lý do |
|------------|-------|
| Audit ngoài transaction | Tránh rollback audit nếu log fail |
| Service owns code generation | Atomic với DB count |
| Repository nhận optional `tx` | Dùng chung trong transaction |

## Notes

- Controller mỏng: parse req → gọi service → send response.
- List không include full items (chỉ `_count.items`).

## Checklist

- [x] Layer separation
- [x] Transaction confirm
- [x] Validation tests
- [ ] Integration test confirm + inventory
- [ ] Concurrent confirm stress test
