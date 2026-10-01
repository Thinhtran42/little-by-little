# Hướng kinh doanh Little by Little — 29/09/2026

## Nhận định

Bản local có nền tảng để thử nghiệm với người học: bài theo tình huống, ảnh thật, flashcard, quiz server, tiến độ tài khoản và lịch ôn. Riêng phrasal có18bài/69cụm khác nhau/90câu luyện. Chưa có bằng chứng giữ chân, cải thiện khả năng sử dụng tiếng Anh hoặc sẵn lòng trả tiền. Kiểm thử kỹ thuật qua không đồng nghĩa sản phẩm đã phù hợp thị trường.

Không nên định vị là kho từ vựng lớn hoặc bản số hóa Destination. Đề xuất thử phân khúc người Việt đã học tiếng Anh cơ bản nhưng khó dùng câu/cụm trong công việc hằng ngày. Lời hứa thử nghiệm: mỗi ngày10phút luyện một tình huống, hôm sau nhớ lại và dùng trong câu mới. Không hứa đạt B2 trong30ngày.

## Đối chiếu thị trường

- [ELSA](https://elsaspeak.com/en) tập trung tiếng Anh nói, phát âm và phản hồi. Chưa nên lấy chấm phát âm AI làm điểm cạnh tranh chính khi app chưa có bằng chứng chất lượng này.
- [British Council self-study](https://learnenglish.britishcouncil.org/subscribe) cung cấp học liệu có cấu trúc được chuyên gia thiết kế. App cần quy trình rà nội dung đáng tin cậy, không chỉ tăng số bài.

Nhận định cơ hội là giả thuyết: giải thích ngắn bằng tiếng Việt, tình huống sát người mới đi làm, luyện dùng cụm và ôn lại qua nhiều ngày. Phải kiểm chứng bằng phỏng vấn và hành vi sử dụng thật.

## Ưu tiên sản phẩm

1. Gói học rõ đầu ra: một lộ trình4tuần cho công việc, từ nhắn tin/hẹn lịch đến nêu vấn đề, báo tiến độ, gọi điện. Mỗi tuần có nhiệm vụ dùng lại kiến thức trong ngữ cảnh mới. Kho18bài phrasal đa chủ đề hiện tại chưa tự động trở thành khóa4tuần này.
2. Chất lượng bài: giáo viên rà nghĩa, đáp án thay thế, độ tự nhiên và mức khó. Thêm audio nam/nữ nhất quán, nghe không có transcript, nói theo vai và viết câu mới. Dùng audio tạo sẵn/thu sẵn cho nội dung cố định để dễ kiểm soát chất lượng và chi phí; chưa chọn nhà cung cấp trả phí.
3. Nhớ và dùng được: bài đầu vào ngắn để gợi ý mức phù hợp; kiểm tra sau7/30ngày bằng câu mới. Tách nhận diện, tự nhớ và diễn đạt; không cộng tất cả thành chứng nhận trình độ.
4. Giữ nhịp: màn hình hôm nay có việc cần ôn và một bài mới; nhắc học tùy chọn và tổng kết tuần. Đo người dùng có quay lại trước khi thêm leaderboard hoặc phần thưởng phức tạp.
5. Vận hành trước khi thu tiền: xác minh production database/backup/restore, email phục hồi và hỗ trợ, logging/alert, trạng thái thanh toán/quyền truy cập ở server, chính sách giá/hủy/hoàn tiền và quyền riêng tư rõ ràng. Chưa xác minh cloud hoặc triển khai thanh toán trong đợt tư vấn này.

## Thử bán nhỏ trước

Đề xuất khóa thử nghiệm4tuần, mua một lần, thay vì thuê bao năm/lifetime. Ví dụ149.000đ/người là **giả thuyết giá thử**, không phải giá thị trường đã xác minh. Có3bài học mẫu miễn phí và công khai phạm vi beta. Nếu kèm giáo viên sửa bài, tính giờ người dạy và bán một gói riêng với giới hạn rõ ràng.

Chỉ thử subscription khi có nhu cầu học tiếp, lịch phát hành đều và tỷ lệ quay lại đủ tốt. Thu tiền cho lộ trình, bài luyện và hỗ trợ có giá trị; không dùng việc khó xuất/xóa dữ liệu để khóa người dùng.

Chưa cần tích hợp nhiều cổng thanh toán. Giai đoạn pilot có thể đối soát từng đơn và cấp quyền thủ công ở backend, có lịch sử giao dịch và hỗ trợ hoàn tiền. Khi tự động hóa cần webhook xác minh chữ ký, idempotency, xử lý giao dịch trễ/lỗi/hoàn tiền và đối soát. UI ẩn bài không phải cơ chế bảo vệ quyền truy cập.

## Tìm khách và đo hiệu quả

- Phỏng vấn10người đúng đối tượng: lần gần nhất bị bí tiếng Anh khi nào, đang học bằng gì, từng trả tiền cho gì, bỏ học vì sao. Không chỉ hỏi họ có thích ý tưởng không.
- Mời20–30người dùng thử một tuần; quan sát5buổi học thật. Nhờ họ làm một tình huống mới sau vài ngày, không chỉ lặp đúng bài cũ.
- Xuất bản video ngắn từ bài gốc: tình huống → cách nói → câu thử sức → link bài mẫu tương ứng. Dùng một kênh trước, chẳng hạn TikTok hoặc một cộng đồng người đi làm mà chủ dự án tiếp cận được. Không tự đăng hay nhắn ai khi chưa được yêu cầu.
- Mời người học thử mua khóa beta với ngày bắt đầu, phạm vi và giá rõ ràng. Ý định trả tiền là tín hiệu yếu hơn giao dịch thật; không xem bạn bè mua ủng hộ là thị trường đã được chứng minh.
- Theo dõi nguồn đăng ký, hoàn thành bài đầu, quay lại ngày7, ôn đúng hạn, làm được câu mới, mua/hoàn tiền và lý do rời đi. Chỉ thu thông tin cần thiết, không gửi toàn văn câu trả lời cá nhân sang analytics mặc định.

Các mốc quyết định nội bộ có thể đặt trước (không phải benchmark ngành): ít nhất10người ngoài vòng bạn bè đồng ý mua beta; nếu đa số không hoàn thành bài đầu hoặc không quay lại, sửa trải nghiệm/lời hứa trước khi mua quảng cáo. Mẫu nhỏ chỉ giúp tìm tín hiệu, chưa cho kết luận thống kê chắc chắn.

## Chi phí và trình tự

Tính lãi đóng góp mỗi khách = doanh thu thực nhận trừ phí thanh toán, hoàn tiền, audio/AI biến đổi, hỗ trợ và chi phí thu hút khách. Sau đó mới trừ hosting/database, biên tập, thiết kế và phát triển cố định. Chưa có dữ liệu để dự báo lợi nhuận hoặc khẳng định một mức giá đủ nuôi sản phẩm. Nếu dùng AI tương tác, có quota theo tài khoản và trần ngân sách phía server; không bán không giới hạn trước khi đo chi phí thực.

Thứ tự đề xuất: chọn đối tượng/lời hứa → xây một lộ trình hoàn chỉnh + giáo viên rà → đo nhóm thử → chốt độ ổn định production và phương thức thu tiền → bán beta nhỏ → quyết định mở rộng. Tránh đồng thời làm app native, mạng xã hội, chatbot tổng quát và hàng nghìn bài chưa thẩm định.
