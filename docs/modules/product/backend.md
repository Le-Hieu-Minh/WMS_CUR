# Product – Backend

## Overview

Backend module product — layered CRUD với xử lý Decimal, filter category và search mở rộng.

## Purpose

Hướng dẫn developer vị trí logic nghiệp vụ và điểm tích hợp với phiếu kho.

## Scope

`backend/src/modules/product/*`

## Workflow

Request → auth → validate → controller → service (mapProduct, assertCodeUnique) → repository → Prisma.

## Business Rules

| Function | Logic |
|----------|-------|
| mapProduct | price, costPrice → Number |
| normalizeCode | UPPERCASE |
| buildWhere | search OR code/name/category; category equals |
| create defaults | unit pcs, prices 0, minStock 0, ACTIVE |
| softDelete | INACTIVE |

## Technical Design

Mount: `/products` in routes/index.js

Pagination default sort createdAt desc; sortBy includes price.

## API / Database

[api.md](./api.md) · [database.md](./database.md)

## Validation

product.validation.js — imageUrl z.string().url() on create/update.

## Security

product:read|create|update|delete on routes.

## Error Handling

ApiError 404/409; asyncHandler in controller.

## Examples

Module goods-receipt loads products by ids — rejects if count mismatch or INACTIVE.

## Design Decisions

| Decision | Trade-off |
|----------|-----------|
| mapProduct on read | Consistent JSON numbers |
| Partial PUT | Flexible updates |
| No audit log | Simpler master data |

## Notes

Prisma returns Decimal objects — always map before JSON response.

## Checklist

- [x] Layer map documented
- [x] Decimal handling noted
- [ ] product.service unit tests
