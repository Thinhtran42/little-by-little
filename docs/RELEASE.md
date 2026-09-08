# Phát hành và vận hành 3.0

## Hạ tầng

Cần Node 22.12+, PostgreSQL 17 và HTTPS. Backend phục vụ website đã build và `/api` cùng origin. `.env.example` liệt kê cấu hình; không đưa mật khẩu vào image hoặc React.

```sh
npm ci
npm run build
# Cấu hình biến môi trường bằng secret manager của nền tảng:
# NODE_ENV=production
# DATABASE_URL=postgresql://...
# PUBLIC_ORIGIN=https://ten-mien-cua-ban
# HOST=0.0.0.0
# PORT=3001
npm start
```

Hoặc build `docker build -t little-by-little:3.0.0 .` và chạy image với cùng biến môi trường. Kết nối container đến hostname PostgreSQL trong mạng triển khai, không dùng localhost của máy bên ngoài. Đặt HTTPS reverse proxy trước port 3001. `PUBLIC_ORIGIN` là origin chính xác, không có dấu `/` cuối. Cookie production luôn Secure/HttpOnly/SameSite=Lax. Chỉ bật `TRUST_PROXY=true` nếu backend chỉ nhận kết nối từ proxy tin cậy. Database cloud có CA hợp lệ có thể dùng `DB_SSL=true`.

`GET /api/health` kiểm tra database. Không cache `/api`; HTML/service worker cần revalidate. Assets có hash có thể cache dài. Không xóa localStorage khi phát hành.

Startup chạy migration và seed lặp an toàn, có khóa PostgreSQL tránh migration đồng thời. Thay đổi schema tiếp theo phải thêm migration có phiên bản; `CREATE TABLE IF NOT EXISTS` không tự sửa cột của bảng cũ.

## Sao lưu

PostgreSQL chứa tài khoản, session, bài làm, nội dung biên tập và lịch ôn; JSON cá nhân không thay thế backup database. Bật backup tự động/PITR trên nhà cung cấp và diễn tập restore vào database riêng.

Backup Docker phát triển, không truyền dữ liệu nhị phân qua PowerShell:

```sh
docker compose exec db pg_dump -U little_app -d little_english -Fc -f /tmp/little-backup.dump
docker compose cp db:/tmp/little-backup.dump ./little-backup.dump
```

Giữ dump riêng có kiểm soát truy cập, ngoài repository. Khôi phục bằng `pg_restore` vào database mới và kiểm tra bài làm/lịch ôn trước khi chuyển môi trường thật. Không dùng `--clean` trên database đang phục vụ người học.

## Kiểm tra bản phát hành

1. `npm run check`, build Docker nếu triển khai container.
2. Đăng ký trên HTTPS, giữ mã khôi phục, học một câu và đăng nhập thiết bị khác.
3. Mạng lỗi khi gửi bài: báo chưa lưu, retry không tạo lượt trùng.
4. Thử đổi mật khẩu, khôi phục, hết phiên, xuất dữ liệu và xóa tài khoản thử.
5. Admin sửa nội dung; tài khoản thường không có quyền sửa.
6. Tải lại PWA sau nâng cấp; không tự reload giữa buổi học.

## Phần chưa triển khai

- Chưa có tên miền, hosting công khai, SMTP/xác minh email, thanh toán hoặc thuê bao. Mã khôi phục là cách reset hiện có; mất cả mật khẩu và mã thì chưa có luồng tự khôi phục khác.
- Rate limit đang ở bộ nhớ mỗi instance. Nhiều API replicas cần rate limit chung tại gateway/Redis; cấu hình tổng connection pool, giám sát lỗi và cảnh báo.
- API trả snapshot tiến độ, giới hạn 5.000 lượt gần nhất cho giao diện; database giữ lịch sử bài làm. Cần phân trang/aggregate và kiểm thử tải trước khi tăng quy mô lớn. Chưa có benchmark cam kết số người dùng.
- Cần duyệt nội dung ngôn ngữ, thử micro thật trên iOS/Android và đo tiến bộ người học.

## Lỗi terminal

- `Port 5173/3001 is already in use`: dừng terminal của bản đang chạy bằng Ctrl+C; không chạy hai `npm run dev` cùng lúc.
- Docker engine chưa mở: bật Docker Desktop, chờ engine ready rồi `docker compose up -d --wait db`.
- API không kết nối PostgreSQL: kiểm tra `docker compose ps`, `.env` và port 54329; không đăng mật khẩu lên log/chat.
- Chỉ chạy Vite: dùng `npm run dev` từ thư mục gốc để chạy cả API.
- Sau khi sửa backend, khởi động lại `npm run dev`; frontend có HMR tự động.
