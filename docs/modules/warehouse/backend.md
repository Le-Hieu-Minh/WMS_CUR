# Warehouse – Backend Design

## Cấu trúc

```
backend/src/modules/warehouse/
├── warehouse.route.js
├── warehouse.controller.js
├── warehouse.service.js
├── warehouse.repository.js
└── warehouse.validation.js
```

Đăng ký: `router.use('/warehouses', warehouseRoutes)`.

## Route + middleware

```
GET    /              authenticate + authorize('warehouse:read')
GET    /:id           authenticate + authorize('warehouse:read')
POST   /              authenticate + authorize('warehouse:create') + validate
PUT    /:id           authenticate + authorize('warehouse:update') + validate
PATCH  /:id/status    authenticate + authorize('warehouse:update') + validate
DELETE /:id           authenticate + authorize('warehouse:delete')
```

## Service methods

| Method | Business logic |
|--------|----------------|
| `list` | buildWhere + paginate |
| `getById` | 404 nếu thiếu |
| `create` | normalizeCode, assertCodeUnique, status ACTIVE |
| `update` | optional code normalize + unique check |
| `changeStatus` | update status |
| `softDelete` | delegate → INACTIVE |

## Repository

`findMany`, `count`, `findById`, `findByCode`, `create`, `update`

## Helpers

- `normalizeCode(code)` → trim + UPPERCASE  
- `buildWhere` → search OR code/name/address, filter status  
