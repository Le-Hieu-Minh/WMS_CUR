# Product – Backend Design

## Cấu trúc

```
backend/src/modules/product/
├── product.route.js
├── product.controller.js
├── product.service.js
├── product.repository.js
└── product.validation.js
```

## Service methods

| Method | Mô tả |
|--------|--------|
| `list` | Search code/name/category, filter status/category, mapProduct |
| `getById` | mapProduct |
| `create` | normalize code, defaults unit/price/minStock |
| `update` | partial update |
| `changeStatus` | ACTIVE/INACTIVE |
| `softDelete` | → INACTIVE |

## Helpers

- `mapProduct` — Decimal → Number cho JSON  
- `normalizeCode`, `assertCodeUnique`, `buildWhere`  

## Route

Giống pattern warehouse: GET, GET/:id, POST, PUT, PATCH /status, DELETE.
