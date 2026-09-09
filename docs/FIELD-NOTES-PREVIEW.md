# Field Notes — bản thử nội dung và giao diện

Ngày: 08/09/2026. Trạng thái: local preview, chưa push/deploy.

## Mở để so sánh

- Bản thử: http://localhost:5173/?preview=field-notes
- Bản hiện tại: http://localhost:5173/
- Nút “Về giao diện hiện tại” luôn nằm ở đầu bản thử.
- Entry point được chặn bằng `import.meta.env.DEV` và lazy import. Build production loại bản thử khỏi bundle; thay đổi URL production không bật được preview.
- Dev đang chạy với PGlite local. Không dùng database production để thử giao diện.

## Ý tưởng sản phẩm

Lời hứa: mỗi lần học giải quyết một cuộc giao tiếp nhỏ. Thay danh sách dài bằng một cảnh, một mục tiêu, một nhóm từ theo nghĩa cụ thể. Hướng thị giác là sổ tay minh họa: nền giấy, xanh mực, màu đất nung, chữ serif lớn, thẻ như tấm bưu thiếp; các minh họa SVG riêng cho quán cà phê, xe buýt, văn phòng, bếp, cửa hàng và quán sách. Hình được viết trực tiếp bằng SVG, không lấy ảnh ngoài mạng.

Trang đầu chỉ có một bài gợi ý, dòng tiến độ nhỏ và sáu tình huống. Không thêm điểm số/streak giả. Animation khi hiện thẻ, hover nhẹ và hơi cà phê; tắt chuyển động khi thiết bị yêu cầu reduced motion.

## Bank theo chuẩn mới

`shared/field-notes.js`: 6 bài A2–B1, 36 mục (12 từ, 12 phrasal verb, 12 mẫu câu), 6 đoạn đọc ít nhất 60 từ, 6 hội thoại gồm 36 lượt nói. Đây là 36 mục được biên soạn theo tình huống, không tuyên bố tất cả là từ mới so với catalog 640 mục cũ.

Mỗi mục có ID ổn định, loại, cách nói, nghĩa trong cảnh, ví dụ chứa cụm mục tiêu và lưu ý dùng từ. Các lỗi được nêu cụ thể: pick it up/pick up it, get on/get in, call off/put off, Would you mind + V-ing, follow up with/on. Phân biệt collocation với phrasal verb, ví dụ run late nằm trong phần mẫu câu.

Đoạn đọc và hội thoại là nội dung tự biên soạn. Chưa được giáo viên độc lập duyệt; nhãn A2/B1 là định hướng biên tập, không phải chứng nhận CEFR.

## Hoạt động đã chạy được

1. Đọc câu chuyện, bật/tắt dịch, xem cụm mục tiêu được đánh dấu, nghe bằng speechSynthesis hiện có.
2. Flashcard nghĩa → cách nói; lọc từ/phrasal/mẫu câu, lưu cụm, xem ví dụ và lỗi dễ nhầm.
3. Bài điền vào ví dụ: kiểm tra cụm mục tiêu có chuẩn hóa hoa/thường/dấu câu theo hàm checkAnswer có sẵn.
4. Lưu đúng/sai và có dùng gợi ý riêng. Đúng độc lập: ôn sau 1 ngày; có gợi ý/sai: sau 10 phút. Nút Ôn lại dẫn đến cụm đến hạn đầu tiên. Đây là quy tắc demo, chưa phải thuật toán SRS thích nghi hay bằng chứng hiệu quả học.

Tiến độ nằm ở khóa localStorage `lbl-field-notes-preview-v1`, tách khỏi tài khoản/catalog thật. Bookmark là thao tác lưu cụm, chưa có trang tổng hợp bookmark. Preview không gọi API ghi kết quả vào tài khoản. Không có TTS cloud hay tính phí. Nút loa ghi rõ giọng thiết bị trong tooltip; chưa có hai giọng tự nhiên.

## Kiểm thử

- `npm test`: 14 test qua, gồm kiểm tra nội dung mỗi bài, ID không trùng, câu ví dụ có cụm để tạo chỗ trống, phân bố loại nội dung.
- `npx playwright test e2e/field-notes.spec.js`: 3 test trên Chromium headless. Tìm kiếm, đọc/dịch, flashcard, chấm độc lập/có gợi ý, lưu sau reload, không tràn ngang ở 390/1440px, quay lại giao diện gốc.
- `npm run build`: qua; bundle production vẫn `index-BrqqYT8K.js` ở lần kiểm tra đầu tiên.
- Ảnh kiểm tra trong `artifacts/field-notes-*.png` (không commit artifact).

## Sau khi duyệt hướng giao diện

1. Duyệt một bài và hai kích thước màn hình; chỉnh typography, hình và độ dài bài trước khi thay giao diện gốc.
2. Thêm bài vận dụng đổi người/địa điểm, câu trả lời thay thế và ôn theo lỗi; bài hiện tại chỉ đo nhớ cụm, không chấm câu tự do.
3. Đưa schema này vào content repository/service: version bài, trạng thái draft/reviewed/published, sense ID, form gốc và biến thể, ví dụ, minh họa, audio manifest. Migrate progress bằng ID/version; không xóa dữ liệu cũ.
4. Nối các attempt vào backend và daily planner, export/reset tài khoản; bỏ lưu local riêng khi trở thành tính năng chính thức.
5. Chuyển dần 640 mục cũ thành bài có tình huống, loại trùng theo nghĩa và ưu tiên tần suất giao tiếp. Mở rộng các cảnh thiếu: gọi điện, khách sạn, chỉ đường, đi chợ, nhờ giúp, xử lý sự cố. Mỗi bài giữ tải mới nhỏ, không nhồi số lượng.
6. Chọn giọng sau khi nghe mẫu. Tạo file audio theo lô được duyệt, phát file tĩnh. Chưa bật nhà cung cấp tính phí trong bản thử này.

Không cần cloud DB mới để thử hướng này; tăng nội dung văn bản không phải bằng chứng database hiện tại không scale. Khi publish thư viện lớn, tách media sang storage/CDN và thêm phân trang/tìm kiếm/index phù hợp.

## Studio v2 — màu sắc và chuyển động (09/09/2026)

Đã thêm Studio/Sổ tay để so sánh trong preview. Studio dùng nền kem #f7f5ee, chữ xanh mực #23384e, CTA cobalt #315ace, highlight vàng #f5dfa0. Đây là lựa chọn thiết kế, không phải công thức khoa học giúp tăng trí nhớ ngoại ngữ.

Bằng chứng tham khảo:

- [Elliot, 2015: Color and psychological functioning](https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2015.00368/full): tác động màu phụ thuộc ngữ cảnh, phương pháp nghiên cứu còn giới hạn. Không suy diễn xanh = nhớ ngoại ngữ tốt hơn cho mọi người.
- [Ozcelik et al.: Why does signaling enhance multimedia learning?](https://www.sciencedirect.com/science/article/pii/S0747563209001459): nghiên cứu về tín hiệu định hướng chú ý và chuyển động mắt khi học multimedia. Dùng làm cơ sở cho việc nối cụm đang chọn với vị trí trong hình; không phải bằng chứng trực tiếp cho hiệu quả app này.
- [WCAG contrast](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html): chữ thường tối thiểu 4.5:1, chữ lớn 3:1. Tính bằng công thức relative luminance: chữ chính/nền 11.02:1; chữ phụ/nền 5.31:1; chữ CTA/nút 5.73:1; chữ/highlight 8.63:1. Chỉ các cặp này được đo, chưa phải audit WCAG toàn bộ app.
- [WCAG animation from interactions](https://www.w3.org/WAI/WCAG21/Understanding/animation-from-interactions.html): hỗ trợ giảm chuyển động không thiết yếu. Có prefers-reduced-motion và nút giảm chuyển động trong preview.

Đã làm: hero tương tác với 3 cụm at the counter/pick it up/to go; điểm đánh dấu di chuyển theo cụm, câu ví dụ thay tương ứng, nút loa; khung hình có chiều sâu, card hover, flashcard xoay ngắn, phản hồi xuất hiện nhẹ. Hơi cà phê chỉ chạy một lượt, không lặp vô hạn. Không nhấp nháy hay autoplay âm thanh. Pin hiện gắn vị trí tĩnh minh họa, chưa phải animation diễn tả đầy đủ hành động pick up.

Hướng làm đẹp tiếp nếu duyệt: minh họa nhân vật có biểu cảm và động tác khác nhau; timeline hội thoại từng lượt; animation mô tả nghĩa như lấy cốc lên hoặc bước xuống xe. Tập trung chuyển động ở phần giải thích, giữ bài đọc/tự nhớ yên tĩnh. Cần thử người dùng và kiểm tra nhớ sau 1/7 ngày để đánh giá hiệu quả học, không dùng mức độ thích giao diện thay thế kết quả học.

## Action scenes v3 (09/09/2026)

Người dùng đồng ý thử animation diễn tả nghĩa. Đã thêm `ActionScene.jsx` và `action-scene.css` độc lập để tái sử dụng:

- Cà phê: cánh tay và cốc xoay lên khỏi quầy trong 2.3 giây, thể hiện pick it up.
- Xe buýt: nhân vật bước từ cửa xe xuống vỉa hè trong 2.5 giây, thể hiện get off. Chuyển động chân không được kết thúc animation toàn cảnh sớm; xử lý animationend chỉ ở phần tử chính.
- Chỉ chạy khi bấm; có phát lại, chọn Trước/Sau và dừng tại trạng thái cuối. Khi giảm chuyển động (nút hoặc hệ điều hành), chuyển thẳng giữa hai trạng thái và giải thích bằng chữ; không để nút kẹt ở trạng thái đang phát.
- Bài thử ngắn: giấu cụm trong phần giải thích, điền cụm tương ứng với hành động; chấp nhận chuẩn hóa viết hoa/dấu câu, phân biệt pick it up/pick up it. Chưa cộng vào progress/SRS; câu hướng dẫn nêu rõ điều đó. Trong bài đọc người học vẫn có thể thấy cụm ở nội dung khác, nên không coi đây là bài thi độc lập.
- Vị trí: mở bài cà phê hoặc bài xe buýt, trong phần Vào câu chuyện. Trang đầu chọn chip pick it up cũng mở cảnh động cà phê.
- Kiểm thử 5/5 Playwright qua; mở rộng test animation để kiểm tra bus hoàn tất và phát lại cũng qua. Đã xem ảnh kết thúc cả hai cảnh trong artifacts/action-*-after.png. Chưa push/deploy.
