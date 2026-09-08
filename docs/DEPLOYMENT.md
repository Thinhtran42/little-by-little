# Little by little: triển khai từ mã nguồn đến sản phẩm

## Kiến trúc

Browser gọi một Render Web Service Docker. Service chứa React/Vite đã build thành `dist/`, Fastify xử lý `/api/*`, và kết nối PostgreSQL bằng `DATABASE_URL`. Frontend không truy cập database trực tiếp; backend tự chấm đáp án và cập nhật tiến độ trong transaction.

`frontend/src/` là giao diện; `backend/modules/` là API; `backend/db/schema.sql` là schema PostgreSQL; `backend/db/seed.js` nạp nội dung; `backend/modules/learning/` lưu tiến độ; `shared/` chứa catalog và logic lịch ôn; `Dockerfile` build production; `render.yaml` mô tả Render Web Service và PostgreSQL.

Database có users, sessions, topics, phrases, scenarios, phrase_progress, attempts, bookmarks, personal_notes, daily_activity và audit_log.

## Chạy local

Yêu cầu Node.js 22.12+ và Docker Desktop. Chạy lần lượt: `npm ci`, `npm run setup`, `docker compose up -d --wait db`, `npm run db:migrate`, `npm run db:seed`, `npm run dev`.

Mở `http://localhost:5173`. API health ở `http://localhost:3001/api/health`; PostgreSQL local ở `127.0.0.1:54329`. Database nằm trong Docker volume `little_pgdata`; `docker compose stop` giữ dữ liệu, còn `docker compose down -v` xóa volume.

## Kiểm tra

Chạy `npm run check` và `docker build -t little-by-little:3.0.0 .`. Check gồm unit, API, browser, accessibility, build và offline PWA test.

## GitHub

Tạo repository rỗng, ví dụ `https://github.com/Thinhtran42/little-by-little`, không tạo README/license trên GitHub. Sau đó chạy: `git init -b main`, `git add .`, `git commit -m "Prepare Little by little demo"`, `git remote add origin https://github.com/Thinhtran42/little-by-little.git`, `git push -u origin main`.

Không commit `.env`, `.env.render`, `.data`, `node_modules` hoặc backup database. Nếu GitHub hỏi password, dùng Personal Access Token thay cho password và không ghi token vào remote URL.

## Render deploy

`render.yaml` tạo web service `little-by-little-demo` bằng Docker và PostgreSQL `little-by-little-demo-db`, đều Free ở Singapore. `DATABASE_URL` tự nối từ database vào service. Không tạo static site riêng: web service vừa phục vụ `dist/`, vừa xử lý `/api`, nên UI và cookie dùng cùng origin.

Trong Render Dashboard chọn **New → Blueprint**, kết nối GitHub, chọn repository và branch `main`, xác nhận `render.yaml`, rồi chọn Deploy Blueprint. Chờ database healthy và service Live. Mở URL Render cấp và kiểm tra `/api/health`.

Backend khởi động sẽ chạy schema, seed nội dung nếu chưa tồn tại, xóa session hết hạn rồi phục vụ UI. Seed không ghi đè nội dung admin đã sửa.

## Biến môi trường production

Khi chuyển database từ Render sang Supabase hoặc PostgreSQL khác, xem [DATABASE-PROVIDERS.md](DATABASE-PROVIDERS.md). Đổi URL kết nối không tự chuyển dữ liệu người dùng.

Các biến chính là `NODE_ENV=production`, `HOST=0.0.0.0`, `PORT=10000`, `DATABASE_URL`, `PUBLIC_ORIGIN`, `TRUST_PROXY=true`, `DB_POOL_SIZE=5`. Render tự tạo `DATABASE_URL`; nếu không đặt `PUBLIC_ORIGIN`, backend dùng `RENDER_EXTERNAL_URL`. Không đưa password database vào GitHub. Cookie production là Secure/HttpOnly/SameSite=Lax.

Đăng nhập Google dùng OAuth 2.0 Authorization Code flow. Đặt `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` và `GOOGLE_REDIRECT_URI` trong Render Environment; redirect URI phải đúng tuyệt đối dạng `https://little-by-little-demo.onrender.com/api/auth/google/callback`. Tạo OAuth client loại **Web application** trong Google Cloud Console và thêm domain production vào Authorized JavaScript origins nếu cần. Nếu chưa đặt các biến này, nút Google sẽ báo chưa được cấu hình và đăng nhập email/mật khẩu vẫn hoạt động.

## Kiểm tra sau deploy

Đăng ký tài khoản, lưu recovery code, học một câu, tải lại, đăng nhập ở cửa sổ khác, thử đăng xuất/đăng nhập sai, khôi phục và kiểm tra mobile. Có thể chạy browser test bằng cách đặt biến `RELEASE_URL` tới URL Render rồi chạy `npx playwright test --config playwright.release.config.js`.

## Admin và giới hạn

Sau khi tạo tài khoản, cấp admin bằng đúng database production: `node --env-file=.env.production backend/db/manage.js admin email@example.com`.

Render Free PostgreSQL phù hợp demo ngắn hạn, không phải backup dài hạn. Export dữ liệu trước khi database hết hạn và lưu backup ngoài GitHub. Web Free có thể sleep nên lần mở đầu có thể chậm.

Bản demo chưa có email verification, SMTP, thanh toán, subscription, monitoring đầy đủ hoặc load test lớn. Bản bán thật cần domain HTTPS, PostgreSQL trả phí với backup/PITR, SMTP, privacy/terms, billing, rate limit dùng chung và kiểm thử thiết bị thật.

Xem thêm: [README](../README.md), [kiến trúc](ARCHITECTURE.md), [Render](RENDER.md), [phát hành](RELEASE.md), [vận hành và CI/CD](OPERATIONS.md).
