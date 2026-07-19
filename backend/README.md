# Backend Architecture

```
src/
├── app.js                  # Express app setup
├── server.js               # Server entry point
├── config/
│   ├── env.js              # Environment validation (Zod)
│   ├── database.js         # Prisma client
│   ├── logger.js           # Pino logger
│   └── swagger.js          # OpenAPI spec
├── middlewares/
│   ├── auth.middleware.js  # JWT auth + permission check
│   ├── error.middleware.js # Global error handler
│   ├── validate.middleware.js
│   └── upload.middleware.js
├── modules/                # Feature modules (Sprint 1+)
│   └── {module}/
│       ├── {module}.route.js
│       ├── {module}.controller.js
│       ├── {module}.service.js
│       ├── {module}.repository.js
│       └── {module}.validation.js
├── routes/
│   └── index.js            # Route aggregator
├── services/
│   └── upload.service.js   # Cloudflare R2
└── utils/
    ├── apiError.js
    ├── apiResponse.js
    └── asyncHandler.js
```

## Layer Rules

| Layer | Responsibility |
|-------|---------------|
| Route | Define endpoints, attach middleware |
| Controller | Parse request, call service, return response |
| Service | Business logic, orchestration |
| Repository | Database operations via Prisma |

## Adding a New Module

1. Create folder under `src/modules/{name}/`
2. Implement route → controller → service → repository
3. Register route in `src/routes/index.js`
4. Add Prisma models in `prisma/schema.prisma`
5. Run `npm run db:migrate`
