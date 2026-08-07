# Module Customer – Hub tài liệu

## Overview

Module **Customer** quản lý danh mục khách hàng (KH): mã, tên, liên hệ, địa chỉ, ghi chú, trạng thái. KH được gắn với phiếu xuất kho (goods issue).

| Thuộc tính | Giá trị |
|------------|---------|
| Sprint | 1 – Module 7 |
| Trạng thái | Đã triển khai |
| API | `/api/v1/customers` |
| FE | `/customers` |
| Permissions | `customer:read` · `customer:create` · `customer:update` · `customer:delete` |

## Purpose

Master data KH cho bán hàng/xuất kho — đảm bảo phiếu xuất tham chiếu KH hợp lệ ACTIVE.

## Scope

| Trong | Ngoài |
|-------|-------|
| CRUD KH soft delete | CRM, loyalty |
| Search liên hệ | Billing |

## Workflow

```mermaid
flowchart LR
  A[/customers] --> B[CRUD KH]
  B --> C[ACTIVE]
  C --> D[Goods Issue]
  B --> E[INACTIVE]
```

[analysis.md](./analysis.md) · [api.md](./api.md)

## Business Rules

| ID | Quy tắc |
|----|---------|
| CU-BR-01 | Mã KH unique UPPERCASE |
| CU-BR-02 | Tạo ACTIVE |
| CU-BR-03 | DELETE → INACTIVE |
| CU-BR-04 | KH INACTIVE không phiếu xuất mới |

## Technical Design

Master data pattern — symmetric với [supplier](../supplier/README.md). [backend.md](./backend.md) · [frontend.md](./frontend.md)

## API / Database

[api.md](./api.md) · [database.md](./database.md)

## Validation

customer.validation.js · customerSchema

## Security

customer:* RBAC

## Error Handling

[api.md](./api.md#error-handling)

## Examples

[user-guide.md](./user-guide.md)

## Design Decisions

Shared MasterDataListPage với supplier — party model tách module.

## Notes

Search: code, name, contactPerson, phone

## Checklist

- [x] Hub + goods-issue link
- [ ] CRM integration (future)

## Tài liệu con

[analysis.md](./analysis.md) · [api.md](./api.md) · [database.md](./database.md) · [frontend.md](./frontend.md) · [backend.md](./backend.md) · [user-guide.md](./user-guide.md) · [developer-guide.md](./developer-guide.md)
