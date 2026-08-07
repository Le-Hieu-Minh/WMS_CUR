# Audit Log – Backend

## Overview

Backend gồm read routes và shared `auditService` dùng bởi mọi module cần ghi log.

## Purpose

Hướng dẫn tích hợp log() và maintain sanitize logic.

## Scope

`backend/src/modules/audit-log/`: auditLog.route.js, auditLog.controller.js, auditLog.validation.js, audit.service.js.

## Workflow

**Write path:** any service → `auditService.log({...})` after success.

**Read path:** GET → controller → auditService.list/getById.

## Business Rules

SENSITIVE_KEYS: password, passwordHash, accessToken, refreshToken, token — recursive sanitize.

## Technical Design

```javascript
// Integration pattern (after business transaction)
await auditService.log({
  userId,
  action: 'STOCK_TAKE_CONFIRM',
  module: 'stock-take',
  entityType: 'StockTake',
  entityId: confirmed.id,
  description: `Xác nhận phiếu kiểm kê ${confirmed.code}`,
  newData: { code, warehouseId },
  ipAddress: meta.ipAddress,
  userAgent: meta.userAgent,
});
```

log() try/catch — logger.error on failure.

## API / Database

Prisma auditLog.create / findMany / findUnique. Include user select on read.

## Validation

listAuditLogsSchema — dateTo extended to end of day in service.

## Security

Read authorize audit-log:read. Write unauthenticated API — internal only.

## Error Handling

getById throws 404 ApiError. log swallows errors.

## Examples

Auth service logs LOGIN with sanitized payload.

## Design Decisions

Single audit.service vs per-module writers — centralize sanitize and schema.

## Notes

Controllers may pass req meta (ip, ua) via service layer pattern in future refactor.

## Checklist

- [x] Sanitize tested manually
- [x] List filters in service
- [ ] Unit test sanitize function
- [ ] Structured action enum doc
