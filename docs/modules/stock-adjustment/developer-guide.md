# Stock Adjustment – Hướng dẫn developer

## Overview

Onboard và mở rộng module Stock Adjustment.

## Purpose

Patterns an toàn khi sửa confirm hoặc thêm validation tồn.

## Scope

`backend/src/modules/stock-adjustment/`, `frontend/src/features/stock-adjustments/`.

## Workflow

Change → validation test → manual confirm → inventory verify.

## Business Rules

Never skip decreaseStock ok check. Keep transaction boundary on confirm.

## Technical Design

### Extend with approval status

Would require new enum/state — out of MVP; plan migration separately.

### Add warehouse stock preview API

Optional GET for FE: join inventory quantity before DECREASE UX.

### Tests

```bash
cd backend && npm test -- stockAdjustment
cd frontend && npm test -- stockAdjustmentSchema
```

## API / Database

Permissions seed: `stock-adjustment:*`. Route mount `/stock-adjustments`.

## Validation

Sync FE/BE on reason length and quantity positive.

## Security

New actions need role seed + FE gates.

## Error Handling

Preserve Vietnamese messages for 409 insufficient stock.

## Examples

Add `sortBy: reason` — extend list schema + repository orderBy whitelist.

## Design Decisions

Follow stock-take file layout for consistency.

## Notes

Report handler: `getStockAdjustmentsReport` in report.service.js.

## Checklist

- [ ] Tests green
- [ ] Confirm DECREASE edge case manual
- [ ] Update docs/api if contract changes
