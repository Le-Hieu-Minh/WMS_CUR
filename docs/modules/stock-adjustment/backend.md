# Stock Adjustment – Backend

## Overview

Server module điều chỉnh tồn trong `backend/src/modules/stock-adjustment/`.

## Purpose

Document service confirm logic và integration inventory + audit.

## Scope

route, controller, service, repository, validation, tests.

## Workflow

confirm → transaction → for each item: INCREASE → increaseStock; DECREASE → decreaseStock (check ok) → updateStatus → audit log.

## Business Rules

`decreaseStock` returns `{ ok: false, available }` → ApiError 409. Full rollback on any failure.

## Technical Design

| Function | Role |
|----------|------|
| validateItems | Master data + dedupe products |
| assertDraft | Status guard |
| generateCode | SA-YYYYMMDD-#### |
| mapDoc / mapItem | API shaping |

Repository `updateDraft`: deleteMany items + recreate.

## API / Database

Prisma StockAdjustment, StockAdjustmentItem. Uses inventoryRepository increase/decrease.

## Validation

Zod bodySchema; service trim reason.

## Security

authenticate + authorize on all routes.

## Error Handling

ApiError NOT_FOUND, CONFLICT, BAD_REQUEST.

## Examples

Mixed items in one confirm — atomic transaction.

## Design Decisions

Stock check only at confirm — allow drafting DECREASE even if stock later changes (re-validate at confirm).

## Notes

Audit: action `STOCK_ADJUSTMENT_CONFIRM`, module `stock-adjustment`.

Test: `__tests__/stockAdjustment.validation.test.js`.

## Checklist

- [x] Confirm transaction
- [x] DECREASE guard
- [ ] Integration test mixed INCREASE/DECREASE
- [ ] Swagger tag
