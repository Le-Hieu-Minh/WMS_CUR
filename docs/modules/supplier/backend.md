# Supplier – Backend Design

```
backend/src/modules/supplier/
├── supplier.route.js
├── supplier.controller.js
├── supplier.service.js
├── supplier.repository.js
└── supplier.validation.js
```

## Service methods

`list`, `getById`, `create`, `update`, `changeStatus`, `softDelete`

Logic giống warehouse: normalizeCode, assertCodeUnique, buildWhere (search thêm contactPerson, phone).

Đăng ký: `/suppliers` trong `routes/index.js`.
