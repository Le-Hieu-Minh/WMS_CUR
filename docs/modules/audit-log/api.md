# Audit Log – API

Base: `/api/v1/audit-logs`

| Method | Endpoint | Permission |
|--------|----------|------------|
| GET | `/` | audit-log:read |
| GET | `/:id` | audit-log:read |

**Không có** POST/PUT/PATCH/DELETE public.

## Query list

`page`, `limit`, `module`, `action`, `userId`, `dateFrom`, `dateTo`, `search` (description/entityId)
