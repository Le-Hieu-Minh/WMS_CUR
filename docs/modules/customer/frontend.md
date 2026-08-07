# Customer – Frontend

## Overview

UI khách hàng `/customers` — CustomersPage configures MasterDataListPage.

## Purpose

Frontend structure and UX for customer module.

## Scope

CustomersPage. Customer picker on goods-issue: separate module.

## Workflow

List → search/filter → dialog CRUD → confirm soft delete.

## Business Rules

Delete ACTIVE only · customer:* permissions · CUS-001 placeholder

## Technical Design

| Item | Value |
|------|-------|
| Page | `features/customers/pages/CustomersPage.jsx` |
| API | customerApi |
| Schema | customerSchema |
| Fields | code, name, contactPerson, phone, email, address, notes |
| Columns | code, name, contactPerson, phone |

## API / Database

[api.md](./api.md) · [database.md](./database.md)

## Validation

customerSchema — same rules as supplierSchema

## Security

usePermissions

## Error Handling

MasterDataListPage standard

## Examples

CUS-001 / Công ty Alpha

## Design Decisions

Identical to [supplier/frontend.md](../supplier/frontend.md) with KH labels.

## Notes

queryKey `customers`

## Checklist

- [x] Match CustomersPage.jsx
- [x] Cross-ref supplier
