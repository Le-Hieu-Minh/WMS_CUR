# Stock Take – Hướng dẫn developer

## Overview

Hướng dẫn mở rộng, debug và test module Stock Take trong monorepo WMS.

## Purpose

Giúp developer onboard nhanh, thêm field/endpoint an toàn và tránh phá vỡ luồng inventory.

## Scope

Backend `backend/src/modules/stock-take/`, frontend `frontend/src/features/stock-takes/`, liên quan inventory + audit.

## Workflow

Dev loop: sửa schema Prisma (nếu cần) → migrate → service → validation → route → FE schema/API → test.

## Business Rules

Khi sửa confirm logic: **luôn** dùng transaction; không gọi setStock ngoài confirm. Giữ snapshot semantics cho system_qty.

## Technical Design

### Thêm cột mới (ví dụ `location`)

1. Prisma migration + map trong repository create/update.
2. Zod body schema + FE form field.
3. Không đưa vào confirm inventory trừ khi BR yêu cầu.

### Debug confirm

- Log `doc.items` trước loop setStock.
- Kiểm tra `inventoryRepository.setStock` upsert khi SP chưa có tồn.

### Test

```bash
cd backend && npm test -- stockTake
cd frontend && npm test -- stockTakeSchema
```

## API / Database

Register route trong app router (thường `/api/v1/stock-takes`). Seed permissions: `stock-take:read|create|update|delete`.

## Validation

Đồng bộ Zod BE/FE cho `countedQty` min 0. BE là source of truth cho system_qty.

## Security

Thêm permission mới → seed roles + `usePermissions` + route authorize.

## Error Handling

Dùng `ApiError(HttpStatus.*, message)` — message tiếng Việt cho UI.

## Examples

**Thêm filter takeDate range on list:** extend `listStockTakesSchema` query + `buildWhere` + FE date inputs.

## Design Decisions

Giữ pattern GR/GI khi refactor — shared `DocumentStatus`, pagination utils.

## Notes

- Audit action constant: `STOCK_TAKE_CONFIRM`.
- Report type `stock-takes` đọc items CONFIRMED only.

## Checklist

- [ ] Chạy migration local
- [ ] Validation tests pass
- [ ] Manual: create → confirm → check inventory page
- [ ] Cập nhật Swagger nếu đổi API
- [ ] Không commit secrets
