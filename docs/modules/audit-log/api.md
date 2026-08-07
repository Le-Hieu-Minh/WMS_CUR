# Audit Log – API

## Overview

Read-only REST API tra cứu nhật ký. Base `/api/v1/audit-logs`.

## Purpose

Contract cho UI audit và integration reporting.

## Scope

2 endpoints: list, getById. Không POST/PUT/DELETE.

## Workflow

Client poll list with filters → click row → getById for full oldData/newData JSON.

## Business Rules

Sort whitelist: createdAt, action, module. dateTo inclusive end of day.

## Technical Design

Controller → auditService.list/getById. Shared pagination utils.

## API / Database

### Endpoints

| Method | Path | Permission |
|--------|------|------------|
| GET | `/` | audit-log:read |
| GET | `/:id` | audit-log:read |

### Query parameters (list)

| Param | Mô tả |
|-------|-------|
| page, limit | Phân trang (limit max 100) |
| search | description, entityId, action |
| module | Exact match (e.g. stock-take) |
| action | Exact match |
| userId | UUID user |
| dateFrom, dateTo | ISO date strings |
| sortBy | createdAt \| action \| module |
| sortOrder | asc \| desc |

### Response item

| Field | Mô tả |
|-------|-------|
| id | UUID |
| user | { id, fullName, email } nullable |
| action | String constant |
| module | Module slug |
| entityType | e.g. StockTake |
| entityId | UUID string |
| description | Human readable VN |
| oldData, newData | JSON nullable (redacted) |
| ipAddress, userAgent | nullable |
| createdAt | ISO timestamp |

## Validation

Zod listAuditLogsSchema, auditLogIdSchema.

## Security

audit-log:read only. Authenticated users without permission get 403.

## Error Handling

404: Không tìm thấy nhật ký.

## Examples

```
GET /api/v1/audit-logs?module=stock-take&dateFrom=2026-08-01&dateTo=2026-08-07
```

## Design Decisions

No export endpoint in MVP — use report module separately if needed.

## Notes

Internal write via auditService.log — not exposed.

## Checklist

- [x] List filters documented
- [x] Response fields
- [ ] Rate limit on list (prod)
