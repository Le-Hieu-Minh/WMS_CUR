# Module Supplier – Hub tài liệu

## Overview

Module **Supplier** quản lý danh mục nhà cung cấp (NCC): mã, tên, liên hệ, địa chỉ, ghi chú và trạng thái. NCC được gắn với phiếu nhập kho.

| Thuộc tính | Giá trị |
|------------|---------|
| Sprint | 1 – Module 6 |
| Trạng thái | Đã triển khai |
| API | `/api/v1/suppliers` |
| FE | `/suppliers` |
| Permissions | `supplier:read` · `supplier:create` · `supplier:update` · `supplier:delete` |

## Purpose

Master data NCC thống nhất cho procurement và phiếu nhập — validate ACTIVE khi tạo phiếu.

## Scope

| Trong | Ngoài |
|-------|-------|
| CRUD NCC soft delete | Đánh giá NCC, hợp đồng |
| Search contact/phone | Thanh toán, công nợ |

## Workflow

```mermaid
flowchart LR
  A[/suppliers] --> B[CRUD NCC]
  B --> C[ACTIVE]
  C --> D[Goods Receipt chọn NCC]
  B --> E[INACTIVE]
  E --> F[Phiếu mới không chọn]
```

[analysis.md](./analysis.md) · [api.md](./api.md)

## Business Rules

| ID | Quy tắc |
|----|---------|
| SU-BR-01 | Mã NCC unique UPPERCASE |
| SU-BR-02 | Tạo mới ACTIVE |
| SU-BR-03 | DELETE → INACTIVE |
| SU-BR-04 | NCC INACTIVE không dùng phiếu nhập mới |
| SU-BR-05 | supplier optional on receipt? — validate ACTIVE if provided |

## Technical Design

Master data pattern. [backend.md](./backend.md) · [frontend.md](./frontend.md)

## API / Database

[api.md](./api.md) · [database.md](./database.md)

## Validation

supplier.validation.js · supplierSchema (FE)

## Security

JWT + supplier:* permissions

## Error Handling

404, 409 trùng mã — [api.md](./api.md)

## Examples

[user-guide.md](./user-guide.md)

## Design Decisions

Cùng MasterDataListPage với customer — cấu trúc form giống nhau.

## Notes

Search: code, name, contactPerson, phone.

## Checklist

- [x] Hub complete
- [x] Link goods-receipt
- [ ] Supplier rating (future)

## Tài liệu con

[analysis.md](./analysis.md) · [api.md](./api.md) · [database.md](./database.md) · [frontend.md](./frontend.md) · [backend.md](./backend.md) · [user-guide.md](./user-guide.md) · [developer-guide.md](./developer-guide.md)
