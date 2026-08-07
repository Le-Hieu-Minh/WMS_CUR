# Goods Issue – Developer Guide

## Overview

Hướng dẫn dev mở rộng module Goods Issue.

## Purpose

Pattern document + debug insufficient stock.

## Scope

Local dev, tests, extension points.

## Workflow

```bash
cd backend && npm test -- goodsIssue.validation
cd frontend && npm test -- goodsIssueSchema
```

## Business Rules

**Không bỏ** check `decreaseStock` trong confirm transaction.

## Technical Design

### Diff vs goods-receipt

| Aspect | Receipt | Issue |
|--------|---------|-------|
| Prefix | GR- | GI- |
| Partner | supplier | customer |
| Line price | unitCost | unitPrice |
| Confirm | increaseStock | decreaseStock |
| Fail case | — | insufficient stock 409 |

### Copy pattern checklist

Khi thêm module chứng từ mới: route, validation, service (assertDraft, generateCode), repository (updateDraft), FE page clone.

## API / Database (nếu có)

Seed permissions `goods-issue:read|create|update|delete`.

## Validation

Keep BE/FE schemas aligned.

## Security

Same middleware stack as goods-receipt.

## Error Handling

Integration test scenario:

1. Seed inventory qty 5
2. Create issue qty 10 DRAFT → OK
3. Confirm → 409
4. Assert inventory still 5

## Examples

Manual API confirm after receipt confirm to verify flow.

## Design Decisions

No stock reservation table — future enhancement if needed.

## Notes

Concurrent confirms on same SKU may race; consider SELECT FOR UPDATE if scaling.

## Checklist

- [ ] Permissions seeded
- [ ] Tests pass
- [ ] Docs synced with goods-receipt pattern
- [ ] Manual insufficient stock verified
