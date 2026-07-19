# Supplier – Database Documentation

## Model `Supplier`

Bảng: `suppliers`

| Field | Type | Ghi chú |
|-------|------|---------|
| id | UUID PK | |
| code | String UNIQUE | |
| name | String | |
| contact_person | String? | |
| phone | String? | |
| email | String? | |
| address | String? | |
| notes | String? | |
| status | EntityStatus | Default ACTIVE |
| created_at | DateTime | |
| updated_at | DateTime | |

## Index

UNIQUE(code), INDEX(status)

## Sprint 2

FK từ Goods Receipt header.
