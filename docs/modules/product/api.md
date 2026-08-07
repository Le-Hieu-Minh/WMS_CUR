# Product – API Reference

## Overview

REST API danh mục sản phẩm tại `/api/v1/products`. CRUD, đổi status, soft delete; hỗ trợ lọc category và sort theo giá.

## Purpose

Contract đầy đủ cho frontend và module nghiệp vụ tham chiếu sản phẩm.

## Scope

6 endpoint chuẩn master data. Không có endpoint upload ảnh.

## Workflow

List → filter/search → create → update → PATCH status / DELETE soft.

## Business Rules

PR-BR-01 (unique code), PR-BR-02 (defaults), PR-BR-06 (soft delete). Service map Decimal → number trong response.

## Technical Design

Files: `product.route.js`, `product.controller.js`, `product.service.js`, `product.repository.js`, `product.validation.js`

Schema: [database.md](./database.md)

## API / Database

### Headers

| Header | Bắt buộc |
|--------|----------|
| Authorization | Bearer token |
| Content-Type | application/json (POST/PUT/PATCH) |

### GET `/api/v1/products`

| | |
|--|--|
| **Method** | GET |
| **Auth** | `product:read` |
| **Description** | Danh sách phân trang |

**Query**

| Param | Mô tả |
|-------|-------|
| page, limit | Pagination (default 1, 10; max limit 100) |
| search | OR: code, name, category |
| status | ACTIVE \| INACTIVE |
| category | Exact match, case-insensitive |
| sortBy | code \| name \| price \| createdAt |
| sortOrder | asc \| desc |

**Response 200:** `data[]` với price/costPrice dạng number + pagination

---

### GET `/api/v1/products/:id`

**Auth:** `product:read` · **404:** Không tìm thấy sản phẩm

---

### POST `/api/v1/products`

**Auth:** `product:create` · **201:** Tạo sản phẩm thành công

**Body**

| Field | Type | Required | Default | Validation |
|-------|------|----------|---------|------------|
| code | string | ✓ | — | 1–50 |
| name | string | ✓ | — | 2–255 |
| description | string | | null | max 2000 |
| category | string | | null | max 100 |
| unit | string | | pcs | 1–20 |
| price | number | | 0 | ≥ 0 |
| costPrice | number | | 0 | ≥ 0 |
| minStock | int | | 0 | ≥ 0 |
| imageUrl | url | | null | optional |

**409:** Mã sản phẩm đã tồn tại

**Example**
```json
{
  "code": "prd-001",
  "name": "Laptop Dell",
  "category": "Electronics",
  "unit": "pcs",
  "price": 15000000,
  "costPrice": 12000000,
  "minStock": 5
}
```

---

### PUT `/api/v1/products/:id`

**Auth:** `product:update` · Body: fields optional (không status)

---

### PATCH `/api/v1/products/:id/status`

**Auth:** `product:update` · Body: `{ "status": "ACTIVE"|"INACTIVE" }`

---

### DELETE `/api/v1/products/:id`

**Auth:** `product:delete` · Soft delete → INACTIVE · **200:** Xóa sản phẩm thành công

## Validation

Zod: `listProductsSchema`, `productIdSchema`, `createProductSchema`, `updateProductSchema`, `changeProductStatusSchema`

## Security

authenticate + authorize per route. Không public endpoint.

## Error Handling

| Status | Message ví dụ |
|--------|---------------|
| 400 | Validation field |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Không tìm thấy sản phẩm |
| 409 | Mã sản phẩm đã tồn tại |

## Examples

```
GET /api/v1/products?category=Electronics&sortBy=price&sortOrder=asc&status=ACTIVE
DELETE /api/v1/products/{uuid}
```

## Design Decisions

| Decision | Reason |
|----------|--------|
| coerce.number on price | Query/body string vẫn parse |
| sortBy price | Báo cáo catalog |
| imageUrl optional | CDN/external URL, no upload |

## Notes

goods-receipt/issue/stock-take/adjustment validate product ACTIVE

## Checklist

- [x] 6 endpoints documented
- [x] Body/query/defaults
- [x] Decimal mapping noted
- [ ] OpenAPI
