# PostgreSQL, Render và Supabase

Kiểm tra chính sách ngày 08/09/2026; giá/hạn mức có thể thay đổi.

## Gói miễn phí

- PostgreSQL là phần mềm database, không có hạn dùng 30 ngày. **Render Postgres Free** hết hạn sau 30 ngày kể từ khi tạo: [Render Free](https://render.com/docs/free).
- Supabase Free hiện không phải trial 30 ngày: 500 MB database, tối đa 2 project active, 1 GB file storage. Project ít hoạt động có thể pause sau khoảng 7 ngày. Đây không phải bảo đảm miễn phí hoặc online vĩnh viễn: [Pricing](https://supabase.com/pricing), [Project pausing](https://supabase.com/docs/guides/platform/free-project-pausing).
- Phù hợp demo kéo dài hơn; sản phẩm cần luôn sẵn sàng và backup đáng tin cậy nên đánh giá gói trả phí. Pause database khiến backend không đọc/ghi được, cần resume trong Dashboard và kiểm tra lại health.

## Phạm vi đổi database

Render, Supabase và PostgreSQL tự host cùng dùng PostgreSQL. Ứng dụng dùng driver `pg` và SQL trực tiếp qua backend; không cần Supabase JS SDK, không cần chuyển sang Supabase Auth, frontend không kết nối database.

`connectDatabase` là composition root chọn adapter. Các service nhận contract `query/transaction/close`, repository chứa SQL. Driver được tách tại `backend/db/adapters/`; cấu hình nằm ở `backend/config/database.js`; migration nằm ở `backend/db/migrate.js`.

- Render → Supabase: đổi connection string, TLS, chuyển dữ liệu và kiểm thử trên nhà cung cấp mới; không viết lại nghiệp vụ.
- PostgreSQL → MySQL/MongoDB: cần adapter, repository và migration/schema tương ứng vì SQL hiện dùng JSONB, ON CONFLICT, DISTINCT ON và khóa PostgreSQL. Chưa hỗ trợ thay engine chỉ bằng biến môi trường. SOLID giúp cô lập thay đổi, không xóa khác biệt giữa các engine.
- PGlite dành cho dev/test và giữ dialect PostgreSQL; production luôn từ chối fallback sang database local khi cấu hình thiếu/sai.

## Biến cấu hình

```dotenv
DB_DRIVER=postgres
DATABASE_URL=postgresql://USER:URL_ENCODED_PASSWORD@HOST:5432/DATABASE
DB_SSL=true
DB_POOL_SIZE=5
DB_CONNECT_TIMEOUT_MS=10000
DB_IDLE_TIMEOUT_MS=30000
# Nếu provider yêu cầu CA riêng, mount file certificate:
# DB_SSL_CA_FILE=/etc/secrets/provider-ca.crt
```

`DB_DRIVER=auto` giữ tương thích: có DATABASE_URL chọn postgres, không có chọn PGlite (chỉ dev). Chỉ chấp nhận auto/postgres/pglite. DB_SSL bỏ trống thì giữ cấu hình URL/driver; true bật TLS và xác minh certificate, false chỉ dành kết nối nội bộ phù hợp. Khi đặt DB_SSL hoặc CA file, adapter bỏ các SSL query params trên URL để pg không ghi đè chính sách xác minh. Không dùng `rejectUnauthorized:false` để chữa lỗi certificate. [node-postgres SSL](https://node-postgres.com/features/ssl).

## Cấu hình Supabase cho backend hiện tại

1. Tạo project, chọn region gần backend và lưu password database an toàn.
2. Trong **Connect**, lấy PostgreSQL connection string. Backend chạy lâu dài dùng direct connection nếu mạng hỗ trợ; nếu môi trường chỉ IPv4, chọn **Session pooler**. Copy đúng username/host/port do dashboard cấp, không tự ghép. Direct Free thường dùng IPv6; session pooler hỗ trợ IPv4. [Connection guide](https://supabase.com/docs/guides/database/connecting-to-postgres).
3. Chưa dùng Transaction pooler cho quy trình này; dùng direct/session khi chạy schema và backup/restore. Kiểm tra TLS và certificate của provider.
4. **Trước khi tạo bảng ứng dụng, tắt Data API nếu không dùng.** Backend đang có auth/session riêng và các bảng chứa password hash/session hash; chúng không được phép truy cập qua Supabase anon/authenticated API. Nếu cần Data API sau này, chọn schema expose và RLS/grants riêng, kiểm thử truy cập trái phép. Không mặc định coi RLS hoạt động chỉ vì database ở Supabase. [Securing data](https://supabase.com/docs/guides/database/secure-data).
5. Với database thử nghiệm mới/rỗng, cấu hình env local cho kết nối thử rồi chạy `npm run db:migrate` và `npm run db:seed`. Seed chỉ tạo nội dung, không chuyển tài khoản hoặc tiến độ cũ.
6. Trong Render cập nhật DATABASE_URL, DB_DRIVER, DB_SSL và pool config; giữ nguyên Google OAuth, URL website và các secret khác. Không nhập connection string vào chat, git hoặc frontend.

Chưa tạo Supabase project hoặc đổi production trong lần chỉnh code này. Test dùng PGlite và pool giả; chưa xác minh kết nối Supabase thật.

## Chuyển dữ liệu production an toàn

Đổi DATABASE_URL **không tự chuyển dữ liệu**. Cần một đợt migration riêng:

1. Kiểm tra nguồn vẫn hoạt động trước khi Render Free hết hạn. Backup bằng PostgreSQL tools, giữ file ngoài Git, bảo vệ vì chứa dữ liệu người dùng.
2. Dựng target thử, vô hiệu Data API và giới hạn quyền như trên. Dùng pg_dump/pg_restore phù hợp phiên bản; dump các bảng ứng dụng/schema public cần thiết, không ghi đè schema auth/storage do Supabase quản lý. Không dùng `--clean` với toàn bộ database Supabase.
3. Restore không mang owner/ACL của Render sang; xử lý quyền target riêng. Khôi phục bản dump vào môi trường thử và kiểm tra số user, bài làm, bookmarks, notes, nội dung admin và liên kết Google.
4. Khi chuyển thật, tạm dừng ghi vào nguồn, tạo bản dump cuối, restore và kiểm tra rồi đổi URL backend/redeploy. Nếu không dừng ghi, sẽ có bài làm bị bỏ sót giữa hai snapshot.
5. Kiểm tra register/login, Google login, học câu, reload, xuất dữ liệu và /api/health. Giữ nguồn và backup đến khi xác nhận thành công.
6. Rollback bằng URL cũ chỉ an toàn nếu target chưa nhận thêm ghi, hoặc đã có kế hoạch đồng bộ ngược. Không đổi đi đổi lại làm phân tán dữ liệu.

Ảnh/audio có thể dùng object storage/CDN độc lập; database chỉ lưu metadata. Chưa có load test nên chưa cam kết sức chứa theo số người dùng.

## Dọn thư mục

Sau refactor, `backend/routes/` và `backend/services/` đã rỗng, chức năng chuyển vào `backend/modules/`; có thể xóa hai thư mục này. Các thư mục build/test được tái tạo theo workflow; `.data/` chứa database local và `releases/` có thể chứa bản phát hành/backup nên không xóa chỉ vì không được import.
