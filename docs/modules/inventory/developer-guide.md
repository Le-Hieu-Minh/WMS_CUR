# Inventory – Developer Guide

## Overview

Dev guide cho module Inventory — read API và internal stock mutations.

## Purpose

Hướng dẫn tích hợp module mới cần thay đổi tồn.

## Scope

Backend patterns; không seed tồn ban đầu.

## Workflow

### Thêm module ghi tồn mới

1. Import `inventoryRepository` trong service confirm.
2. Dùng method phù hợp trong `prisma.$transaction`.
3. **Không** thêm route POST inventories.
4. Cập nhật docs module đó + inventory analysis.

### Chọn method

| Nghiệp vụ | Method |
|-----------|--------|
| Nhập / điều chỉnh tăng | increaseStock |
| Xuất / điều chỉnh giảm | decreaseStock (check ok) |
| Kiểm kê chốt số | setStock |

## Business Rules

Always mutate inside document confirm transaction.

## Technical Design

```javascript
import { inventoryRepository } from '../inventory/inventory.repository.js';

// In confirm:
await inventoryRepository.decreaseStock(wh, prod, qty, tx);
```

### lowStock performance

Current: O(n) load all when filter on. Fix path:

```sql
WHERE i.quantity <= p.min_stock
```

via `$queryRaw` or Prisma relation filter if upgraded.

## API / Database (nếu có)

Only extend GET if new computed fields needed (e.g. reservedQty future).

## Validation

If adding query params, update `listInventorySchema`.

## Security

Never export write endpoints without document workflow.

## Error Handling

Test decreaseStock edge: no row, exact qty, insufficient.

## Examples

```bash
curl -H "Authorization: Bearer $T" \
  "http://localhost:3000/api/v1/inventories?lowStock=true"
```

## Design Decisions

Central repository prevents duplicate stock logic.

## Notes

Dashboard reads inventories directly via prisma in dashboard.service — not via inventory API.

## Checklist

- [ ] New writers use repository
- [ ] Transaction wrapped
- [ ] Docs updated
- [ ] No public write route
