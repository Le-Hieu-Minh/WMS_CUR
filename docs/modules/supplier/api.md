# Supplier – API Reference

## Overview

REST API NCC tại `/api/v1/suppliers` — pattern CRUD master data 6 endpoints.

## Purpose

Full API contract cho FE và goods-receipt module.

## Scope

List, get, create, update, patch status, delete soft.

## Workflow

Standard master data flow — see [warehouse/api.md](../warehouse/api.md) pattern; supplier-specific fields below.

## Business Rules

SU-BR-01 unique code · SU-BR-03 soft delete via DELETE

## Technical Design

`backend/src/modules/supplier/*` — route mount `/suppliers`

## API / Database

### GET `/api/v1/suppliers`

| | |
|--|--|
| Auth | `supplier:read` |
| Query | page, limit, search (code/name/contactPerson/phone), status, sortBy (code/name/createdAt), sortOrder |

Response: paginated supplier objects.

---

### GET `/api/v1/suppliers/:id`

Auth: `supplier:read` · 404: Không tìm thấy nhà cung cấp

---

### POST `/api/v1/suppliers`

Auth: `supplier:create` · 201: Tạo NCC thành công

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| code | string | ✓ | 1–50 |
| name | string | ✓ | 2–255 |
| contactPerson | string | | max 255, nullable |
| phone | string | | max 20 |
| email | string | | email |
| address | string | | max 500 |
| notes | string | | max 1000 |

Example:
```json
{"code":"sup-001","name":"Công ty ABC","contactPerson":"Nguyễn A","phone":"0901234567"}
```

409: Mã nhà cung cấp đã tồn tại

---

### PUT `/api/v1/suppliers/:id`

Auth: `supplier:update` · partial body

---

### PATCH `/api/v1/suppliers/:id/status`

Auth: `supplier:update` · `{ "status": "ACTIVE"|"INACTIVE" }`

---

### DELETE `/api/v1/suppliers/:id`

Auth: `supplier:delete` · soft → INACTIVE · 200: Xóa NCC thành công

Schema DB: [database.md](./database.md)

## Validation

listSuppliersSchema, supplierIdSchema, create/update/changeStatus schemas

## Security

authenticate all routes; authorize supplier:*

## Error Handling

400/401/403/404/409/500 standard envelope

## Examples

```
GET /api/v1/suppliers?search=ABC&status=ACTIVE
DELETE /api/v1/suppliers/{uuid}
```

## Design Decisions

Same API shape as customer — predictable for frontend masterDataApi.

## Notes

Cross-ref customer API for identical endpoint structure.

## Checklist

- [x] All endpoints
- [x] Field table
- [x] Error messages VI
