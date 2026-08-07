# Audit Log – Frontend

## Overview

Trang read-only **Nhật ký hoạt động** tại `/audit-logs`.

## Purpose

Tra cứu lịch sử thao tác với filter và xem chi tiết JSON payload.

## Scope

`frontend/src/features/audit-logs/`: AuditLogsPage.jsx, auditLogApi.js.

## Workflow

Load list (page 15) → filter search/module/date → click row → fetch getById → dialog hiển thị oldData/newData formatted.

## Business Rules

Không có nút tạo/sửa/xóa. Module filter dropdown cố định danh sách modules đã tích hợp.

## Technical Design

React Query list queryKey includes filters. Dialog view state `viewing`. Pagination component shared.

MODULES constant: auth, goods-receipt, goods-issue, stock-take, stock-adjustment.

## API / Database

auditLogApi.list(params), getById(id).

## Validation

Client-side date inputs optional; server validates UUID userId if added later.

## Security

Page accessible if route allowed; data fetch requires audit-log:read (403 from API otherwise).

## Error Handling

Loading spinner; empty state when no rows.

## Examples

Detail dialog shows pretty-print JSON for oldData/newData.

## Design Decisions

No client-side export — keep scope minimal.

## Notes

formatDateTime vi-VN locale.

## Checklist

- [x] List + filters
- [x] Detail dialog
- [ ] Link entityId to source document page (future)
