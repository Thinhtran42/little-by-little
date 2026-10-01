# Khóa công việc và sắp xếp danh mục

Cập nhật: 02/10/2026. Thay đổi đang ở local, chưa push hoặc deploy.

## Điều hướng

Menu chính còn sáu mục: Tổng quan, Khóa học, Thư viện, Ôn tập, Tiến bộ, Cài đặt.

- Khóa học: 4 tuần công việc, Lộ trình B1/B2, lộ trình học các mẫu câu.
- Thư viện: Khám phá chủ đề, Đọc & từ vựng, Phrasal verbs, Luyện tập, Câu đã lưu.
- Các trang con có đường quay về nhóm và liên kết sang các mục cùng nhóm. URL cũ được giữ để không làm hỏng bookmark.
- Trang chủ giảm các thẻ ảnh chủ đề; dùng hai lối vào Khóa học/Thư viện thay vì trưng toàn bộ nội dung.

## Khóa 4 tuần công việc

Mở `http://localhost:5173/#work-course`, hoặc vào Khóa học.

20 buổi, mỗi tuần 4 tình huống và 1 bài thử sức. Hai ngày còn lại dành cho ôn hoặc nghỉ; lịch không khóa theo ngày. Bốn nhóm: bắt đầu trao đổi, phối hợp mỗi ngày, xử lý vấn đề, nói rõ quan điểm.

Mỗi buổi gồm một đoạn đọc, ba cách nói, hội thoại bốn lượt mở dần, nhiệm vụ diễn đạt mở, tiêu chí tự đối chiếu và ba câu kiểm tra. Tổng cộng 20 đoạn đọc, 60 mục mẫu câu, 80 lượt thoại, 20 nhiệm vụ và 60 câu kiểm tra. Nội dung tự biên soạn; các mẫu có thể lặp lại ở buổi vận dụng.

Ba phần trong bài giữ trạng thái khi chuyển tab. Bản nháp chỉ giữ trong màn hình bài hiện tại, mất khi rời bài/tải lại; giao diện nói rõ điều này. Chưa có lưu bài viết, giáo viên phản hồi hoặc AI chấm bài mở. Gợi ý mẫu câu không được trình bày như một bài giải hoàn chỉnh.

## Lưu kết quả

- Người đăng nhập: backend chấm câu kiểm tra, lưu `lesson_attempts`, phiên bản nội dung và lịch ôn. Có xử lý retry/idempotency, không báo lưu thành công khi mạng lỗi.
- Khách: dùng thử tại màn hình, không đồng bộ tài khoản.
- API: GET `/api/me/work-course`, GET `/api/me/work-course/:lessonId`, POST `/api/me/work-course/:lessonId/attempts`.
- Tái sử dụng service/repository hiện có; không tạo database hoặc migration mới trong đợt này. Export/reset và số ngày học bao gồm các lượt làm bài này; thống kê khóa B1/B2 giữ riêng.
- Các câu đúng ở lần trả lời gần nhất không đồng nghĩa thành thạo nói/viết. Chưa có thẩm định CEFR độc lập.

## Hình ảnh

Dùng ảnh thật đã có trong registry `shared/photo-sources.js`, có nguồn, credit và file WebP local. Chọn cảnh làm việc, trao đổi, điện thoại/lịch hẹn phù hợp nhóm tình huống. Ảnh là bối cảnh minh họa; không phải ảnh mô tả chính xác mọi hành động hay nhân vật trong đoạn đọc. Không thêm ảnh trang trí vào thẻ danh mục. Không phát sinh dịch vụ ảnh hoặc TTS trả phí.

## Mã nguồn và kiểm thử

- Nội dung: `shared/work-course.js`.
- Giao diện: `WorkCourse.jsx`, `work-course.css`, `studio/StudyHubs.jsx`, `StudioWorkspace.jsx`, `StudioHome.jsx`.
- Backend: registry trong `backend/modules/lessons/lessons.routes.js`, sử dụng service khóa học hiện có.
- Test nội dung bảo đảm 20 ID, bốn tuần, cấu trúc câu hỏi/hội thoại và ảnh có nguồn.
- API test kiểm tra chấm phía server, phiên bản, retry, export và tách thống kê.
- Browser test mở đủ 20 bài, giữ bản nháp khi chuyển phần, lưu tài khoản/reload, báo lỗi lưu; kiểm tra mobile/desktop, contrast và không tràn màn hình.
- Offline test mở khóa và bài tuần cuối sau khi ứng dụng được cache; ghi kết quả tài khoản vẫn cần mạng.

## Việc tiếp theo trước kinh doanh

Thử nghiệm với người học và giáo viên, đo khả năng vận dụng sau một tuần, chỉnh đáp án chấp nhận được, hoàn thiện lưu bài viết và phản hồi; xác minh backup/restore database production. Thanh toán, entitlement và nội dung trả phí chưa được bật. Không quảng cáo khóa thử nghiệm như một cam kết đạt trình độ sau bốn tuần.

Kết quả kiểm thử ngày 02/10/2026: `npm run check` qua 24 unit, 24 API, 40 E2E, build production và 5 offline. Đã xem ảnh desktop/mobile; `git diff --check` không có lỗi whitespace.

## Tăng chiều sâu cách học — 02/10/2026

Đã thêm cho toàn bộ 20 buổi công việc:

- Một câu hỏi đọc hiểu riêng mỗi bài (20 câu mới), có lựa chọn và giải thích tiếng Việt dựa trên chi tiết của đoạn đọc. Các câu hỏi tập trung vào ý định, điều kiện, lý do và quyết định, không chỉ điền từ.
- Tab Nghe & nhớ câu: dùng 60 mục mẫu câu hiện có để nghe trước khi xem chữ, viết lại, đối chiếu, nói theo và thay chi tiết theo bản thân. Đây là 60 lượt luyện bổ sung, không phải 60 mẫu câu mới.
- Câu chưa khớp hoặc đã xem hỗ trợ được đưa vào lượt luyện riêng. Điểm lượt luyện đếm các câu khớp không mở trước; bỏ qua hoa/thường, dấu câu, khoảng trắng và kiểu dấu nháy. Không chấp nhận mọi cách diễn đạt tương đương, nên UI nói rõ đây là đối chiếu bản chép với mẫu.
- Trạng thái luyện giữ khi đổi tab nhưng chưa lưu server; không cộng vào điểm kiểm tra hoặc lịch ôn của tài khoản. Không thu âm/chấm phát âm. TTS vẫn là giọng thiết bị, có phương án mở câu để luyện đọc nếu không phát tiếng.

Mã nguồn bổ sung: shared/work-practice.js và frontend/src/components/WorkPractice.jsx. Không đổi ID/version đáp án checkpoint hay schema DB.

Ưu tiên kế tiếp: lưu lịch sử luyện nghe theo kỹ năng và gắn lịch ôn; bổ sung bài áp dụng có phản hồi giáo viên; thử nghiệm khả năng vận dụng với người học trước khi tăng ồ ạt số lượng bài. Sau khi kiểm chứng luồng mới, mở rộng sang phrasal và các chủ đề ngoài công việc. Những phần này chưa triển khai trong đợt hiện tại.

Kiểm thử phần tăng cường: 26 unit, 7 E2E liên quan, build production và 5 offline đều qua. Đã xem screenshot mobile; không có thay đổi backend trong đợt này.
