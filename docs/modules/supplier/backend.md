# Supplier – Backend

## Overview

Backend supplier — standard master data layers, search on contact fields.

## Purpose

Developer reference for supplier module code paths.

## Scope

`backend/src/modules/supplier/*`

## Workflow

HTTP → authenticate → authorize(supplier:*) → validate → controller → service → repository

## Business Rules

normalizeCode · assertCodeUnique · buildWhere OR on code/name/contactPerson/phone · softDelete → INACTIVE

## Technical Design

Files: supplier.route.js, controller, service, repository, validation

Route: `/suppliers` in routes/index.js

## API / Database

[api.md](./api.md) · [database.md](./database.md)

## Validation

supplier.validation.js — mirror customer validation rules

## Security

All routes authenticated; per-method authorize

## Error Handling

Messages: Không tìm thấy nhà cung cấp · Mã nhà cung cấp đã tồn tại

## Examples

goodsReceipt.service.js validates supplier ACTIVE when supplierId present.

## Design Decisions

Copy-paste safe pattern with customer — intentional duplication for module isolation.

## Notes

No Decimal mapping unlike product.

## Checklist

- [x] Service functions listed
- [x] Consumer goods-receipt noted
