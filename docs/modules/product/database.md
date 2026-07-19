# Product – Database Documentation

## Model `Product`

Bảng: `products`

| Field | Type | Ghi chú |
|-------|------|---------|
| id | UUID PK | |
| code | String UNIQUE | UPPERCASE ở service |
| name | String | |
| description | String? | |
| category | String? | |
| unit | String | Default `pcs` |
| price | Decimal(15,2) | Default 0 |
| cost_price | Decimal(15,2) | Default 0 |
| min_stock | Int | Default 0 |
| image_url | String? | URL ảnh |
| status | EntityStatus | ACTIVE \| INACTIVE |
| created_at | DateTime | |
| updated_at | DateTime | |

## Index

- UNIQUE(code)  
- INDEX(status)  
- INDEX(category)  

## Sprint 2+

Liên kết Inventory, Goods Receipt/Issue lines.
