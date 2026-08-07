# Supplier – Frontend

## Overview

UI NCC tại `/suppliers` — SuppliersPage + MasterDataListPage + supplierApi/supplierSchema.

## Purpose

Document UI config và UX cho module supplier.

## Scope

SuppliersPage only. Receipt supplier picker: goods-receipt module.

## Workflow

Same as warehouse master data list pattern.

## Business Rules

Delete button ACTIVE only · permissions supplier:* · empty strings → null

## Technical Design

| File | Content |
|------|---------|
| `features/suppliers/pages/SuppliersPage.jsx` | Page |
| Fields | code, name, contactPerson, phone, email, address, notes |
| Columns | code, name, contactPerson, phone |

## API / Database

[api.md](./api.md) · [database.md](./database.md) · client: supplierApi

## Validation

supplierSchema — code/name required; email optional or empty.

## Security

usePermissions supplier:create/update/delete

## Error Handling

Standard MasterDataListPage error display.

## Examples

Placeholder code SUP-001, name Công ty ABC.

## Design Decisions

Shared component with CustomersPage — differ only labels/placeholders.

## Notes

Cross-ref [customer/frontend.md](../customer/frontend.md) for identical behavior.

## Checklist

- [x] Fields match SuppliersPage.jsx
- [x] Cross-ref customer
