# User – Database Documentation

## Quyết định

Module User **không tạo bảng mới**. Tái sử dụng schema đã có từ Auth.

## Bảng sử dụng

| Bảng | Vai trò với User module |
|------|-------------------------|
| `users` | CRUD / status / password |
| `roles` | Gán `role_id`, list options |
| `refresh_tokens` | Revoke khi deactivate / reset |

## Trường thao tác chính trên `users`

| Field | Create | Update | Status/Unlock | Reset PW | Soft delete |
|-------|--------|--------|---------------|----------|-------------|
| email | ✅ | ❌ | — | — | — |
| password_hash | ✅ | — | — | ✅ | — |
| full_name | ✅ | ✅ | — | — | — |
| avatar_url | optional | ✅ | — | — | — |
| role_id | ✅ | ✅ | — | — | — |
| status | ACTIVE | — | ✅ | — | → INACTIVE |
| failed_login_attempts | 0 | — | unlock → 0 | — | — |
| locked_until | null | — | unlock → null | — | — |

## Relationship

```
roles 1 ─── N users
users 1 ─── N refresh_tokens
```

## Index

- UNIQUE(email)  
- INDEX(status), INDEX(role_id)  
- Optional sau: INDEX(full_name) hoặc trigram cho search  

## Migration

Không cần migration mới nếu Auth đã `db push`. Chỉ cần seed roles.
