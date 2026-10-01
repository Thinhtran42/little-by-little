# Hoàn thiện luồng học — 28/09/2026

## Bản local hiện tại

Mục tiêu đợt này là nối bài học vào vòng học → kiểm tra → lưu tài khoản → ôn lại → xem tiến bộ. Đây chưa phải tuyên bố sản phẩm đã hoàn thiện mọi yêu cầu thương mại.

- 18 bài tự biên soạn B1/B2, 36 đoạn đọc, 18 hội thoại, 90 mục từ theo bài, 54 câu kiểm tra, flashcard và 16 ảnh thật có nguồn. Kho câu cũ có 640 mục. Không nhập nội dung Destination hoặc tuyên bố có bản quyền hai sách.
- Trang chủ có gợi ý bài tiếp theo/đến hạn. Ôn tập và Tiến bộ có kết quả B1/B2 cùng ngày học toàn tài khoản; mỗi ngày chỉ đếm một lần.
- Phrasal verb có bốn nhóm tình huống: đời sống, di chuyển, quan hệ và công việc. Thẻ mở đúng bài có ngữ cảnh, từ vựng, hội thoại và kiểm tra; giữ các truyện cũ.
- Backend chấm và lưu từng câu. Sai/gợi ý ôn hôm nay; tự nhớ đúng tăng khoảng cách 1–3–7–14–30 ngày qua các ngày đến hạn. Lặp trong cùng ngày không tăng mức; trắc nghiệm không tăng mức tự nhớ.
- Xuất dữ liệu tài khoản gồm kho câu và lịch sử quiz; snapshot được lấy trong transaction khóa user. Import chỉ phục hồi kho câu/cài đặt, UI ghi rõ không khôi phục lịch sử quiz đã xác minh. Xóa tiến độ xóa cả quiz, chỉ trong tài khoản hiện tại.
- Màn hình lỗi mạng có thử lại; không báo lưu thành công khi chưa lưu. Khách chỉ thử bài trong phiên màn hình. Tài khoản cần mạng để ghi kết quả.

## Kiến trúc và dữ liệu

`shared/course-review.js` giữ quy tắc thuần để kiểm thử. `backend/modules/lessons` tách route/service/repository; nội dung versioned nằm ở `shared/courses.js`. `LearningOverview` lấy API theo account, hủy request khi rời màn hình và tạo lại state khi đổi user. Không cộng kết quả quiz vào chỉ số kho câu để tránh đổi nghĩa các chỉ số cũ.

Migration 2 trong `backend/db/schema.sql` thêm `review_level` và `last_passed` vào `lesson_attempts`, không xóa dữ liệu. Bản ghi cũ mặc định mức 0; lịch sử không bị coi là đã đạt mức cao. Migration chạy lặp an toàn trong kiểm thử PGlite. Station lesson giữ quy tắc ôn cũ.

Local: `http://localhost:5173/#courses`, API cổng 3001; DB PGlite chỉ cho phát triển. Chưa chuyển Supabase, chưa push/deploy trong đợt này. Không thay `.env` hoặc dùng thông tin thanh toán.

## Kiểm thử và nghiệm thu

Kết quả chốt ngày 28/09/2026: `npm run check` qua toàn bộ **20 unit, 22 backend/API, 29 E2E, build production và 3 offline**. `npm audit --omit=dev` báo 0 lỗ hổng dependency production tại thời điểm kiểm tra; đây không thay thế security audit toàn hệ thống. Test DB dùng PGlite và contract PostgreSQL, chưa xác minh Supabase thật.

Chạy `npm run check` để kiểm tra unit, API, trình duyệt, build và offline. Test bao gồm phân tách user, auth/CSRF, chống gửi trùng, migration lặp, export/reset, tải lại/thiết bị thứ hai, lỗi lưu, phrasal mở đúng bài, mobile/desktop và accessibility các màn hình khóa học. Test lịch ôn kiểm tra mốc ngày, gợi ý, trắc nghiệm và lặp cùng ngày.

Tự nghiệm thu: đăng nhập → mở một bài B2 → flashcard → làm quiz → quay Trang chủ/Ôn tập/Tiến bộ → xuất bản sao lưu. Chỉ thử xóa tiến độ trên tài khoản thử nghiệm vì thao tác này xóa dữ liệu của tài khoản đó.

## Việc còn lại trước vận hành thật

| Ưu tiên | Việc cần làm | Điều kiện hoàn tất |
| --- | --- | --- |
| P0 | Xác minh DB production và chuyển Supabase nếu chọn | Có kết nối nguồn/đích; backup, chạy migration staging, đối chiếu số bản ghi và thử khôi phục; chưa có đủ kết nối để làm |
| P0 | Release và rollback | Backup DB trước migration; CI qua; chạy migration tương thích; kiểm tra đăng nhập/ghi/đọc/export trên staging rồi production; giữ bản build trước để rollback ứng dụng |
| P0 | Rà nội dung với giáo viên/người học | Kiểm tra độ tự nhiên, đáp án thay thế, mức độ khó; không quảng cáo bao phủ toàn bộ B1/B2 hiện tại |
| P1 | Email vận hành và chất lượng giọng đọc | Xác minh nhà cung cấp, địa chỉ nhận, quota và ngân sách; chưa bật dịch vụ trả phí trong đợt này |
| P1 | Đo hiệu quả học | Theo dõi nhớ lại sau 1/7/30 ngày, câu sai phổ biến và tỷ lệ quay lại với đồng ý thu thập phù hợp; hiệu chỉnh lịch ôn bằng dữ liệu |
| P1 | Bổ sung bài luyện nghe/viết và biến thể câu hỏi | Có rubric, nhiều ngữ cảnh mới và kiểm thử đáp án; chưa dùng AI chấm tự do |
| P2 | CMS và quy trình biên tập | Bản nháp → rà soát → xuất bản version; ghi nguồn/giấy phép/ảnh và giữ tương thích tiến độ |
| P2 | Đồng bộ offline và phục hồi đầy đủ | Thiết kế hàng đợi chống trùng/xung đột và import lịch sử có kiểm chứng; bản xuất hiện tại là archive cho quiz |

Không tự tạo chi phí, không tuyên bố đã migrate cloud hoặc đã thử khôi phục production khi chưa thực hiện. Tách backend/database/UI hosting khi triển khai theo cấu hình thực tế; không cần viết lại toàn bộ app chỉ để đổi PostgreSQL provider.
