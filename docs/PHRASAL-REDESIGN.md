# Phrasal verb: thay giao diện và bài học — 29/09/2026

> Cập nhật mới nhất: thư viện đã tăng từ6 lên18bài, gồm72mục cụm theo bài (69cụm khác nhau),18đoạn đọc song ngữ,108lượt hội thoại và90câu luyện. Các phần mô tả6bài bên dưới là phạm vi phiên bản đầu; xem mục mở rộng cuối file.

## Phạm vi

Thay trang phrasal ghép nhiều danh sách bằng một thư viện thống nhất và luồng ba bước: **Vào tình huống → Hiểu & nhớ → Tự thử sức**. Không thay ID hoặc xóa lịch sử khóa B1/B2 và bài ở ga.

- Sáu bài tự biên soạn: dọn bếp, họp nhóm, khách sạn, thử quần áo, gặp bạn và sửa máy tính. Bốn nhóm: đời sống, công việc, đi xa, bạn bè.
- 24 cụm theo nghĩa cụ thể, 6 đoạn đọc có bản dịch, 36 lượt hội thoại, 24 câu tự nhớ và 6 bài ghép câu. Cụm in đậm mở đúng thẻ giải thích.
- Mỗi thẻ có mẫu dùng, ví dụ, vị trí đại từ/tân ngữ và lưu ý nghĩa dễ nhầm. Ví dụ: `try it on`, `look into it`, `back them up`.
- Hội thoại mở từng lượt, flashcard ẩn/hiện nghĩa, nhập câu trả lời và ghép câu bằng nút dùng được với bàn phím. Nút loa dùng hệ thống giọng hiện có; không bật TTS trả phí.
- Animation nhẹ cho thẻ và lượt thoại, tôn trọng reduced motion. Bỏ tiêu đề lặp và sửa CSS nav chung khiến bộ lọc xếp dọc. Đã sửa độ tương phản số thứ tự thẻ.
- Bài **Đón bạn ở ga** được giữ trong mục bài đã có. Các truyện cũ không còn là giao diện mặc định; không chuyển lượt tự luyện chưa lưu thành tiến độ tài khoản.

## Hình ảnh

Thư viện dùng ảnh thật được lưu local, không hotlink khi học. Hai ảnh mới của MART PRODUCTION:

- [Rửa đĩa dưới vòi nước](https://www.pexels.com/photo/person-washing-dishes-7641231/) → `pv-dishes.webp`.
- [Chọn trang phục trước gương](https://www.pexels.com/photo/a-woman-looking-at-the-mirror-7668395/) → `pv-fitting.webp`.

Đã mở nguồn, xem [Pexels License](https://www.pexels.com/license/), tải bản rộng 1200px, nén WebP và kiểm tra ảnh/crop trực quan. Ảnh thứ hai thể hiện chọn đồ trước gương, không khẳng định nhân vật đang mặc chiếc áo khoác trong truyện. Caption phân biệt chọn đồ và mặc thử. Các ảnh họp nhóm, lễ tân, trò chuyện, sửa máy tái sử dụng từ registry hiện có; đã xem lại từng ảnh. `shared/photo-sources.js` ghi tác giả, URL, alt, crop và ngày kiểm tra. Nhân vật trong bài là hư cấu, ảnh chỉ tạo bối cảnh.

## Lưu tài khoản

`shared/phrasal-lessons.js` là registry độc lập, ID `pv-*`, version 1. Service khóa học nhận registry thay vì gắn cứng B1/B2. Endpoint:

- `GET /api/me/phrasal`: kết quả gần nhất và số câu đến hạn.
- `GET /api/me/phrasal/:lessonId`: tiếp tục bài.
- `POST /api/me/phrasal/:lessonId/attempts`: server chấm, kiểm tra version/question, auth/CSRF, event key chống trùng.

Kết quả ở bảng `lesson_attempts`, dùng migration 2 hiện có. Tự nhớ đúng dùng lịch 1/3/7/14/30 ngày; sai/gợi ý trở lại hôm nay. Ghép từ có sẵn dùng mode `choice` nên không tăng mức ghi nhớ chủ động, chỉ lịch 1 ngày. Không tin `correct` gửi từ client. Xuất/xóa tài khoản và ngày học toàn tài khoản bao gồm các lượt này nhờ cơ chế hiện có. Số câu B1/B2 và phrasal vẫn tách rõ; hàng đợi phrasal nằm tại trang phrasal.

Quiz giữ state khi chuyển giữa ba bước; lỗi gửi không báo thành công, giữ câu trả lời để gửi lại với cùng event key. Khi tải lại, tài khoản mở câu chưa làm/đến hạn đầu tiên. Khách chỉ giữ kết quả trong bài đang mở. Nội dung và ảnh được PWA cache; ghi tài khoản vẫn cần online.

## Kiểm thử và bàn giao

Chốt 29/09/2026: `npm run check` qua **21 unit, 23 backend/API, 33 E2E, build production và 4 offline**. Bộ offline mới xác minh ảnh phrasal và tự nhớ khách sau khi mất mạng. `git diff --check` không lỗi khoảng trắng. Dev đang chạy để review; không suy diễn kết quả local thành kiểm thử production.

- Unit: tính nhất quán các cụm tô đậm, ảnh local, ID câu hỏi và mode nhận diện.
- API: chấm server, auth/CSRF, user isolation, version, replay/idempotency, export/reset và không lẫn kết quả B1/B2.
- E2E: đi qua cả 6 bài, ảnh tải thật, bản dịch, mở nghĩa, hội thoại, trả lời sai/đúng, ghép câu, lưu/reload và lỗi mạng.
- Accessibility/mobile: thư viện, ngữ cảnh, thẻ và quiz tại 390/1440px. Ảnh kiểm tra trong `artifacts/phrasal-*` (không commit).
- Offline: ảnh mới và lượt tự luyện khách sau khi cache production.

Local: `http://localhost:5173/#phrasal`; DB PGlite phát triển. Chưa push/deploy hoặc đổi production database. Nội dung vẫn cần giáo viên/người học rà; đây là bộ bài mới có phạm vi rõ ràng, không phải toàn bộ kho phrasal verbs tiếng Anh.

## Hoàn thiện lượt ôn — 29/09/2026

- Hàng đợi lấy đúng từng câu: câu đến hạn cũ nhất trước, rồi câu chưa học. Không bắt làm lại những câu có lịch ôn trong tương lai. Khi cả bài chưa đến hạn, hiện ngày ôn và cho phép chủ động luyện thêm.
- Kết thúc lượt có kết quả từng câu, phân biệt sai/đúng với gợi ý/đúng không gợi ý. Nút luyện lại chỉ chọn câu sai hoặc cần gợi ý; có thể lặp đến khi tự trả lời đúng.
- Điểm lần đầu của lượt giữ nguyên khi sửa câu sai để không biến luyện ngay sau khi thấy đáp án thành điểm nhớ ban đầu. Bảng kết quả cập nhật trạng thái mới nhất; ghép câu vẫn được ghi rõ là nhận diện từ có sẵn. Lượt mới bắt đầu từ nút luyện lại cả bài sẽ có điểm lần đầu riêng; không phải điểm thành thạo.
- Tìm theo tiếng Anh, nghĩa tiếng Việt có/không dấu hoặc tiêu đề tình huống; kết hợp nhóm chủ đề và bộ lọc bài đến hạn cho tài khoản. Có trạng thái không tìm thấy và nút xóa bộ lọc.
- Logic chọn câu/tìm kiếm thuần trong `shared/phrasal-practice.js`, không đổi schema hoặc đáp án nên giữ version bài và lịch sử cũ.
- Kiểm thử đợt này:23 unit,23 API,34 E2E toàn suite và1 E2E bổ sung cho bài chưa đến hạn đều qua;4 offline qua. Sau chỉnh tìm kiếm Đ hoa,2 unit liên quan và build production chạy lại qua. Tổng E2E hiện có35. Chưa deploy.

## Mở rộng nội dung — 29/09/2026

User phản hồi ít bài. Thêm12bài độc lập trong `shared/phrasal-expansion.js`; registry gộp trước khi tạo assessment. Mỗi bài có4cụm, mẫu dùng/nhầm lẫn, đoạn đọc có bản dịch, hội thoại6lượt,4câu nhập và1câu ghép. Không đổi version/ID của6bài trước; không cần migration DB.

| Nhóm | Bài mới |
| --- | --- |
| Học tập | Ôn bài mà không học vẹt |
| Sức khỏe & cảm xúc | Trở lại sau một tuần ốm; Một ngày quá nhiều việc |
| Bạn bè | Đổi hẹn mà không mất lòng; Cuộc gọi bị gián đoạn |
| Cộng đồng | Một thùng đồ, nhiều người giúp |
| Công việc | Kể một lần bạn giải quyết vấn đề; Khi thời hạn cần thương lượng |
| Đi xa | Đổi tàu ở ga lạ |
| Đời sống | Quán đông, gọi món thế nào?; Nấu từ những gì còn trong bếp |
| Giải trí | Tham gia một trò chơi mới |

Tổng8nhóm. Có69cụm khác nhau,72mục theo bài: `work out` học nghĩa tập thể dục và tìm lời giải; `look up`/`write down` gặp lại ở bối cảnh mới. Không tuyên bố72từ độc nhất. Đoạn sức khỏe là hội thoại hư cấu để học ngôn ngữ, không phải hướng dẫn điều trị.

Ảnh dùng registry có sẵn theo đúng bối cảnh (thư viện, phòng khám, lịch, quyên góp, phỏng vấn, gọi điện, ga, café, bếp, board game, viết nhật ký, họp nhóm). Không thêm ảnh trang trí ngẫu nhiên. Ảnh không nhất thiết mô tả mọi động tác trong bài.

Danh sách hiện6bài ban đầu và nút Xem thêm6bài; khi tìm/lọc, giới hạn hiển thị reset về6. Tìm kiếm áp dụng toàn bộ18bài, không chỉ phần đã mở. Test trình duyệt đi qua từng bài để kiểm tra ảnh tải thật, bản dịch, highlight và hội thoại; thêm kiểm tra mở đủ18thẻ và chọn nhóm học tập.

Chốt bản 18 bài: `npm run check` qua 23 unit, 23 API, 35 E2E, build production và 4 offline. Test trình duyệt đã mở toàn bộ 18 bài thành công. Chưa push/deploy.
