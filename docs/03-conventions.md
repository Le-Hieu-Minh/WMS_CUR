# Quy ước phát triển

## Overview

Tài liệu này định nghĩa quy trình phân tích module, chuẩn viết tài liệu kỹ thuật, coding rules, permission, response API và testing cho dự án WMS.

## Purpose

Đảm bảo mọi module được phân tích → thiết kế → triển khai → tài liệu hóa theo cùng một chuẩn, giúp lập trình viên mới hiểu và phát triển tiếp mà không cần hỏi nhiều.

## Scope

| Trong phạm vi | Ngoài phạm vi |
|---------------|---------------|
| Quy trình 23 mục khi thiết kế module | Hướng dẫn nghiệp vụ từng module (xem `docs/modules/`) |
| Chuẩn cấu trúc tài liệu kỹ thuật | Style guide UI chi tiết |
| Coding rules FE/BE, permission, API response | Deploy production (xem `docs/sprint-3/deploy.md`) |

## Workflow

### Quy trình phân tích Module (23 mục)

Mỗi khi thiết kế/xây dựng một Module, trình bày theo thứ tự:

1. Giới thiệu Module
2. Mục tiêu
3. Phân tích nghiệp vụ
4. User Story
5. Use Case
6. User Flow
7. Activity Flow
8. Business Rules
9. Validation Rules
10. Exception Cases
11. Permission Matrix
12. Database Design
13. API Design
14. Frontend Design
15. Backend Design
16. Acceptance Criteria
17. Testing Strategy
18. API Documentation
19. Database Documentation
20. Frontend Documentation
21. Backend Documentation
22. User Guide
23. Developer Guide

Không bỏ qua mục nào.

### Ánh xạ sang chuẩn tài liệu kỹ thuật

| Mục 23 | Section chuẩn tài liệu |
|--------|------------------------|
| 1–3 | Overview, Purpose, Scope |
| 4–7 | Workflow |
| 8 | Business Rules |
| 9 | Validation |
| 10 | Error Handling |
| 11 | Security |
| 12–15 | Technical Design, API / Database |
| 16–17 | Notes (Acceptance, Testing) |
| 18–23 | File chuyên biệt + Examples |

## Business Rules

### Definition of Done

Module chỉ hoàn thành khi có đủ:

- Phân tích nghiệp vụ
- Database Design
- API Design
- Frontend + Backend
- Validation + Permission
- API / DB / FE / BE Documentation
- User Guide + Developer Guide
- Unit Test + Integration Test

### Chuẩn viết tài liệu kỹ thuật

Mỗi file trong `docs/` phải tuân thủ cấu trúc:

```text
# Tên tài liệu
## Overview
## Purpose
## Scope
## Workflow
## Business Rules
## Technical Design
## API / Database (nếu có)
## Validation
## Security
## Error Handling
## Examples
## Design Decisions
## Notes
## Checklist
```

#### Nguyên tắc bắt buộc

| # | Nguyên tắc |
|---|------------|
| 1 | Không mô tả từng dòng code — chỉ mục đích, thiết kế, luồng, business rules, input/output |
| 2 | Mỗi module trả lời: dùng để làm gì? Ai dùng? Input? Output? Ràng buộc? |
| 3 | Viết Markdown: heading, table, list, code block, blockquote |
| 4 | Ưu tiên bảng cho API, DB, validation, permissions, error codes, config |
| 5 | Có ví dụ thực tế (request/response/sample data) |
| 6 | Nhiều bước → numbered list hoặc flow text/`mermaid` |
| 7 | API: URL, Method, Auth, Headers, Params, Body, Response, Status, Errors, Validation, Rules, Example |
| 8 | DB table: Column/Type/Description + PK/FK/Index/Constraints/Relationships/Notes |
| 9 | Business Rule cụ thể, không chung chung |
| 10 | Không lặp — tham chiếu chéo |
| 11 | Đoạn văn tối đa ~4–6 dòng; dài hơn thì tách list/bảng/mục con |
| 12 | Design Decisions theo format Decision / Reason / Advantages / Trade-offs |
| 13 | Checklist cuối tài liệu |
| 14 | Thiếu thông tin → nêu giả định, không suy diễn |

#### Cấu trúc thư mục module

```text
docs/modules/{module}/
├── README.md           # Hub + Overview module
├── analysis.md         # Nghiệp vụ, BR, flow
├── api.md              # API Documentation
├── database.md         # Schema
├── frontend.md         # FE design
├── backend.md          # BE design
├── user-guide.md       # Hướng dẫn người dùng
└── developer-guide.md  # Ghi chú triển khai
```

## Technical Design

### Quy tắc viết code

- JavaScript (ES6+), **không** TypeScript
- Code sạch, dễ đọc, dễ bảo trì
- Tách file theo chức năng
- Không hardcode cấu hình nhạy cảm
- Validate đầy đủ, xử lý lỗi đầy đủ
- Feature-Based (FE), Layered (BE): Route → Controller → Service → Repository

### Permission code

```text
{module}:{action}

Ví dụ: user:read, warehouse:create, product:delete
```

### Response API chuẩn

**Success:**

```json
{
  "success": true,
  "message": "Success",
  "data": {}
}
```

**Paginated:**

```json
{
  "success": true,
  "message": "Success",
  "data": [],
  "pagination": { "page": 1, "limit": 10, "total": 0, "totalPages": 0 }
}
```

**Error:**

```json
{
  "success": false,
  "message": "Error message",
  "errors": null
}
```

## Validation

| Tầng | Công cụ | Phạm vi |
|------|---------|---------|
| Frontend | Zod + React Hook Form | Form UX |
| Backend | Zod (middleware) | Source of truth |
| Database | Prisma + constraints | Toàn vẹn dữ liệu |

## Security

- Không commit `.env` / secrets
- JWT Access + Refresh; refresh lưu hash trong DB
- Mọi API nghiệp vụ qua `authenticate` + `authorize(permission)`
- Password: bcrypt; không trả `passwordHash` ra API

## Error Handling

| Status | Ý nghĩa |
|--------|---------|
| 400 | Validation / bad request |
| 401 | Chưa xác thực / token invalid |
| 403 | Không đủ quyền / INACTIVE |
| 404 | Không tìm thấy |
| 409 | Conflict (unique, business conflict) |
| 423 | Locked (brute-force) |
| 429 | Rate limit |
| 500 | Lỗi hệ thống |

## Examples

Ví dụ permission code hợp lệ: `goods-receipt:confirm`.

Ví dụ response lỗi validation:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    { "field": "email", "message": "Invalid email" }
  ]
}
```

## Design Decisions

```text
Decision: Giữ file docs tách theo loại (analysis/api/database/…) thay vì gộp một file khổng lồ.
Reason: Dễ bảo trì, ít conflict khi nhiều người sửa, khớp quy trình 23 mục.
Advantages: Đọc đúng nhu cầu; tham chiếu chéo thay vì copy.
Trade-offs: Cần README hub và kỷ luật không lặp nội dung giữa các file.
```

```text
Decision: Business logic chỉ nằm ở Service layer.
Reason: Controller mỏng, Repository chỉ truy vấn, dễ test và audit.
Advantages: Rõ trách nhiệm, tái sử dụng rule.
Trade-offs: Service có thể dày với module phức tạp — chấp nhận, tách helper khi cần.
```

## Notes

- Phân tích trước khi giải pháp.
- Nếu chưa rõ → nêu giả định.
- Không tự mở rộng phạm vi.
- Nhiều phương án → so sánh ưu/nhược + khuyến nghị.
- Chỉ tập trung Module/Sprint đang yêu cầu.

## Checklist

- [x] Business Rules đầy đủ (DoD, doc standard)
- [x] API response chuẩn
- [x] Validation đầy đủ
- [x] Security đầy đủ
- [x] Error Handling đầy đủ
- [x] Ví dụ minh họa
- [x] Flow / mapping 23 mục ↔ chuẩn tài liệu
- [x] Design Decisions
- [x] Checklist
