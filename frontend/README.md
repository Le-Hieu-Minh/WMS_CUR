# Frontend Architecture

```
src/
├── main.jsx                # App entry
├── index.css               # Tailwind + CSS variables
├── config/
│   └── env.js              # Environment variables
├── lib/
│   ├── axios.js            # HTTP client + interceptors
│   ├── queryClient.js      # TanStack Query config
│   └── utils.js            # cn() helper
├── components/
│   ├── ui/                 # Shadcn UI components
│   └── layout/             # AppLayout, Sidebar, Header
├── features/               # Feature-based modules
│   └── {feature}/
│       ├── pages/
│       ├── components/
│       ├── hooks/
│       ├── api/
│       └── schemas/
├── routes/
│   ├── index.jsx           # Router config
│   └── ProtectedRoute.jsx
├── pages/                  # Shared pages
└── hooks/                  # Shared hooks
```

## Adding a New Feature

1. Create folder under `src/features/{name}/`
2. Add pages, components, hooks, api, schemas
3. Register route in `src/routes/index.jsx`
4. Add nav item in `Sidebar.jsx` (when ready)

## Shadcn UI

Config: `components.json`

Add components:
```bash
npx shadcn@latest add button input card table dialog
```
