# Report – Backend

## Overview

Backend report generation: query handlers, ExcelJS workbook, PDFKit document.

## Purpose

Implement and extend report types and export formats.

## Scope

`backend/src/modules/report/`: report.route.js, report.controller.js, report.service.js.

## Workflow

getReport(type, query) → handler → { type, title, total, rows }.

exportReport → getReport → buildExcel | buildPdf → buffer + contentType + filename.

## Business Rules

REPORT_TITLES Vietnamese titles. buildExcel: title row, blank, headers, data rows. buildPdf: title, header line, up to 200 data lines.

## Technical Design

| Dependency | Use |
|------------|-----|
| ExcelJS | .xlsx buffer |
| PDFKit | .pdf buffer |
| prisma | All queries |

Controller export sets headers and sends Buffer.from(file.buffer).

## API / Database

See report.service.js REPORT_HANDLERS — add new type requires handler + title + route TYPES regex.

## Validation

No zod middleware on route currently — type validated by regex; format string check in service.

## Security

authorize report:read / report:export on routes.

## Error Handling

ApiError 404 bad type, 400 bad format. Empty rows handled in builders.

## Examples

Add `suppliers` report: implement getSuppliersReport, register in REPORT_HANDLERS and TYPES regex in route.

## Design Decisions

Sync generation in request — acceptable for MVP MAX_ROWS 10k; async job queue for scale later.

## Notes

stock-value duplicates inventory query — intentional same data different title/context.

## Checklist

- [x] Excel + PDF builders
- [x] 6 handlers
- [ ] Query param zod validation
- [ ] Unit test variance calc stock-takes report
