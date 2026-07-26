# Sprint 3 – Docs / Test / Deploy

## Documentation checklist

- [ ] Cập nhật `docs/README.md` + `docs/02-sprint-plan.md`
- [ ] Docs đủ 4 module Sprint 3
- [ ] Swagger đủ endpoint mới
- [ ] README root: env, seed, scripts deploy

## Testing checklist

- [ ] Unit: ST/SA confirm logic, report calc, audit sanitize
- [ ] Integration: ST/SA/Report/Audit happy + 401/403/404/409
- [ ] FE: schemas + critical forms
- [ ] Smoke: login → GR confirm → GI confirm → ST → SA → Report export → Audit list

## Deploy (khuyến nghị MVP cá nhân)

| Thành phần | Gợi ý |
|------------|--------|
| PostgreSQL | Managed (Supabase/Neon/Railway) hoặc VPS |
| Backend | Railway / Render / VPS (Node 20) |
| Frontend | Vercel / Cloudflare Pages / Nginx static |
| R2 | Cloudflare R2 (đã scaffold) |
| Env | `DATABASE_URL`, JWT secrets, `CORS_ORIGIN`, R2 keys |

### Bước deploy tối thiểu

1. `prisma migrate deploy` (hoặc `db push` nếu chấp nhận)  
2. `npm run db:seed`  
3. Build FE → trỏ `VITE_API_BASE_URL`  
4. Health check `/api/v1/health` + login admin  

## Definition of Done Sprint 3

- 4 module nghiệp vụ hoàn thành theo DoD  
- Báo cáo export được Excel + PDF  
- Audit log ghi được sự kiện then chốt  
- Tài liệu + hướng dẫn chạy production  
