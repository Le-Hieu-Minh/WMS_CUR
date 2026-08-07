# Customer – Backend

## Overview

Backend customer module — layered master data, consumed by goods-issue.

## Purpose

Developer map of customer code and integration points.

## Scope

`backend/src/modules/customer/*`

## Workflow

Standard master data pipeline — see [supplier/backend.md](../supplier/backend.md) (identical structure).

## Business Rules

normalizeCode · assertCodeUnique · buildWhere (code/name/contactPerson/phone) · softDelete INACTIVE

## Technical Design

customer.route.js → controller → service → repository → validation

Mount: `/customers`

## API / Database

[api.md](./api.md) · [database.md](./database.md)

## Validation

customer.validation.js

## Security

customer:read|create|update|delete

## Error Handling

Không tìm thấy khách hàng · Mã khách hàng đã tồn tại

## Examples

goodsIssue.service.js — customer ACTIVE check on create.

## Design Decisions

Isolated module per entity — trade-off: duplicate code with supplier.

## Notes

Future refactor: shared baseMasterDataService(entity)

## Checklist

- [x] Layer files
- [x] goods-issue consumer
