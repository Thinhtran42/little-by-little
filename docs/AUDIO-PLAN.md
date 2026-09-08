# Giọng nam/nữ cho bài station

Ngày khảo sát: 08/09/2026. Chưa gọi API tính phí, chưa tạo file giọng mới. Giọng hiện trong app vẫn là speechSynthesis của thiết bị.

## Lựa chọn đề xuất

Google Cloud Chirp 3 HD để thử hai giọng tiếng Anh, sau đó nghe đánh giá trước khi áp dụng toàn thư viện. Không thể kết luận một giọng đủ tự nhiên chỉ từ mô tả nhà cung cấp. Cần nghe câu hỏi, câu trả lời dài, trọng âm phrasal verb và tên riêng.

- Chirp 3 HD: 1 triệu ký tự miễn phí/tháng; vượt mức 30 USD/triệu ký tự. Bắt buộc bật billing, vượt free usage có thể bị tính tiền. [Google pricing](https://cloud.google.com/text-to-speech/pricing).
- ElevenLabs là lựa chọn so sánh, nhưng Free không có commercial license; không dùng audio Free để bán sản phẩm. [Commercial use](https://help.elevenlabs.io/hc/en-us/articles/13313564601361-Can-I-publish-the-content-I-generate-on-the-platform).

## Công cụ đã chuẩn bị

`node scripts/station-audio.mjs` chỉ đếm ký tự và dự toán, không gọi mạng.

Sau khi chủ sản phẩm đồng ý provider/chi phí, bật Cloud Text-to-Speech API và billing trong project. Cấu hình Application Default Credentials của Google Cloud qua công cụ chính thức và GOOGLE_CLOUD_PROJECT tại máy biên soạn. OAuth client secret dùng đăng nhập ứng dụng không thay thế quyền gọi TTS.

`node scripts/station-audio.mjs --generate` tạo MP3 cho mỗi nội dung với hai giọng; cache bằng hash text/voice; chạy lại bỏ qua file đã có; không retry tự động request tính phí. Manifest chỉ viết sau khi đủ clip. Không bật script này trong CI/deploy hoặc mỗi lần người học bấm loa.

Giọng đề xuất: en-US-Chirp3-HD-Kore (nữ), en-US-Chirp3-HD-Charon (nam). Kiểm tra khả dụng/quota ở project khi tạo. [Chirp 3 HD](https://docs.cloud.google.com/text-to-speech/docs/chirp3-hd).

## Bước tiếp theo sau khi có audio

Người dùng đã chọn Google Cloud TTS. Máy hiện chưa có gcloud/ADC/project environment. Thiết lập một lần:

1. Trong Google Cloud chọn project, sao chép **Project ID**, liên kết billing và bật **Cloud Text-to-Speech API**.
2. Cài [Google Cloud CLI](https://cloud.google.com/sdk/docs/install), mở terminal mới.
3. Chạy `gcloud auth application-default login` và đăng nhập bằng trình duyệt.
4. Chạy `gcloud auth application-default set-quota-project YOUR_PROJECT_ID`.
5. PowerShell: `$env:GOOGLE_CLOUD_PROJECT = 'YOUR_PROJECT_ID'`, sau đó `node scripts/station-audio.mjs --generate` tại root repo.

Không commit ADC, không dùng OAuth client secret của chức năng login. Dự toán bản mẫu: 22 clip / 704 ký tự / 0.02112 USD nếu không áp dụng free tier; chưa tính thuế. Việc chọn provider đã được đồng ý, nhưng chưa kiểm tra billing/quota của project và chưa phát sinh gọi API.

1. Nghe duyệt file mẫu cả nam/nữ, chỉnh lời thoại và tạo lại nếu cần. Ngữ điệu từng clip có thể chưa liền mạch dù chất lượng từng giọng tốt.
2. Player đọc manifest; phân vai cố định trong hội thoại, chọn giọng cho cụm mẫu; hỗ trợ dừng, nghe cả đoạn và tốc độ 0.85/1.0.
3. Chỉ một nguồn audio phát tại một thời điểm; dừng khi chuyển câu hoặc rời bài; hiển thị lỗi tải, không lặng lẽ đổi sang giọng robot.
4. Đưa MP3 được duyệt lên static assets cho demo hoặc storage/CDN khi thư viện lớn. Playback không phát sinh phí tổng hợp TTS, nhưng vẫn có chi phí bandwidth/storage nếu vượt quota.
5. Không nói đã tích hợp giọng tự nhiên khi chỉ có script hoặc chưa tạo asset. Không dùng cách đổi pitch để giả giọng nam/nữ.
