# Cấu trúc backend JavaScript

Backend dùng JavaScript ESM, Fastify và PostgreSQL; chia module theo tính năng. Không cần đổi framework hoặc dùng class cho mọi đối tượng. Factory function nhận dependency rõ ràng giúp kiểm thử service không cần HTTP server.

```text
backend/
  index.js                      # Khởi động, migrate/seed, listen, shutdown
  app.js                        # Ghép plugin, guard và module; không listen
  config/index.js               # Đọc cấu hình runtime; không log secret
  config/database.js            # Driver, URL, TLS, pool và timeout database
  common/
    errors.js                   # Lỗi nghiệp vụ và kiểm tra input cơ bản
    security.js                 # Password hash, token, CSRF, safeUser
  http/
    auth-guard.js               # Session, origin, CSRF, quyền truy cập route
    error-handler.js            # Chuyển lỗi sang HTTP JSON
  db/
    index.js                    # Factory chọn adapter; giữ API connectDatabase
    adapters/postgres.js        # pg pool, transaction, TLS, DATE parser
    adapters/pglite.js          # Database PostgreSQL nhúng cho dev/test
    migrate.js                  # Chạy schema trong transaction
    types.js                    # Contract JavaScript qua JSDoc
    schema.sql                  # Schema hiện tại
    seed.js                     # Nạp catalog
    manage.js                   # CLI migrate/seed/admin
  modules/
    auth/
      auth.routes.js            # URL, rate limit và route public/private
      auth.controller.js        # Cookie, redirect, HTTP status, response
      auth.service.js           # Tài khoản, session, password, Google identity
      auth.repository.js        # SQL tài khoản và session
      google.provider.js        # Trao đổi code và xác minh danh tính Google
    catalog/
      catalog.routes.js         # HTTP ETag/304
      catalog.service.js        # Catalog và fingerprint
      catalog.repository.js     # SQL đọc nội dung
    learning/
      learning.routes.js        # Chuyển input và user xác thực cho service
      learning.service.js       # Chấm, chống ghi trùng, commands, import/reset
      learning.repository.js    # SQL cập nhật tiến độ, bài làm, hội thoại
      progress.repository.js    # Đọc snapshot, lock, lưu/import state
    admin/
      admin.routes.js
      admin.service.js          # Quyền admin, revision, transaction biên tập
      admin.repository.js       # SQL nội dung và audit
  tests/
    api.test.js                 # Hợp đồng API và bảo mật hiện có
    modules.test.js             # Service độc lập HTTP và OAuth adapter contract
```

## Luồng xử lý

`HTTP → auth guard → route/controller → service → repository → database`

Provider là adapter gọi hệ thống ngoài. `google.provider.js` xử lý giao tiếp Google; controller chỉ quyết định cookie và redirect; service tạo/lấy user và session.

Route ngắn có thể trực tiếp map `req.body`, `req.user`, `req.params` sang service. Chỉ tách controller riêng khi có nhiều xử lý HTTP như cookie/redirect; không tạo lớp trung gian rỗng chỉ để đủ thư mục.

## Quy tắc khi thêm tính năng

1. Tạo module dưới `modules/<feature>` và đăng ký trong `app.js`.
2. Service nhận dữ liệu thuần: `{ actor, input, params }`; không nhận Fastify request/reply. `actor` do guard xác thực, không lấy từ body do client gửi.
3. Kiểm tra input và quyền ngay trong service để lời gọi không qua HTTP vẫn được bảo vệ. Kiểu HTTP/schema có thể bổ sung sau; không tin input chỉ vì đến từ frontend.
4. Repository chứa SQL có tham số và nhận connection hoặc transaction cùng các tham số có tên. Không nối chuỗi input thành SQL.
5. Service sở hữu transaction. Mọi repository trong thao tác nguyên tử phải nhận cùng `tx`, không mở kết nối khác hoặc transaction lồng nhau.
6. Service trả dữ liệu nghiệp vụ. Controller xử lý HTTP; session token nội bộ phải được tách khỏi JSON response và chỉ đặt trong HttpOnly cookie.
7. Thay đổi hệ thống ngoài thông qua provider được inject để test không cần credential thật.
8. Dùng `fail(...)` cho lỗi dự kiến; error handler chuyển lỗi chưa xử lý thành thông báo an toàn. Không log config/token/password.
9. Thêm test hành vi, rollback, quyền và trường hợp lặp lại; không chỉ test rằng một wrapper gọi wrapper khác.

Không dùng generic BaseRepository, service locator, singleton database hoặc event bus khi chưa có nhu cầu. Repository hiện trả shape `{rows}` của adapter để giảm rủi ro khi refactor; nếu đổi shape, thực hiện theo module và cập nhật test.

## Chạy và kiểm tra

Các lệnh cũ giữ nguyên: `npm run dev`, `npm start`, `npm run db:migrate`, `npm run db:seed`, `npm run test:api`. Dockerfile và Render vẫn khởi động `backend/index.js`.

`createApp({db, config, googleProvider})` cho phép kiểm thử với database nhúng và provider giả. Production dùng adapter thật. `app.js` không tự mở port hoặc tự tạo database, nên test có thể tạo nhiều app độc lập.

Schema và dữ liệu production không thay đổi trong lần refactor này. Không deploy chỉ để cập nhật cấu trúc local khi chưa yêu cầu.

## Những phần chưa được giải quyết bởi refactor

- Google tự liên kết theo email, như đã nêu trong PRODUCT-REVIEW, vẫn cần thay đổi chính sách và migration/test riêng. Tách module không tự khắc phục lỗ hổng nghiệp vụ.
- Chưa chuyển schema sang migration tăng dần có version chạy đúng một lần.
- Chưa có hệ thống schema input thống nhất hoặc type checking toàn backend. Có thể bổ sung JSDoc/checkJs từng module, thay vì bật strict đồng loạt mà không sửa lỗi.
- `progress.repository.js` vẫn là adapter snapshot gồm chuyển đổi dữ liệu và import cũ; khi mở rộng lesson/sense progress, nên thay theo chức năng và giữ tương thích ID.
- Runtime config của auth/server và database đã tách vào `config/`. Factory database đọc cấu hình rồi truyền xuống adapter; vẫn giữ tham số override cho CLI/test.

Ưu tiên tiếp theo: sửa chính sách account linking → chuẩn hóa validation → migration có phiên bản → module lesson/attempt phục vụ bài đọc mới.

Hướng dẫn đổi nhà cung cấp, TLS và chuyển dữ liệu: [DATABASE-PROVIDERS.md](DATABASE-PROVIDERS.md).
