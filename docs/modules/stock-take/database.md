# Stock Take – Database

## Bảng `stock_takes`

| Field | Type | Constraint |
|-------|------|------------|
| id | UUID | PK |
| code | VARCHAR | UNIQUE |
| warehouse_id | UUID | FK warehouses |
| status | DocumentStatus | DRAFT/CONFIRMED/CANCELLED |
| take_date | DATE | NOT NULL |
| note | TEXT | NULL |
| created_by_id | UUID | FK users |
| confirmed_by_id | UUID | FK users NULL |
| confirmed_at | TIMESTAMPTZ | NULL |
| created_at / updated_at | TIMESTAMPTZ | |

**Index:** status, warehouse_id, take_date, created_by_id

## Bảng `stock_take_items`

| Field | Type | Constraint |
|-------|------|------------|
| id | UUID | PK |
| stock_take_id | UUID | FK CASCADE |
| product_id | UUID | FK products |
| system_qty | DECIMAL(15,3) | NOT NULL |
| counted_qty | DECIMAL(15,3) | NOT NULL |
| note | VARCHAR | NULL |

**Unique:** (stock_take_id, product_id)  
**Index:** stock_take_id, product_id

## Relationship

```
Warehouse 1──N StockTake
StockTake 1──N StockTakeItem
Product 1──N StockTakeItem
User 1──N StockTake (created/confirmed)
```

## Lý do

- Snapshot `system_qty` để audit variance sau này dù tồn đã đổi
- Confirm set tuyệt đối → đơn giản, khớp thực tế kiểm kê
