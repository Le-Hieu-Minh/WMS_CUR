# Product – Developer Guide

## Overview

Guide kỹ thuật mở rộng module product, đồng bộ BE/FE và tích hợp phiếu kho.

## Purpose

Checklist thay đổi an toàn trên catalog sản phẩm.

## Scope

product module BE/FE + consumers (goods-receipt, goods-issue, inventory, stock-take, stock-adjustment).

## Workflow

### Extend field

Prisma → migrate → product.validation.js → service create/update → productSchema → ProductsPage fields/columns.

### Test locally

Dev servers → user with product:* → CRUD on /products → verify GET returns number prices.

## Business Rules

Giữ PR-BR-01, PR-BR-05. Consumers must check product.status === ACTIVE.

## Technical Design

**mapProduct:** always apply on list/getById/create/update responses.

**Dropdown products:** `GET /products?status=ACTIVE&limit=100`

**statsApi.getCounts:** uses products list pagination.total

## API / Database

[api.md](./api.md) · [database.md](./database.md)

## Validation

Sync BE max lengths with FE. imageUrl BE-only until FE field added.

## Security

Seed permissions product:* in role module.

## Error Handling

409 duplicate code — check case-insensitive after normalize.

## Examples

Add column FE:
```javascript
{ key: 'minStock', label: 'Tồn TT' }
```

Consumer validation pattern in goodsReceipt.service.js.

## Design Decisions

| Item | Note |
|------|------|
| Decimal in DB | Don't skip mapProduct |
| Category as string | Future: FK to categories table |
| No warehouse-specific minStock | Per-product only |

## Notes

Reference warehouse developer-guide for same master-data pattern.

## Checklist

- [ ] migrate after schema change
- [ ] mapProduct on new Decimal fields
- [ ] Update validation BE+FE
- [ ] Test phiếu rejects INACTIVE product
- [ ] Update api.md/database.md
