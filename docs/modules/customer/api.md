# Customer – API Reference

## Overview

REST API khách hàng tại `/api/v1/customers` — 6 endpoint master data CRUD.

## Purpose

API contract for FE and goods-issue integration.

## Scope

List, get, create, update, patch status, soft delete.

## Workflow

Identical structure to [supplier/api.md](../supplier/api.md) — customer-specific messages below.

## Business Rules

CU-BR-01 unique code · CU-BR-03 soft delete

## Technical Design

`backend/src/modules/customer/*` · mount `/customers`

## API / Database

### GET `/api/v1/customers`

Auth: `customer:read`

Query: page, limit, search (code/name/contactPerson/phone), status, sortBy (code/name/createdAt), sortOrder

---

### GET `/api/v1/customers/:id`

Auth: `customer:read` · 404: Không tìm thấy khách hàng

---

### POST `/api/v1/customers`

Auth: `customer:create` · 201: Tạo KH thành công

| Field | Required | Validation |
|-------|----------|------------|
| code | ✓ | 1–50 |
| name | ✓ | 2–255 |
| contactPerson | | max 255 |
| phone | | max 20 |
| email | | email |
| address | | max 500 |
| notes | | max 1000 |

409: Mã khách hàng đã tồn tại

Example:
```json
{"code":"cus-001","name":"Công ty Alpha","contactPerson":"Trần B"}
```

---

### PUT `/api/v1/customers/:id`

Auth: `customer:update`

---

### PATCH `/api/v1/customers/:id/status`

Auth: `customer:update` · body status ACTIVE|INACTIVE

---

### DELETE `/api/v1/customers/:id`

Auth: `customer:delete` · 200: Xóa KH thành công (soft INACTIVE)

DB: [database.md](./database.md)

## Validation

listCustomersSchema, customerIdSchema, create/update/changeStatus

## Security

JWT + customer:* per route

## Error Handling

Standard 400/401/403/404/409/500

## Examples

```
GET /api/v1/customers?status=ACTIVE&search=Alpha
PATCH /api/v1/customers/{id}/status {"status":"ACTIVE"}
```

## Design Decisions

API symmetry with supplier simplifies masterDataApi.

## Notes

Restore INACTIVE via PATCH status — no dedicated restore endpoint.

## Checklist

- [x] Full endpoint spec
- [x] Vietnamese messages
