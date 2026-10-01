# Lộ trình B1/B2 — 27/09/2026

## Phạm vi đã làm

User muốn kết hợp kiến thức tham khảo từ Destination B1/B2 với app. Triển khai **hai lộ trình Little by Little tự biên soạn**, không nhập nội dung sách, không mô tả app là sản phẩm Macmillan hoặc đã có license. Đánh giá nguồn/tham khảo nằm trong DESTINATION-AND-DATABASE-REVIEW.md. Đổi chữ từ sách không phải quy trình tạo nội dung hợp lệ.

Đây là phiên bản đầu có thể dùng của hệ thống lộ trình, **chưa bao phủ toàn bộ B1/B2 hoặc toàn bộ nội dung hai sách**. Không có chứng nhận CEFR, placement test được chuẩn hóa hoặc thẩm định giáo viên độc lập.

- B1: 12 bài từ tình huống A2–B1 hiện có, thêm mục tiêu ngữ pháp, ví dụ và câu kiểm tra ngữ pháp cho từng bài.
- B2: 6 bài mới: thương lượng phạm vi công việc, phản ánh vấn đề khách sạn, đánh giá bằng chứng, giới hạn liên lạc số, lựa chọn dự án cộng đồng, trả lời phỏng vấn bằng ví dụ.
- Toàn bộ thư viện: **18 bài / 36 đoạn đọc / 18 hội thoại (108 lượt) / 90 mục từ-cụm theo bài**. Con số 90 không phải 90 lemma khác nhau; có từ gặp lại ở nhiều tình huống.
- Hai lộ trình có 18 phần giải thích ngữ pháp và **54 câu kiểm tra**: đọc hiểu, tự nhớ từ/cụm, cấu trúc.
- 16 ảnh thật có registry/credit hiện có được tái sử dụng đúng nhóm bối cảnh. B2 không có bộ ảnh mới riêng từng đoạn.

## Cách dùng

Mở `http://localhost:5173/#courses`, chọn B1/B2 và một bài. Các phần:

1. **Cấu trúc & cách dùng**: quy tắc ngắn bằng tiếng Việt, ví dụ tiếng Anh và nút loa.
2. **Flashcard**: 5 thẻ mỗi bài, lật nghĩa, ghi chú và ví dụ; nút trước/sau, loa. Không tự gán thành thạo khi lật thẻ.
3. **Đọc & hội thoại**: tái sử dụng ReadingLesson, hai đoạn đọc, từ tương tác, bản dịch và hội thoại mở từng lượt.
4. **Kiểm tra & ôn**: ba câu, có gợi ý, máy chủ chấm khi đăng nhập, lưu từng lượt và tiếp tục bài.

Menu chính, trang chủ, góc ôn và phrasal có đường dẫn tới lộ trình. Từ trang đọc có nút mở đúng bài trong lộ trình. Trong bài có nút luyện 5 câu liên quan từ catalog hiện tại, chạy StudySession thật và giữ cơ chế ôn của kho câu.

## Kết quả, account và offline

- Tài khoản: bài kiểm tra trong tab **Kiểm tra & ôn** được lưu trong bảng `lesson_attempts`. Migration 2 bổ sung `review_level` và `last_passed`, giữ lịch sử cũ. API có auth/CSRF, lấy user từ session; chấm trên server, kiểm tra version và questionId, chống ghi trùng bằng event key. ID trùng khác payload/bài trả 409.
- Câu sai hoặc dùng gợi ý: due hôm nay. Tự nhớ đúng tăng khoảng cách theo 1–3–7–14–30 ngày khi ôn qua các ngày đến hạn khác nhau; lặp trong ngày không tăng mức. Trắc nghiệm chỉ có mức 1 ngày. Đây là quy tắc khoảng cách minh bạch, chưa phải mô hình ghi nhớ được hiệu chỉnh bằng dữ liệu người học.
- Tổng quan, Ôn tập và Tiến bộ có bảng tiến độ B1/B2, hàng đợi theo bài và số ngày học gộp kho câu/hội thoại/kiểm tra, không đếm trùng ngày. XP và `phrase_progress` vẫn riêng. Xuất tài khoản có lịch sử bài kiểm tra; xóa tiến độ xóa cả lịch sử này. Import chỉ khôi phục kho câu/cài đặt, không nhập lịch sử quiz thành bằng chứng đã học. Xóa tài khoản vẫn cascade qua FK hiện có.
- Khách: chỉ giữ lượt thử trong component; rời bài/tải lại sẽ mất. Không tự đồng bộ lượt khách khi đăng nhập.
- Bài tự luyện trong ReadingLesson vẫn là bài thử chưa lưu; chỉ bài kiểm tra riêng của lộ trình mới có lưu tài khoản. Nhãn UI phân biệt hai phần này.
- Khi lỗi mạng, không báo đã lưu hoặc cho qua câu bằng kết quả giả. Có thể thử gửi lại. Khi chưa tải được tiến độ đăng nhập, không fallback âm thầm sang local.
- Nội dung, ảnh và thẻ dùng được offline sau khi PWA cache; **ghi kết quả tài khoản cần online**, chưa có queue offline cho lộ trình.

## File và kiến trúc

- `shared/reading-b2.js`: sáu bài đọc/hội thoại mới tự viết, có nguồn original.
- `shared/reading-lessons.js`: registry 18 bài cho thư viện và khóa học.
- `shared/courses.js`: syllabus, ID ổn định, version, ngữ pháp, liên kết bài đọc/catalog topic và đáp án server.
- `CourseHub.jsx`, `courses.css`: hai lộ trình, bài, flashcard, checkpoint và trạng thái lưu.
- `ReadingLibrary.jsx`: export ReadingLesson dùng chung và link sang khóa học.
- `backend/modules/lessons`: giữ routes mỏng, service chấm/quy tắc ngày ôn, repository SQL. Station lesson cũ giữ contract và lịch ôn cũ.
- API mới: GET `/api/me/courses`, GET `/api/me/courses/:lessonId`, POST `/api/me/courses/:lessonId/attempts`.

Khi đổi đáp án/câu hỏi, tăng version của bài và kiểm thử resume. Tổng quan chỉ dùng version hiện tại. Nội dung hiện là static code, chưa có CMS xuất bản hoặc phiên bản dữ liệu trong DB. Supabase migration vẫn chờ kết nối cloud; đợt này không tự đổi production DB.

## Kiểm tra và giới hạn

Cập nhật đợt hoàn thiện tiếp theo 28/09/2026: **20 unit, 22 backend/API, 29 E2E, build production và 3 offline đều qua** sau khi thêm lịch ôn, tổng quan tài khoản, nhóm phrasal, export/reset. Xem `APP-COMPLETION.md` để biết phạm vi và việc còn lại. Các kết quả bên dưới là lịch sử của bản đầu.

Chốt 28/09/2026: **17 unit, 22 backend/API, 28 E2E, build production và 3 offline đều qua**. Toàn bộ 28 E2E đã chạy lại thành công sau sửa timeout. Ngày 28/09 chạy lại build và offline trên source cuối, khởi động dev lại tại 5173/3001. Đã sửa tab hoạt động kế thừa flex-direction column và bỏ transition màu ở tab để tránh tương phản thấp giữa hai trạng thái; axe kiểm tra cả trang danh sách và checkpoint mobile/desktop qua. Đã kiểm tra trực tiếp link từ bài đọc mở đúng bài khóa học. Các lần kiểm tra trước bên dưới giữ lại làm lịch sử.

- 17 unit pass; 22 backend/API pass. Sau tách SQL về repository, kiểm thử course và station được chạy lại và pass.
- Browser: guest flashcard/quiz, hai trình độ, tài khoản reload/thiết bị thứ hai, lỗi lưu không báo thành công, layout và axe A/AA tại 390/1440 px đã pass.
- Suite cũ ban đầu có một timeout 30 giây do một test đi qua toàn bộ 18 bài (trước đây 6 bài); tăng thời gian riêng test này, chạy lại toàn bộ 18 bài và 6 test liên quan: 7/7 pass. Không thay assertion để che lỗi.
- Build production pass. PWA cache cả course bundle; test offline riêng cho thẻ B2 được bổ sung.
- Chưa push/deploy. Dev dùng PGlite vì PostgreSQL local chưa chạy; không sửa .env/secret. Mở local để review.

## Bước tiếp theo

1. Giáo viên rà ngôn ngữ, câu hỏi, độ khó và tính tự nhiên; thử người học trước khi quảng bá là chương trình đầy đủ.
2. Xây ma trận mục tiêu B1/B2 độc lập, đo phần còn thiếu (nghe, nói, liên kết ý, word formation, register) rồi mở rộng theo độ phủ, không theo số unit sách.
3. Mở rộng câu hỏi chuyển ngữ cảnh, nghe chủ động, viết có rubric và nhiều biến thể đáp án. Hiện câu tự nhớ chấm theo đáp án/normalization, không có AI chấm tự do.
4. Đã nối tổng quan, ngày học, export và lịch ôn theo quy tắc; bước tiếp theo là đo khả năng nhớ qua các ngày, thử nghiệm người học và hiệu chỉnh lịch ôn. Chưa có import lịch sử quiz hoặc hàng đợi ghi offline.
5. Tách CMS/content API khi kho lớn; thêm backup và triển khai Supabase khi có nguồn/đích được xác minh.
