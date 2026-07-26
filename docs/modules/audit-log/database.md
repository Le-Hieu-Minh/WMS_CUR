# Audit Log – Database

## Bảng `audit_logs`

| Field | Type | Constraint |
|-------|------|------------|
| id | UUID | PK |
| user_id | UUID | FK users NULL (system) |
| action | VARCHAR(100) | NOT NULL · index |
| module | VARCHAR(50) | NOT NULL · index |
| entity_type | VARCHAR(50) | NULL |
| entity_id | UUID | NULL · index |
| description | VARCHAR(500) | NULL |
| old_data | JSONB | NULL |
| new_data | JSONB | NULL |
| ip_address | VARCHAR(45) | NULL |
| user_agent | VARCHAR(500) | NULL |
| created_at | TIMESTAMPTZ | DEFAULT now() · index |

**Không** updated_at / deleted_at.

## Relationship

```
User 1──N AuditLog (optional)
```
