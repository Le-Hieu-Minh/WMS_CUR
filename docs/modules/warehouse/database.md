# Warehouse – Database Documentation

## Model `Warehouse`

Bảng: `warehouses`

| Field | Type | Ghi chú |
|-------|------|---------|
| id | UUID PK | |
| code | String UNIQUE | Normalize UPPERCASE ở service |
| name | String | |
| address | String? | |
| phone | String? | |
| email | String? | |
| description | String? | |
| status | EntityStatus | ACTIVE \| INACTIVE, default ACTIVE |
| created_at | DateTime | |
| updated_at | DateTime | |

## Enum `EntityStatus`

```
ACTIVE | INACTIVE
```

## Index

- UNIQUE(code)  
- INDEX(status)  

## Quan hệ Sprint 2+

Sprint 1 chưa FK inventory. Sprint 2 sẽ liên kết Goods Receipt/Issue/Inventory.

## Migration

Schema trong `backend/prisma/schema.prisma`. Chạy `npm run db:push`.
