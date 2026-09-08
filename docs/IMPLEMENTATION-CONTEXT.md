# Context triển khai

## Mục tiêu đang làm

Bài mẫu “Đón bạn ở ga”: cảnh minh họa, hội thoại, ba cụm mục tiêu, tự trả lời và lưu kết quả theo tài khoản để ôn lại. Chỉ phát triển local, chưa tự deploy.

## Nền hiện tại

Backend đã refactor modules/routes/service/repository; PostgreSQL production, PGlite dev. Commit production trước mốc này: 88bffbf. Giữ API cũ và dữ liệu tài khoản.

## Tiến độ

- Đã rà nguồn và lên phương án module lessons riêng; tránh gán nghĩa mới vào phrase ID cũ.
- Đã triển khai station v1: hình SVG cảnh đón bạn ở ga, 6 lượt hội thoại, 3 cụm và 4 câu hỏi (câu cuối chuyển sang pick her up).
- Module mới `backend/modules/lessons/`: GET `/api/me/lessons/station`, POST `/api/me/lessons/station/attempts`. Tất cả yêu cầu đăng nhập, POST dùng CSRF hiện có.
- Bảng `lesson_attempts` tạo qua schema.sql, FK user cascade, khóa chống ghi trùng theo user/event_key, có lesson version, câu trả lời, correct, hinted, ngày học/ngày ôn. Server tự chấm, không nhận correct từ client.
- Frontend `StationLesson.jsx`, dữ liệu `shared/station-lesson.js`, đặt trên trang Phrasal verbs (`/#phrasal`). Tài khoản tải kết quả và tiếp tục câu chưa trả lời; guest chỉ giữ state khi component còn mở.
- Lịch ôn mốc đầu: ngày mai theo timezone người học, có số câu đến ngày ôn trong thẻ bài. Chưa gắn vào dailyPlan cũ hoặc tính mastery; không tự nhận là spaced repetition thích nghi.

## Kiểm thử mốc station v1

- `npm run test:api`: 20/20 qua (19 test nền + lesson test).
- Test lesson: server bác correct giả; lưu/tải kết quả; chống retry trùng và payload xung đột; correct tách hinted; cách ly user; CSRF; version sai; xóa tài khoản cascade.
- `npm run build`: qua.
- Playwright kiểm tra guest trên viewport 390×844: nhập đủ 4 đáp án, kết quả 4/4, không pageerror, không tràn ngang.
- Dev đã restart để nạp schema/module mới: http://localhost:5173/#phrasal, backend :3001; PGlite local giữ trong .data. Chưa push/deploy mốc này.

## Bước tiếp theo sau khi người dùng thử

1. Kiểm thử UI đăng nhập + reload/thiết bị thứ hai (API đã kiểm tra persistence và isolation).
2. Đưa lesson due vào trang Ôn tập/daily planner chung; hiện chỉ hiển thị ở thẻ bài mẫu.
3. Bổ sung lesson attempts vào export/reset toàn bộ tiến độ; hiện đây là kho kết quả riêng, xóa tài khoản đã cascade.
4. Bài đọc mục tiêu và hình riêng theo từng hành động, audio nhân vật thay vì TTS trình duyệt; cảnh hiện là SVG original, không phải ảnh AI.
5. Chuẩn hóa schema lesson/sense và chuyển dần các story hiện tại sang module; chưa mở rộng đồng loạt trước khi duyệt bài mẫu.

## Giới hạn phải nhớ

Không coi mở đáp án hoặc kết quả ngay sau khi học là nhớ vững. Không lưu secret vào file. Vấn đề account linking Google trong PRODUCT-REVIEW vẫn còn, không nằm trong mốc bài mẫu này.

## Khi tiếp tục

Đọc file này, kiểm tra git status và test mới trước khi sửa. Cập nhật kết quả triển khai/kiểm thử ở cuối mỗi mốc.

## Mốc UI: icon âm thanh và trang Phrasal gọn hơn

- Các nút gọi speak trong main/StudySession/ContextPractice/ProductPages/PhrasalStories/StationLesson đã dùng icon loa, aria-label và tooltip. Tên loại bài “Nghe & viết” giữ nguyên vì đó là điều hướng, không phải nút phát âm thanh.
- Thêm PhrasalHub: màn đầu có 5 thẻ (bài station + 4 nhóm), không mở bài station sẵn. Chọn mới hiện nội dung; nút quay lại về các nhóm.
- StationScene được tái sử dụng trên thẻ station để hình bìa đúng bài. Grid responsive 3/2/1 cột, giảm heading và nội dung lặp.
- Build qua. Playwright mobile kiểm tra landing, mở/quay lại bài, audio chỉ icon có nhãn, không pageerror/tràn ngang.
- Thay đổi vẫn local, chưa push/deploy. Dev tại http://localhost:5173/#phrasal.

## Mốc audio: Google Cloud TTS đã được người dùng chọn

- Người dùng đồng ý Google Cloud TTS cho bản thử nam/nữ sau thông báo giá. Không cần hỏi lại lựa chọn provider này.
- `scripts/station-audio.mjs` đã chuẩn bị tạo MP3 Kore (nữ), Charon (nam) và manifest; mặc định chỉ dự toán, `--generate` mới gọi API.
- Dry run thành công: 22 clip, 704 ký tự, 0.02112 USD nếu tính toàn bộ ở giá 30 USD/triệu ký tự, chưa tính thuế. Chưa gọi API hoặc tạo audio.
- Máy chưa có gcloud trên PATH, chưa có ADC ở vị trí mặc định, chưa đặt GOOGLE_APPLICATION_CREDENTIALS hoặc GOOGLE_CLOUD_PROJECT. Cần người dùng bật API/billing, cung cấp Project ID (không phải tên hiển thị) và đăng nhập ADC trước khi sinh audio.
- OAuth client đăng nhập Google của ứng dụng không thay thế quyền TTS. Không đưa credentials vào repo/chat.
- `docs/AUDIO-PLAN.md` lưu phương án. Player mới chưa tích hợp; app hiện vẫn dùng speechSynthesis. Sau khi có quyền: tạo clip, nghe kiểm tra, tích hợp chọn giọng/phân vai, kiểm tra local trước deploy.
