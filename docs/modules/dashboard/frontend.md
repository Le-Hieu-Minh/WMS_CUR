# Dashboard – Frontend

## Overview

Trang **`/`** — Dashboard tổng quan sau login. React + Recharts + TanStack Query.

## Purpose

Hiển thị KPI, biểu đồ, bảng top và low stock.

## Scope

Read-only visualization. Permission-aware.

## Workflow

```text
DashboardPage
  canRead = hasPermission('dashboard:read')
  if !canRead → welcome + no data message
  else overviewQuery → render grids
```

## Business Rules

| UI | Rule |
|----|------|
| No permission | Chỉ chào user, không gọi API |
| Error state | Banner đỏ |
| Empty tables | "Chưa có dữ liệu" |

## Technical Design

| File | Role |
|------|------|
| `pages/DashboardPage.jsx` | Main |
| `api/dashboardApi.js` | `overview()` |

### Components (inline)

| Component | Content |
|-----------|---------|
| StatCard | KPI + icon Lucide |
| ProductRankTable | topReceived / topIssued |
| BarChart | monthlyChart receipts vs issues |

### KPI cards (6)

Tổng SP, Tổng kho, Tổng tồn, Giá trị tồn, Phiếu nhập hôm nay, Phiếu xuất hôm nay.

Icons: Package, Warehouse, Boxes, Banknote, ArrowDownToLine, ArrowUpFromLine.

## API / Database (nếu có)

`dashboardApi.overview()` → GET `/dashboard/overview`.

## Validation

N/A.

## Security

`usePermissions` + `enabled: canRead` on query.

## Error Handling

`overviewQuery.isError` → destructive banner.

Loading: spinner inside StatCard.

## Examples

`formatNumber` → `toLocaleString('vi-VN')`.

## Design Decisions

Grid responsive: sm:2 cols, xl:3 cols KPI.

## Notes

Uses `env.appName` in subtitle.

## Checklist

- [x] Permission fallback UI
- [x] 6 KPI cards
- [x] Recharts bar chart
- [x] 3 data tables
- [ ] Refresh button (future)
