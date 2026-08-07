# Report – Hướng dẫn developer

## Overview

Thêm loại báo cáo mới hoặc cải thiện export pipeline.

## Purpose

Checklist kỹ thuật khi extend report module.

## Scope

report.service.js, report.route.js, ReportsPage REPORT_TYPES, reportApi.

## Workflow

1. Implement async handler(query) returning row array.
2. Register in REPORT_HANDLERS + REPORT_TITLES.
3. Add type to route TYPES regex string.
4. Add FE REPORT_TYPES entry.
5. Test JSON + excel + pdf.

## Business Rules

Respect MAX_ROWS. CONFIRMED-only for documents. Flat row objects for generic Excel/PDF.

## Technical Design

### New report type template

```javascript
async function getMyReport(query) {
  const where = { status: 'CONFIRMED' };
  // ... filters from query
  const rows = await prisma.myModel.findMany({ where, take: MAX_ROWS, include: {...} });
  return rows.map(r => ({ col1: r.field, ... }));
}
```

Update route: `const TYPES = 'inventory|...|my-report';`

### Improve PDF

Consider landscape, column widths, or switch to template engine if PDF quality insufficient.

## API / Database

Optional: add zod schema for query in new report.validation.js.

## Validation

Validate dateFrom <= dateTo in service if adding schema.

## Security

New report inherits report:read/export — no per-report permission in MVP.

## Error Handling

Test empty rows, 10k boundary, special chars in PDF text.

## Examples

Duplicate handler for `low-stock`: filter inventory where quantity < minStock.

## Design Decisions

Keep handlers in one service file until size forces split by domain.

## Notes

ExcelJS and PDFKit already in backend package.json dependencies.

## Checklist

- [ ] Handler + route regex + FE type
- [ ] Manual export open in Excel/Adobe
- [ ] Performance note if join heavy
- [ ] Update api.md row schema table
