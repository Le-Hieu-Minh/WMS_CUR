# Dashboard – Developer Guide

## Overview

Dev guide module Dashboard — extend KPI, test, performance.

## Purpose

Onboarding và mở rộng overview API.

## Scope

Backend aggregation + FE wiring.

## Workflow

```bash
cd backend && npm test -- dashboard.service
cd frontend && npm run dev  # visit /
```

## Business Rules

When adding KPI, document formula in analysis + api.md.

## Technical Design

### Add new KPI field

1. Implement helper in `dashboard.service.js`
2. Add to `getSummary()` or new section
3. Update `DashboardPage` StatCard
4. Update tests + docs

### Change monthlyChart to sum quantities

Replace count loop with aggregate on items — breaking change; update user-guide.

### Performance tips

| Issue | Mitigation |
|-------|------------|
| Full inventory scan | SQL aggregate for summary |
| lowStock load all | WHERE quantity <= min_stock join |
| Raw SQL | Consider Prisma groupBy when stable |

## API / Database (nếu có)

Permission seed: `dashboard:read`.

## Validation

If adding query params later, add Zod on route.

## Security

Don't expose overview without auth.

## Error Handling

Unit test mocks prisma in `dashboard.service.test.js`.

## Examples

Extend response:

```javascript
return {
  summary: { ...summary, pendingDrafts: draftCount },
  ...
};
```

## Design Decisions

Keep one overview endpoint until payload size forces split.

## Notes

`$queryRawUnsafe` — never pass user input as table name.

Timezone: document if deploying UTC vs local.

## Checklist

- [ ] Tests updated on KPI change
- [ ] FE handles new fields gracefully
- [ ] Docs analysis + api synced
- [ ] Permission in seed
