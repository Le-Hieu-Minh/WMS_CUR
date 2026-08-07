# Supplier – Developer Guide

## Overview

Technical guide for extending supplier module and goods-receipt integration.

## Purpose

Safe change checklist for NCC master data.

## Scope

supplier BE/FE + goods-receipt consumer

## Workflow

Extend: Prisma → migrate → validation → service → schema → SuppliersPage

Test: CRUD /suppliers → create goods receipt with supplier ACTIVE

## Business Rules

Keep SU-BR-01, SU-BR-05. Update goods-receipt if supplier rules change.

## Technical Design

supplierApi in masterDataApi.js · queryKey `suppliers`

Active dropdown: GET /suppliers?status=ACTIVE&limit=100

## API / Database

[api.md](./api.md) · [database.md](./database.md)

## Validation

Sync supplierSchema with supplier.validation.js

## Security

Seed supplier:* permissions

## Error Handling

Same debug pattern as [warehouse/developer-guide.md](../warehouse/developer-guide.md)

## Examples

Parallel change with customer module when adding shared party field.

## Design Decisions

Module isolation vs shared `party` abstraction — current: isolated modules.

## Notes

Mirror customer developer-guide for symmetric changes.

## Checklist

- [ ] migrate
- [ ] BE+FE validation
- [ ] goods-receipt still validates ACTIVE
- [ ] docs updated
