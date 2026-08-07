# Customer – Developer Guide

## Overview

Developer guide for customer module and goods-issue integration.

## Purpose

Checklist for safe changes to customer master data.

## Scope

customer BE/FE + goods-issue consumer

## Workflow

1. Schema/migration if needed
2. customer.validation.js + customerSchema
3. service + CustomersPage
4. Test goods issue with ACTIVE customer
5. Update docs

## Business Rules

CU-BR-01, CU-BR-04 — sync with goodsIssue.service validation.

## Technical Design

customerApi · queryKey `customers`

Dropdown: GET /customers?status=ACTIVE&limit=100

Symmetric with [supplier/developer-guide.md](../supplier/developer-guide.md).

## API / Database

[api.md](./api.md) · [database.md](./database.md)

## Validation

Keep customer and supplier schemas in sync when adding shared party fields.

## Security

customer:* in role seed

## Error Handling

Debug per warehouse developer-guide pattern

## Examples

Joint feature (contact tax ID): update both customer + supplier modules + migrations.

## Design Decisions

Consider shared `PartyFields` constant for FE fields array — not implemented yet.

## Notes

statsApi.getCounts includes customers total

## Checklist

- [ ] migrate
- [ ] BE+FE validation
- [ ] goods-issue ACTIVE check
- [ ] docs api/database
