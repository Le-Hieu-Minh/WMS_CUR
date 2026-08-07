# Dashboard – Backend

## Overview

Backend dashboard: single service aggregating cross-module reads.

## Purpose

Efficient overview without N+1 client calls.

## Scope

`backend/src/modules/dashboard/` — route, controller, service, tests.

## Workflow

### getOverview()

```javascript
Promise.all([
  getSummary(),
  getLowStock(10),
  getTopProducts('receipt', 5),
  getTopProducts('issue', 5),
  getMonthlyChart(),
])
```

### getSummary()

Parallel counts + inventory scan for qty/value.

### getLowStock(limit)

Load all inventories with product/warehouse → filter qty <= minStock → sort → slice.

### getTopProducts(type, limit)

`$queryRawUnsafe` with safeLimit 1–20.

### getMonthlyChart()

Build 12 month keys → count CONFIRMED receipts/issues by month label `MM/YYYY`.

## Business Rules

Implemented in service helpers — see [analysis.md](./analysis.md).

## Technical Design

| File | Notes |
|------|-------|
| dashboard.route.js | GET /overview |
| dashboard.controller.js | Thin |
| dashboard.service.js | All logic |
| __tests__/dashboard.service.test.js | Unit tests |

Helpers: `startOfDay`, `endOfDay`, `monthKey`, `buildLast12Months`, `toNumber`.

## API / Database (nếu có)

[api.md](./api.md) · [database.md](./database.md)

## Validation

No input validation needed.

## Security

Route: `authorize('dashboard:read')`.

## Error Handling

Unhandled DB errors → 500 middleware.

Raw SQL: only internal table names; limit sanitized.

## Examples

```javascript
export const dashboardService = {
  async getOverview() { ... }
};
```

## Design Decisions

| Topic | Choice |
|-------|--------|
| Parallel fetch | Minimize latency |
| In-memory lowStock | Same pattern as inventory list filter |
| Chart counts docs | Not line quantities |

## Notes

Assumption: server local timezone for "today".

## Checklist

- [x] Service tests exist
- [x] Single endpoint
- [ ] Cache layer Redis (future)
- [ ] Timezone config (future)
