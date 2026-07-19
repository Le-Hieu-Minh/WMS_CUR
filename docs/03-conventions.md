# Quy ước phát triển

## Quy trình phân tích Module (23 mục)

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

## Definition of Done

Module chỉ hoàn thành khi có đủ:

- Phân tích nghiệp vụ  
- Database Design  
- API Design  
- Frontend + Backend  
- Validation + Permission  
- API / DB / FE / BE Documentation  
- User Guide + Developer Guide  
- Unit Test + Integration Test  

## Quy tắc viết code

- JavaScript (ES6+), **không** TypeScript  
- Code sạch, dễ đọc, dễ bảo trì  
- Tách file theo chức năng  
- Không hardcode cấu hình nhạy cảm  
- Validate đầy đủ, xử lý lỗi đầy đủ  
- Feature-Based (FE), Layered (BE)  

## Permission code

```
{module}:{action}

Ví dụ: user:read, warehouse:create, product:delete
```

## Response API chuẩn

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

## Testing

| Tầng | Công cụ | Ưu tiên |
|------|---------|---------|
| Frontend | Vitest, RTL | Hooks, form validation, utils |
| Backend Unit | Jest | Service, validation, permission, inventory logic |
| Backend Integration | Supertest | Mỗi API: Success, 400, 401, 403, 404, 409, 500 |

## Phản hồi & phạm vi

- Phân tích trước khi giải pháp  
- Nếu chưa rõ → nêu giả định  
- Không tự mở rộng phạm vi  
- Nhiều phương án → so sánh ưu/nhược + khuyến nghị  
- Chỉ tập trung Module/Sprint đang yêu cầu  
