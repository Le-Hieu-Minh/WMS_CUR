# Report – Frontend

## Overview

Trang **Báo cáo** (`/reports`) — chọn loại, lọc, xem bảng, export Excel/PDF.

## Purpose

Self-service reporting cho user có quyền read/export.

## Scope

`frontend/src/features/reports/`: ReportsPage.jsx, reportApi.js.

## Workflow

Select REPORT_TYPES → set warehouseId, dateFrom, dateTo → React Query fetch → render dynamic table from row keys → export buttons call blob API.

## Business Rules

reportQuery enabled only if `report:read`. Export buttons visible if `report:export`. Date filters shown for document-based types (UI logic may show for all — params ignored by inventory types).

## Technical Design

REPORT_TYPES constant 6 entries. `downloadBlob` from response blob + Content-Disposition filename parse.

reportApi.get(type, params) — JSON. reportApi.export(type, { ...params, format }) — responseType blob.

## API / Database

Params: warehouseId, dateFrom, dateTo, format on export.

## Validation

Client không validate date order — server accepts any range.

## Security

Permission gates read vs export separately.

## Error Handling

exportError state shows API message. Loading states on reportQuery and exporting spinner per format.

## Examples

Headers derived from `Object.keys(rows[0])` — English keys displayed as-is (future: i18n column map).

## Design Decisions

Preview before export — reduces blind downloads.

## Notes

warehouseApi.list ACTIVE limit 100 for dropdown.

## Checklist

- [x] 6 type selector
- [x] Excel + PDF buttons
- [x] Dynamic table
- [ ] Vietnamese column headers
- [ ] Disable date filter UI for inventory types
