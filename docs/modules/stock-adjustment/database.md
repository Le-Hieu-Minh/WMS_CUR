# Stock Adjustment – Database

## Enum `AdjustmentType`

`INCREASE` | `DECREASE`

## `stock_adjustments`

| Field | Type |
|-------|------|
| id | UUID PK |
| code | UNIQUE |
| warehouse_id | FK |
| status | DocumentStatus |
| adjust_date | DATE |
| reason | VARCHAR(500) NOT NULL |
| note | TEXT NULL |
| created_by_id / confirmed_by_id / confirmed_at | |
| created_at / updated_at | |

## `stock_adjustment_items`

| Field | Type |
|-------|------|
| id | UUID PK |
| stock_adjustment_id | FK CASCADE |
| product_id | FK |
| type | AdjustmentType |
| quantity | DECIMAL(15,3) > 0 |
| note | NULL |

**Unique:** (stock_adjustment_id, product_id)
