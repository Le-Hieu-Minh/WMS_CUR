# Goods Issue – Backend

## Overview

Backend goods-issue: Route → Controller → Service → Repository.

## Purpose

API xuất kho với transaction confirm và chặn âm kho.

## Scope

Module `backend/src/modules/goods-issue/`.

## Workflow

### confirm(id)

```text
prisma.$transaction:
  assertDraft
  FOR item IN items:
    decreaseStock → if !ok throw 409
  updateStatus CONFIRMED
auditService.log(GOODS_ISSUE_CONFIRM)
```

### decreaseStock logic

| Case | Result |
|------|--------|
| No inventory row | ok: false, available: 0 |
| qty < decrease | ok: false, available: current |
| qty >= decrease | ok: true, decrement |

## Business Rules

Service mirrors goods-receipt + stock check.

## Technical Design

| File | Notes |
|------|-------|
| goodsIssue.service.js | mapIssue, validateReferences |
| goodsIssue.repository.js | updateDraft deleteMany+create |
| goodsIssue.validation.js | issueBodySchema |

Code prefix: `GI-YYYYMMDD-`.

## API / Database (nếu có)

[api.md](./api.md) · [database.md](./database.md)

## Validation

Zod + service normalizeItems unique productId.

## Security

`authenticate` + `authorize('goods-issue:...')`.

## Error Handling

```javascript
throw new ApiError(HttpStatus.CONFLICT,
  `Không đủ tồn kho cho sản phẩm ${code}. Hiện có: ${available}`);
```

## Examples

Tests: `__tests__/goodsIssue.validation.test.js`.

## Design Decisions

Check stock inside transaction — giảm race window (không loại trừ hoàn toàn concurrent confirm).

## Notes

Shared `inventoryRepository` với goods-receipt, stock-adjustment, stock-take.

## Checklist

- [x] decreaseStock integration
- [x] Validation tests
- [ ] Integration test insufficient stock
