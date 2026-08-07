# Inventory – Backend

## Overview

Backend inventory: **public read API** + **shared repository mutations** cho module chứng từ.

## Purpose

Tách read service và write helpers.

## Scope

| Public | Internal |
|--------|----------|
| GET /inventories | increaseStock, decreaseStock, setStock |

## Workflow

### list(query)

1. parsePagination (default sortBy `updatedAt`)
2. Build where: warehouseId, productId, search OR
3. If `lowStock`: findMany all matching → filter isLowStock → slice page
4. Else: repository findMany + count
5. mapInventory → add minStock, isLowStock, stockValue

### decreaseStock (internal)

```text
find unique (warehouse, product)
if !existing OR current < qty → { ok: false, available }
else decrement → { ok: true }
```

## Business Rules

Implemented in repository + callers (goods-issue checks ok flag).

## Technical Design

| File | Exposed |
|------|---------|
| inventory.route.js | GET only |
| inventory.service.js | list |
| inventory.repository.js | all DB ops |
| inventory.controller.js | list handler |
| inventory.validation.js | listInventorySchema |

**Importers of repository:**

- goodsReceipt.service.js
- goodsIssue.service.js
- stockTake.service.js
- stockAdjustment.service.js

## API / Database (nếu có)

[api.md](./api.md) · [database.md](./database.md)

## Validation

Zod query only.

## Security

Write methods không mount route — chỉ import nội bộ backend.

## Error Handling

list: standard error middleware.

## Examples

```javascript
await inventoryRepository.increaseStock(whId, prodId, 10, tx);
```

## Design Decisions

lowStock in-memory filter — refactor candidate: raw SQL `quantity <= products.min_stock`.

## Notes

Decimal → Number in mapInventory.

## Checklist

- [x] GET list works
- [x] Repository shared
- [x] lowStock documented trade-off
- [ ] SQL lowStock optimization
