# Destination và database — kiểm tra 27/09/2026

## Quyết định nội dung đề xuất

Nên dùng Destination B1/B2 làm tài liệu đối chiếu khi thiết kế chương trình. Không coi hai sách là kho đoạn văn/bài tập có thể nhập thẳng vào ứng dụng thương mại. Phạm vi đã xem: mục lục B1/B2 và sample B2 chính thức; chưa đọc toàn bộ hai cuốn, chưa audit từng từ trong sách.

- B1 có 42 unit, đan xen ngữ pháp, từ vựng và các lượt ôn. Phù hợp đối chiếu phần nền tảng, chủ đề gần đời sống và cấu trúc câu của app.
- B2 có 28 unit, tăng độ phức tạp ngữ pháp và có các nhóm phrasal verbs, collocations, word patterns, word formation. Phù hợp nhánh nâng cao, tránh đưa toàn bộ vào luồng nhập môn.
- Đây là nhận định thiết kế sản phẩm: chương trình của app nên bắt đầu từ việc người học cần làm được (đổi lịch, giải thích sự cố, xin hỗ trợ), rồi chọn từ/cấu trúc phù hợp. Không sao chép thứ tự unit hoặc danh sách tuyển chọn của sách thành chương trình riêng.

Nguồn chính thức đã đọc:

- [B1 scope and sequence](https://www.macmillanenglish.com/api/fileadmin/user_upload/Catalogue/Samples/Destination/Destination_B1_Scope_and_Sequence.pdf)
- [B2 scope and sequence](https://www.macmillanenglish.com/api/fileadmin/user_upload/Catalogue/Samples/Destination/Destination_B2_Scope_and_Sequence.pdf)
- [B2 sample](https://www.macmillanenglish.com/api/fileadmin/user_upload/Catalogue/Samples/Destination/Destination_B2_Units_1-2_The_Past_Tense.pdf)
- [Macmillan Custom Publishing and Licensing](https://www.macmillanenglish.com/us/catalogue/custom-publishing-and-licensing): có cấp phép nội dung để bên thứ ba thích nghi; quyền trích văn bản/hình ảnh do Springer Nature Rights & Permissions quản lý. Mua sách không tự cấp quyền tái xuất bản nội dung trong app. Nếu muốn dùng nội dung cụ thể, cần quyền bao gồm app thương mại và các hình thức thích nghi dự kiến. Không gửi email xin phép trong lần kiểm tra này.

Không import scan/PDF, đáp án, đoạn văn, hình ảnh hay giải thích của sách; không dùng AI thay từ đồng nghĩa để biến chúng thành nội dung “của mình”. Ghi nguồn không thay thế quyền sử dụng. Bài mới cần viết độc lập hoặc dùng nguồn có quyền phù hợp, có biên tập và lưu provenance.

## Áp dụng cho Little by Little

| Nhóm nội dung | B1 của app | B2 mở rộng |
| --- | --- | --- |
| Du lịch | Hỏi đường, nhận phòng, đổi lịch | So sánh lựa chọn, trình bày khiếu nại |
| Công việc | Giao việc, hỏi lại, xác nhận hạn | Thương lượng, giải thích ưu tiên, trình bày rủi ro |
| Học tập | Hỏi nghĩa, ghi chú, tóm tắt | Đánh giá lập luận, diễn đạt quan điểm có điều kiện |
| Đời sống | Mua sắm, cuộc hẹn, thói quen | Nêu lý do, cân nhắc đánh đổi và sắc thái lịch sự |

Đây là thiết kế mới đề xuất, không phải bản sao mục lục sách. Với mỗi bài: mục tiêu giao tiếp → 5–8 nghĩa từ/cụm chủ động → cách kết hợp từ và cấu trúc → hai ngữ cảnh đọc → hội thoại → bài tự nhớ → vận dụng sang tình huống khác. Số lượng và độ dài cần thử với người học, không tự gọi là được chứng nhận CEFR.

Đợt đầu nên rà 12 bài hiện có: cách dùng tự nhiên, độ khó, từ cần học xuất hiện lại có ý nghĩa, distractor hợp lý và lỗi người Việt dễ gặp. Sau đó mở rộng từng chủ đề. Destination giúp phát hiện lỗ hổng về cấu trúc/độ phủ; sách không thay thế nguồn đọc, ảnh, luyện nói và theo dõi khả năng nhớ.

## Database: bằng chứng kiểm tra

- Code dùng PostgreSQL qua `pg`, có adapter PGlite cho dev. Đã có TLS verification, pool config, transaction và advisory lock cho migration. Supabase vẫn là PostgreSQL nên không cần đổi ORM, Auth hay frontend SDK.
- `.env` hiện trỏ PostgreSQL local; probe trả `ECONNREFUSED`. Điều này chỉ nói server local không lắng nghe, không chứng minh database production hỏng.
- Không có DATABASE_URL production hoặc cấu hình Supabase trong các file env đã kiểm tra. Có Render API key local nhưng các truy vấn danh sách services/postgres trả HTTP 400, không có dữ liệu dùng được. Không kết luận key hết hạn vì chưa đủ bằng chứng.
- Probe `https://little-by-little-demo.onrender.com/api/health` không nhận được phản hồi trong 20 giây. Cold start/mạng/sự cố đều còn khả năng; chưa xác định nguyên nhân.
- Đọc PGlite `.data/postgres` khi không có process lắng nghe dev: 1 user, 1 learner_settings, 1 session; 16 topics, 640 phrases, 16 scenarios. attempts, phrase_progress, bookmarks, personal_notes, daily_activity, scenario_attempts, lesson_attempts, audit_log đều 0. Chỉ lấy số đếm, không in email/password/session. **Đây là dữ liệu local, không phải production.**
- Bộ 12 bài đọc và ảnh vẫn nằm trong shared/frontend; chuyển DB không tự đưa chúng vào DB hoặc đồng bộ kết quả mới.
- Không chạy migration/seed trên cloud, không đổi DATABASE_URL, không tạo hoặc xóa database.

## Có nên Supabase?

Nếu production còn dùng Render Postgres Free thì nên chuyển trước hạn: [Render Free](https://render.com/docs/free) nêu DB hết hạn 30 ngày. Ngày tạo thực tế của DB chưa xác minh được, không tính hạn từ ngày viết tài liệu.

[Supabase Free](https://supabase.com/docs/guides/platform/billing-on-supabase) có 500 MB/database; không phải trial 30 ngày. Project ít hoạt động có thể [pause sau 7 ngày](https://supabase.com/docs/guides/platform/free-project-pausing). [Free cần tự xuất backup định kỳ](https://supabase.com/docs/guides/platform/backups). Hợp demo, không cam kết online vĩnh viễn hoặc đủ sức chứa sản phẩm trả phí. Ảnh/audio nên ngoài database; hiện ảnh local đã phù hợp nguyên tắc này.

## Migration: đã chuẩn bị, chưa thực hiện

1. Tạo/chọn project Supabase; lấy **Direct hoặc Session pooler** trong Connect. Session pooler phù hợp mạng IPv4; dùng đúng host/username được cấp. Tham khảo [connection guide](https://supabase.com/docs/guides/database/connecting-to-postgres).
2. Copy `.env.supabase.example` thành `.env.supabase`, điền kết nối ở máy, không đưa secret vào chat/Git/frontend. Đã mở rộng gitignore `.env.*` và giữ các example. Gitignore không bảo vệ file đã tracked; kiểm tra `git ls-files` trước push.
3. Vì backend tự quản lý tài khoản/session, **tắt Data API trên project dành riêng cho app trước tạo bảng**, hoặc cấu hình exposed schema/quyền/RLS riêng và kiểm chứng truy cập. Không để bảng users/sessions public qua API. Giữ TLS verification; nếu lỗi CA, cấu hình certificate, không tắt xác minh. Không cần publishable/service-role key ở frontend.
4. Xác minh nguồn production và backup trước. Máy hiện không có pg_dump/pg_restore trong PATH; có docker CLI nhưng chưa xác minh Docker daemon. Cần PostgreSQL client tương thích phiên bản nguồn. Không lấy local 1 user thay cho production.
5. Backup chỉ các bảng ứng dụng trong public (danh sách trong backend/db/schema.sql); không động tới auth/storage của Supabase. Với nguồn đã có user, dump schema+data và restore vào target rỗng bằng `--no-owner --no-privileges`; không `--clean` toàn database. Backup nằm ngoài Git, vì chứa thông tin tài khoản.
6. `db:migrate` + `db:seed` chỉ áp dụng tạo app mới/rỗng đã xác minh; **seed không chuyển tài khoản/tiến độ**. Với target restore, chạy migration còn thiếu sau restore, rồi đối chiếu số hàng từng bảng, FK, liên kết OAuth, hash mật khẩu và tiến độ. Không in dữ liệu nhạy cảm ra log.
7. Chuyển thật: dừng ghi nguồn → dump cuối → restore → đối chiếu → cấu hình Render dùng target → kiểm tra health/login/OAuth/lưu tiến độ/reload. Giữ nguồn và backup; không xóa database cũ. Rollback sau khi target có dữ liệu mới cần đồng bộ ngược, không đổi URL tùy tiện.

Chưa thể thực hiện bước chuyển thật khi thiếu target Supabase và truy cập nguồn production. User đã cho phép chuyển nếu cần; khi có kết nối hợp lệ thì tiếp tục chuẩn bị/kiểm chứng, không hỏi lại quyền cho công việc đã được giao. Không tạo project trả phí khi chưa được yêu cầu.
