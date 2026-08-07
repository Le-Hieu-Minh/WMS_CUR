# Audit Log – Hướng dẫn developer

## Overview

Cách ghi và mở rộng audit log từ module mới.

## Purpose

Chuẩn hóa action names và payload khi thêm feature.

## Scope

auditService.log integration, không sửa read API trừ khi thêm filter.

## Workflow

1. Hoàn thành business operation successfully.
2. Gọi auditService.log với action constant UPPER_SNAKE.
3. Pass minimal newData/oldData — no secrets.
4. Verify row in GET list.

## Business Rules

Never log raw passwords/tokens — rely on sanitize but avoid sending them.

## Technical Design

### Thêm action mới

```javascript
await auditService.log({
  userId,
  action: 'MY_MODULE_CONFIRM',
  module: 'my-module',
  entityType: 'MyEntity',
  entityId: entity.id,
  description: 'Mô tả tiếng Việt',
  newData: { /* small snapshot */ },
});
```

Add module to FE MODULES filter if user-facing.

### Test sanitize

Extract sanitize to testable export if adding unit tests.

## API / Database

No migration for new actions — action is free string. Consider constants file `auditActions.js`.

## Validation

N/A for write. Read filters extensible in listAuditLogsSchema.

## Security

Review newData size — avoid huge payloads.

## Error Handling

Assume log may fail — business op already committed.

## Examples

goodsReceipt.service confirm block — reference implementation.

## Design Decisions

Best-effort write vs mandatory audit queue — MVP chose best-effort.

## Notes

grep `auditService.log` for current integration points.

## Checklist

- [ ] New sensitive module calls log on confirm
- [ ] Action name documented
- [ ] FE filter updated if needed
- [ ] No PII overload in JSON
