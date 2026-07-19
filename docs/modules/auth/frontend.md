# Auth – Frontend Documentation

## Routes

| Path | Component | Guard |
|------|-----------|-------|
| `/login` | LoginPage | PublicRoute |
| `/change-password` | ChangePasswordPage | ProtectedRoute |
| `/*` (app) | AppLayout | ProtectedRoute |

## Feature structure

```
frontend/src/features/auth/
├── api/authApi.js
├── hooks/useAuth.jsx          # AuthProvider + useAuth
├── schemas/authSchema.js
├── components/
│   ├── LoginForm.jsx
│   └── ChangePasswordForm.jsx
└── pages/
    ├── LoginPage.jsx
    └── ChangePasswordPage.jsx
```

## Auth state (`useAuth`)

```javascript
{
  user,
  isAuthenticated,
  isLoading,
  isLoggingIn,
  isLoggingOut,
  login,
  logout,
  changePassword,
}
```

## Token storage

- `localStorage.accessToken`
- `localStorage.refreshToken`
- Axios interceptor tự gắn Bearer + refresh khi 401

## UI

- Login: Card centered, email/password, show/hide password, loading, error alert  
- Header: hiển thị fullName + role, nút Đổi MK, Đăng xuất  
- Responsive: card max-width 400px trên desktop  

## Env

```env
VITE_API_BASE_URL=http://localhost:3000/api/v1
VITE_APP_NAME=WMS
```
