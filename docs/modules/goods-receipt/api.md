# Goods Receipt – API Design

## Overview

REST API quản lý phiếu nhập kho. Base path: **`/api/v1/goods-receipts`**. Tất cả endpoint yêu cầu Bearer token.

## Purpose

Mô tả contract HTTP đầy đủ cho FE và tích hợp bên thứ ba.

## Scope

| Endpoint | Mô tả |
|----------|-------|
| CRUD + confirm/cancel | Trong phạm vi |
| Webhook / batch import | Ngoài phạm vi MVP |

## Workflow

```text
POST /           → DRAFT
PUT /:id         → update DRAFT
POST /:id/confirm → CONFIRMED + inventory
POST /:id/cancel  → CANCELLED
DELETE /:id      → xóa DRAFT
```

## Business Rules

- Confirm chỉ từ DRAFT.
- Create/update body giống nhau (full replacement items khi update).

## Technical Design

Response envelope chuẩn WMS: `{ success, data, pagination?, message? }`.

## API / Database (nếu có)

### Endpoints

| Method | Path | Permission | Mô tả |
|--------|------|------------|-------|
| GET | `/` | `goods-receipt:read` | Danh sách phân trang |
| GET | `/:id` | `goods-receipt:read` | Chi tiết + items |
| POST | `/` | `goods-receipt:create` | Tạo DRAFT |
| PUT | `/:id` | `goods-receipt:update` | Sửa DRAFT |
| POST | `/:id/confirm` | `goods-receipt:update` | Confirm |
| POST | `/:id/cancel` | `goods-receipt:update` | Cancel DRAFT |
| DELETE | `/:id` | `goods-receipt:delete` | Xóa DRAFT |

### GET `/` — Query params

| Param | Type | Mô tả |
|-------|------|-------|
| page | int | Trang (default 1) |
| limit | int | 1–100 (default 10) |
| search | string | Tìm `code`, `note` |
| status | enum | `DRAFT` \| `CONFIRMED` \| `CANCELLED` |
| warehouseId | uuid | Lọc kho |
| supplierId | uuid | Lọc NCC |
| sortBy | enum | `createdAt` \| `receiptDate` \| `code` |
| sortOrder | enum | `asc` \| `desc` |

### List item shape

| Field | Type | Mô tả |
|-------|------|-------|
| id | uuid | PK |
| code | string | GR-YYYYMMDD-XXXX |
| warehouseId | uuid | |
| warehouse | object | `{ id, code, name }` |
| supplierId | uuid \| null | |
| supplier | object \| null | `{ id, code, name }` |
| status | enum | DocumentStatus |
| receiptDate | date | |
| note | string \| null | |
| createdBy | object | `{ id, fullName, email }` |
| confirmedBy | object \| null | Khi CONFIRMED |
| confirmedAt | datetime \| null | |
| itemCount | int | Số dòng |
| createdAt | datetime | |
| updatedAt | datetime | |

### GET `/:id` — Detail thêm

| Field | Type | Mô tả |
|-------|------|-------|
| items | array | Danh sách dòng |
| items[].id | uuid | |
| items[].productId | uuid | |
| items[].product | object | `{ id, code, name, unit, status }` |
| items[].quantity | number | |
| items[].unitCost | number | |
| items[].note | string \| null | |

### POST `/` & PUT `/:id` — Request body

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| warehouseId | uuid | ✓ | Kho ACTIVE |
| supplierId | uuid | | Optional, NCC ACTIVE |
| receiptDate | string | ✓ | ISO date |
| note | string | | Max 1000 |
| items | array | ✓ | Min 1 phần tử |
| items[].productId | uuid | ✓ | SP ACTIVE, unique trong phiếu |
| items[].quantity | number | ✓ | > 0 |
| items[].unitCost | number | | >= 0, default 0 |
| items[].note | string | | Max 500 |

### POST create — Response 201

Trả object detail như GET `/:id` (status `DRAFT`, code auto-generated).

### POST confirm — Response 200

| Field bổ sung | Giá trị |
|---------------|---------|
| status | `CONFIRMED` |
| confirmedBy | User hiện tại |
| confirmedAt | Timestamp server |

Side effect: `inventories.quantity` tăng theo từng dòng (transaction).

## Validation

Zod schema: `backend/src/modules/goods-receipt/goodsReceipt.validation.js`.

Service validation bổ sung: kho/NCC/SP tồn tại và ACTIVE, không trùng productId.

## Security

- Middleware: `authenticate`, `authorize(permission)`.
- Confirm dùng permission `update`, không tách permission riêng.

## Error Handling

| Code | Message ví dụ |
|------|---------------|
| 400 | Không được trùng sản phẩm trong cùng phiếu nhập |
| 400 | Kho không tồn tại hoặc đã ngừng hoạt động |
| 404 | Không tìm thấy phiếu nhập |
| 409 | Chỉ thao tác được trên phiếu ở trạng thái Nháp |

## Examples

```http
GET /api/v1/goods-receipts?page=1&limit=10&status=DRAFT
Authorization: Bearer <token>
```

```json
POST /api/v1/goods-receipts
{
  "warehouseId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "supplierId": null,
  "receiptDate": "2026-08-07",
  "note": "Nhập nội bộ",
  "items": [
    { "productId": "...", "quantity": 50, "unitCost": 120000, "note": null }
  ]
}
```

## Design Decisions

| Quyết định | Lý do |
|------------|-------|
| Confirm = POST sub-resource | Rõ nghĩa, idempotent theo status |
| PUT full body | Đồng bộ create/update contract |
| itemCount trên list | Tránh load items khi list |

## Notes

- Swagger tag: `Goods Receipts`.
- FE client: `goodsReceiptApi.js`.

## Checklist

- [x] 7 endpoints documented
- [x] Query/body fields complete
- [x] Response shapes
- [x] Error codes
- [ ] OpenAPI examples enriched
