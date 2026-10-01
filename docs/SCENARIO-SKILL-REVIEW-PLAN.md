# Nâng cấp tình huống, lịch ôn theo kỹ năng và định vị sản phẩm

Ngày: 02/10/2026. Đây là đề xuất sau khi kiểm tra source, chưa phải chức năng đã triển khai.

## Thực trạng

ProductPages.jsx có mục “Tiếng Anh trong một tình huống thật”: 16 hội thoại có hướng dẫn, mỗi bài 3 lượt chọn đáp án, âm thanh thiết bị, giải thích và kết quả kịch bản. Chưa phải hội thoại mở hay mô phỏng có nhánh phản hồi theo lời nói tự do. Không nên gọi điểm chọn đáp án là khả năng giao tiếp.

Khóa công việc có 20 bài, nhiệm vụ mở, 60 checkpoint, 20 câu đọc hiểu mới và nghe–viết lại 60 mẫu có sẵn. Hai hoạt động mới chỉ giữ trạng thái màn hình. lesson_attempts lưu checkpoint theo bài/phiên bản/câu hỏi; course-review.js áp dụng khoảng 1/3/7/14/30 ngày, sai/hỗ trợ quay lại hôm nay, không tăng cấp vì lặp trong ngày. Chưa có trạng thái trí nhớ tách theo kỹ năng. Không coi công thức này là mô hình đã được hiệu chỉnh.

## Trải nghiệm đề xuất

Tổ chức theo việc cần làm: hỏi rõ yêu cầu, dời lịch, nhờ giúp, báo chậm, xử lý mua hàng; mỗi thẻ ghi mục tiêu, mức hỗ trợ, thời lượng và tình trạng ôn. Mỗi bài bắt đầu bằng vai trò, người đối thoại, ràng buộc và mục tiêu cụ thể.

Ví dụ: khách muốn nhận hàng thứ Sáu nhưng hàng chỉ đến thứ Hai. Người học cần báo chậm, xin lỗi, đưa lựa chọn và xác nhận quyết định. Ba vòng tăng mức độc lập:

1. Có hướng dẫn: chọn lời đáp, xem giải thích về ý nghĩa/sắc thái, so sánh cách nói phù hợp với khách hoặc đồng nghiệp.
2. Bớt hỗ trợ: nghe trước khi nhìn chữ, tự viết một câu, rồi xem mẫu và tiêu chí; không ép mọi câu tự viết phải trùng một chuỗi.
3. Tình huống biến thể: khách không đồng ý ngày mới; thay dữ kiện và yêu cầu người học vận dụng, không lặp nguyên đáp án.

Bản đầu dùng nhánh do biên tập viên viết, 4–6 lượt có lý do chuyển nhánh. Chưa cần AI tự sinh mọi cuộc nói chuyện. Không kéo dài chỉ để tăng thời gian sử dụng. Game phù hợp: hoàn thành nhiệm vụ, phát hiện hiểu nhầm, sửa lời nhắn thiếu thông tin; tránh chấm thắng chỉ vì nhanh.

Ảnh nên cung cấp dữ kiện: lịch hẹn, menu, biển chỉ dẫn, nhãn hàng, hoá đơn giả lập, đoạn chat mô phỏng. Kết hợp ảnh thật có quyền sử dụng và tài liệu HTML có thể đọc bởi screen reader. Ghi rõ tài liệu mô phỏng, không lấy dữ liệu khách hàng thật. Không thêm ảnh stock chỉ để lấp chỗ trống. Âm thanh cần được duyệt phát âm/nhịp đọc và có transcript mở khi cần.

## Nối lịch ôn

Đơn vị ôn là mục tiêu ngôn ngữ cụ thể, theo nghĩa/bối cảnh, không phải nguyên bài. Ví dụ ask-to-reschedule: comprehension / listening / recall / transfer. Hiểu qua trắc nghiệm không tự nâng trạng thái nghe hoặc tự tạo câu. Nghe–chép còn phụ thuộc chính tả; không dùng nó làm chỉ số nghe tổng quát hoặc phát âm.

Đề xuất bảng mới:
- practice_attempts: user_id, content_id, content_version, skill, exercise_id, exercise_version, event_key, answer, outcome, assistance, grading_method, created_at, study_day.
- skill_review_state: user_id, content_id, content_version, skill, due_day, review_level, last_success_day, last_attempt_id. Unique theo user/content/version/skill; index user_id/due_day.

Thêm bằng migration có version, giữ nguyên các bảng cũ. Map các câu hỏi cũ sang mục tiêu rõ ràng khi có bằng chứng; không suy diễn rằng lịch sử choice chứng minh đã nghe/nói được. Nội dung đổi đáng kể cần phiên bản mới; chỉnh lỗi trình bày không nên vô cớ xoá tiến độ.

POST attempt: xác thực/CSRF/rate limit; server đọc đáp án từ registry, chấm phần xác định được; transaction ghi attempt và cập nhật state; unique event_key chống retry nhân đôi; isolation theo user. Client không được gửi correct=true để tự cộng điểm. Bài mở lưu pending/self-reviewed/teacher-reviewed riêng, không mặc định passed. Không thu audio ở giai đoạn đầu; nếu có sau này cần retention, quyền truy cập và xoá dữ liệu rõ ràng.

Bắt đầu bằng quy tắc khoảng cách hiện có, áp dụng riêng mỗi kỹ năng. Sai/hint vào lượt sửa sau vài câu, rồi hẹn kiểm tra lại ngày sau; kiểm tra độc lập đến hạn qua ngày mới tăng khoảng cách. Đây là mặc định cần đo/điều chỉnh, không phải lịch tối ưu cho mọi người. Tránh hỏi lại cùng câu ngay liên tục.

Trang Ôn tập hiển thị một hàng đợi chung với nhãn kỹ năng; khoảng 5–10 phút theo mục tiêu người học, ưu tiên quá hạn và lỗi chưa sửa; gom mục tiêu trùng giữa các bài. Trộn dạng bài và biến thể tình huống. Không ép làm hết tồn đọng, không giả điểm phần trăm thành thạo. Giải thích “cần nghe lại”, “tự viết đúng sau 7 ngày”, “chưa đánh giá nói”.

Triển khai nối mạng trước, báo lỗi lưu và giữ event key khi retry. Offline tiếp tục cho luyện khách nhưng không hiển thị đã đồng bộ; hàng đợi đồng bộ offline là hạng mục riêng. Nối export/reset/xoá tài khoản cho bảng mới.

## Thị trường và lợi thế

Nguồn chính thức đã kiểm tra:
- ELSA AI: https://elsaspeak.com/en/ai/ — tình huống tự chọn, hội thoại, phản hồi.
- Babbel: https://www.babbel.com/babbel-language-experts — hội thoại đời sống, âm thanh người bản ngữ, giải thích và ôn lặp cách quãng.
- Duolingo: https://blog.duolingo.com/duolingo-max/ — mô tả Video Call, Roleplay và phản hồi. Không dùng trang này để cam kết gói/giá/khả dụng ở mọi thị trường.

Vì vậy ảnh, flashcard, SRS và roleplay không phải tính năng độc quyền. App hiện chưa có bằng chứng hiệu quả vượt đối thủ, thư viện/audio/feedback còn hạn chế. Nguồn hãng mô tả tính năng, không chứng minh hiệu quả so sánh.

Hướng định vị đề xuất: tiếng Anh dùng được trong công việc cho người Việt A2–B1, giải thích lỗi dịch sát tiếng Việt, sắc thái và quan hệ giao tiếp; tình huống liên tiếp trong cùng dự án; ôn đúng phần còn yếu; đầu ra là email/đoạn hội thoại đã sửa và bài vận dụng sau một tuần. Đây là hướng có thể kiểm chứng, chưa phải lợi thế độc quyền hoặc chứng minh nhu cầu trả tiền.

## Thứ tự thực hiện và nghiệm thu

1. Lưu luyện tập theo kỹ năng và hàng đợi ôn chung. Test tài khoản khác nhau/thiết bị khác, reload, hint, retry, đến hạn, timezone, version, export/reset.
2. Chọn 6 trong 16 tình huống để biên tập sâu theo ba vòng; hình ảnh/tài liệu đúng nhiệm vụ, các nhánh và feedback được duyệt. Mobile, bàn phím, transcript và reduced motion.
3. Pilot 10–20 người trong hai tuần: làm bài tương đương trước/sau và tình huống mới sau 7 ngày, chấm theo rubric rõ; theo dõi quay lại, tỷ lệ hoàn thành, lỗi lặp và phỏng vấn sẵn sàng trả tiền. Đây là pilot định hướng, chưa đủ chứng minh hiệu quả rộng.
4. Sửa nội dung theo dữ liệu rồi mới mở rộng số lượng và cân nhắc AI/audio trả phí. Không thiết lập giá/chi phí chưa được quyết định.
