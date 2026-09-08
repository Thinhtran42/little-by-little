# Little by little 3.0

Ứng dụng React học tiếng Anh cho người Việt, với API Fastify và PostgreSQL. Có tài khoản, đồng bộ tiến độ, chấm bài trên máy chủ và quản trị nội dung. Bản này chạy tại máy; chưa triển khai công khai hoặc thu tiền.

## Chạy tại máy

Node.js 22.12+ và Docker Desktop đang chạy:

```sh
npm ci
npm run setup
docker compose up -d --wait db
npm run db:migrate
npm run db:seed
npm run dev
```

Mở **http://localhost:5173**. Một lệnh `dev` chạy API ở 3001 và React ở 5173; báo lỗi nếu cổng bị chiếm, không tự đổi cổng. `setup` tạo mật khẩu database ngẫu nhiên vào `.env`, giữ nguyên nếu tệp đã tồn tại. Không đưa `.env` vào Git hoặc gửi cho người khác.

PostgreSQL 17 lưu trong Docker volume `little_pgdata`; dừng app hoặc Docker không xóa dữ liệu. Không dùng `docker compose down -v` khi muốn giữ dữ liệu. Nếu không có `DATABASE_URL`, môi trường phát triển dùng PostgreSQL nhúng PGlite tại `.data/postgres`; production bắt buộc PostgreSQL riêng.

## Luồng học

- 640 mục / 16 chủ đề, mỗi chủ đề 24 câu, 8 phrasal verbs và 8 cách nói; 128 bài nhỏ và 16 hội thoại có tổng 48 lượt đáp.
- Chọn mục đích học, nhịp 5/10/15 câu mới mỗi ngày; ưu tiên câu đến hạn. Xem/nghe mẫu → ẩn đáp án → tự viết → phản hồi → luyện lại câu sai.
- Tick là **đã xem**. Nhận diện và gợi ý không tạo mức nhớ độc lập; nhớ vững cần viết/nghe thành công qua nhiều ngày. Khoảng ôn: 1, 3, 7, 14, 30, 60 ngày; lặp trong ngày không tăng bậc.
- Máy chủ kiểm tra đáp án thực tế, không nhận kết quả `correct` từ client. Chấm theo mẫu và đáp án thay thế đã biên tập; chưa chấm mọi cách dịch đúng hoặc phát âm tự động.
- Theo dõi câu khó, độ chính xác, lịch học; ghi chú, lưu câu và ghi âm tối đa 45 giây để tự đối chiếu. Bản ghi âm không tải lên server.

## Tài khoản và dữ liệu

Vào **Cài đặt → Tạo tài khoản**. Mật khẩu ít nhất 12 ký tự; lưu mã khôi phục hiện một lần. Có đăng nhập, đăng xuất, đổi mật khẩu, khôi phục bằng mã, xóa tài khoản và xuất/nhập tiến độ. Chưa cấu hình xác minh hoặc gửi email.

Tiến độ tài khoản lưu trong PostgreSQL và tải trên thiết bị khác; tự làm mới khi quay lại cửa sổ, có mạng hoặc sau 30 giây. Chế độ dùng thử lưu riêng trong localStorage. Chuyển tiến độ dùng thử vào tài khoản cần xác nhận thay thế; câu nhập được coi là đã xem, phải kiểm tra lại mức nhớ.

Mất mạng: tài khoản báo lưu thất bại và cho thử lại. Chế độ dùng thử có thể học ngoại tuyến sau khi tải PWA. Không có hàng đợi đồng bộ tài khoản ngoại tuyến. API và tiến độ cá nhân không nằm trong service-worker cache.

## Cấu trúc

```text
frontend/src/             React, màn hình học, state và API client
frontend/public/          Icon và thông báo giấy phép
backend/modules/          API tài khoản, học tập, quản trị
backend/modules/learning/        Lưu tiến độ và snapshot nhất quán
backend/db/schema.sql    Bảng, khóa ngoại, chỉ mục, migration v1
shared/                  Nội dung seed và hàm chấm/lập lịch thuần
backend/tests/           Auth, phân quyền, giao dịch, chấm bài
e2e/                    Trình duyệt, tài khoản, ngoại tuyến
```

Frontend/backend tách trong một repository; có thể triển khai cùng một server hoặc tách qua reverse proxy `/api`. Frontend không truy cập database trực tiếp. Xem [kiến trúc](docs/ARCHITECTURE.md).

## Biên tập nội dung

Tạo tài khoản bình thường, sau đó cấp quyền từ máy chủ:

```sh
node --env-file-if-exists=.env backend/db/manage.js admin email-cua-ban@example.com
```

Tải lại Cài đặt để sửa câu, nghĩa, ngữ cảnh và đáp án thay thế. API kiểm tra quyền admin, phiên bản nội dung và ghi nhật ký thay đổi. Thêm câu/chủ đề bằng ID ổn định trong `shared/catalog.js` hoặc `shared/content-expansion.js`, rồi chạy `npm run db:seed`. Seed chỉ thêm mục chưa có, không ghi đè câu đã biên tập trong database.

## Kiểm tra và triển khai

```sh
npx playwright install chromium
npm run check
docker build -t little-by-little:3.0.0 .
```

`check` chạy unit, API, trình duyệt, build và offline. Test API dùng PostgreSQL nhúng riêng trong bộ nhớ; test tài khoản trình duyệt dùng backend đang chạy và dọn tài khoản thử sau khi xong. Test micro dùng thiết bị giả Chromium.

Production phục vụ `dist` và API qua backend (`npm start` với `NODE_ENV=production`, `DATABASE_URL`, `PUBLIC_ORIGIN`). Không chỉ upload `dist` nếu cần tài khoản. Có Dockerfile đa giai đoạn, runtime không chạy bằng root. Xem [triển khai và vận hành](docs/RELEASE.md).

Đây là nền tảng cho bản beta có tài khoản, chưa phải cam kết chịu tải lớn hoặc đã chứng minh cải thiện giao tiếp. Xem [định hướng sản phẩm](docs/PRODUCT.md) về đo hiệu quả học và giới hạn.


Hướng dẫn tổ chức backend và thêm module: [BACKEND-STRUCTURE.md](docs/BACKEND-STRUCTURE.md).
