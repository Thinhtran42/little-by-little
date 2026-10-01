# Nội dung đợt 1 — 11/09/2026

## Cập nhật 12/09/2026 — hoàn tất số lượng pilot

User chọn làm mục 1 (ảnh đúng ngữ cảnh) và 2 (đủ 12 bài) trước. Đã bổ sung `shared/reading-pilot-two.js`: sáu bài mới tự biên soạn về phòng khám, khách sạn, thư viện, sửa máy tính, board game và quyên góp cộng đồng. Tổng hiện tại **12 bài, 24 đoạn đọc, 12 hội thoại / 72 lượt, 60 mục từ/cụm**, 12 câu đọc hiểu và 12 bài tự nhớ. Các con số sáu bài bên dưới là lịch sử đợt đầu. Hoàn tất số lượng pilot không đồng nghĩa đã hoàn thành kiểm định sư phạm hoặc mọi yêu cầu độ sâu của roadmap.

Đã tải và xem trực quan 10 ảnh Pexels bổ sung, tổng 16 ảnh WebP / 1.31 MB. Tất cả 12 bài có ảnh bìa riêng theo bối cảnh chính. Chủ đề sức khỏe, học tập, phỏng vấn, điện thoại, kế hoạch, công nghệ, giúp đỡ, cảm xúc, giải trí có ánh xạ ảnh riêng; du lịch và truyện phrasal về thu xếp chỗ ở dùng lễ tân khách sạn, bài sân ga vẫn dùng sân ga. Ảnh là ảnh bối cảnh, không mô tả chính xác mọi nhân vật/hành động hoặc đoạn đọc phụ. Cuộc sống hằng ngày và nhà cửa vẫn chia sẻ ảnh bếp vì cùng bối cảnh sinh hoạt.

Manifest `shared/photo-sources.js` ghi tác giả, URL gốc, license, alt và ngày kiểm tra cho từng ảnh. Đã sửa alt theo ảnh tải thực tế, không chỉ dựa tiêu đề trang nguồn. Nguồn ảnh: Pexels, theo https://www.pexels.com/license/ (kiểm tra lại 12/09/2026). Không thêm nguồn văn bản bên ngoài trong sáu bài mới, không gắn nhãn VOA cho nội dung tự viết.

Kiểm thử: 16 unit, 24 E2E qua; build tạo precache 42 file (~1.97 MiB); offline kiểm tra cả ảnh/bài thuộc đợt mới. Test dữ liệu bảo vệ số lượng 12 bài, ảnh riêng từng bài và ánh xạ các chủ đề trước đây bị sai. Toàn bộ 12 bài đã đi qua luồng ảnh, nghĩa, bản dịch, đoạn thứ hai, hội thoại, tự nhớ sai/đúng. Dev vẫn tại `http://localhost:5173/#reading`. Chưa commit/push/deploy.

Phần cần làm tiếp theo quyết định riêng: nâng cấu trúc phrasal verb, rà 640 mục cũ, bổ sung sâu hơn vào mỗi bài và nối kết quả tài khoản. Chưa sửa các phần này trong lần thực hiện mục 1–2.

## Đã triển khai tại local

Mở **http://localhost:5173/#reading** hoặc mục **Đọc & từ vựng** trong menu. Đây là 6 bài đầu tiên của pilot 12 bài trong CONTENT-ROADMAP.md, chưa hoàn tất toàn bộ roadmap.

| Tình huống | Trình độ biên tập | Nguồn nội dung |
| --- | --- | --- |
| Một lời mời ở quán cà phê | A2–B1 | Tham khảo cách dùng từ từ VOA, viết tình huống mới |
| Đổi chiếc áo không vừa | A2 | Little by Little tự biên soạn |
| Một biển chỉ dẫn, hai cách gọi | A2–B1 | Tham khảo biến thể Anh–Mỹ từ VOA, viết tình huống mới |
| Cuộc họp cần một bước tiếp theo | B1 | Little by Little tự biên soạn |
| Bữa tối thiếu một nguyên liệu | A2 | Little by Little tự biên soạn |
| Đổi lịch mà không mất cuộc hẹn | A2–B1 | Little by Little tự biên soạn |

Tổng: **12 đoạn đọc, 6 hội thoại (36 lượt), 30 mục từ/cụm**, 6 câu hỏi đọc hiểu và 6 bài tự nhớ. Mỗi bài có hai ngữ cảnh, bản dịch Việt, từ in đậm bấm mở nghĩa, ghi chú cách dùng và câu ví dụ. Có tìm kiếm, lọc chủ đề, phản hồi đúng/sai và nút loa dùng giọng thiết bị hiện có.

Trình độ là phân loại biên tập, chưa được chứng nhận CEFR hay thẩm định độc lập bởi giáo viên. Đây là bộ đầu để review chất lượng, chưa phải nhập kho dữ liệu quy mô lớn.

## Nguồn và ảnh

- VOA: [Coffee or Tea?](https://learningenglish.voanews.com/a/coffee-or-tea-/4551468.html) và [American versus British English](https://learningenglish.voanews.com/a/words-and-their-stories-american-versus-british-english/3397694.html). Lưu tác giả Anna Matteo, URL và [điều kiện sử dụng](https://learningenglish.voanews.com/p/6861.html) trong từng bài. Chỉ tham khảo nội dung ngôn ngữ để viết tình huống mới; không nhập lời bài hát, audio hoặc ảnh bên thứ ba trong bài nguồn.
- Sáu ảnh chụp từ Pexels đã tải, xem trực quan và chuyển WebP: quán cà phê, cửa hàng, sân ga, cuộc họp, bếp và bạn bè. Tổng khoảng 633 KB. Có tác giả, trang ảnh gốc, alt, vị trí crop và [license](https://www.pexels.com/license/) trong `shared/photo-sources.js`, kiểm tra ngày 11/09/2026.
- Ảnh được phục vụ từ `frontend/public/photos/`, không phụ thuộc hotlink lúc học. Hiển thị credit trên ảnh; trang đọc có link nguồn/license. Người trong ảnh không được mô tả là nhân vật có thật của bài hay người bảo chứng sản phẩm.
- Studio chính dùng ảnh thật thay cảnh SVG ở các khu vực đã nối component ảnh. Sáu ảnh đang được tái sử dụng theo nhóm ngữ cảnh; **chưa có ảnh riêng cho toàn bộ 16 chủ đề cũ hay từng từ**. Prototype Field Notes chỉ dành cho DEV vẫn giữ minh họa riêng.

## Cấu trúc và giới hạn

- `shared/reading-lessons.js`: nội dung mới, ID ổn định, source metadata, mục từ, bài đọc, dịch, hội thoại và bài tập.
- `shared/photo-sources.js`: manifest ảnh; `RealPhoto.jsx` chịu trách nhiệm ảnh, alt, credit và trạng thái lỗi.
- `ReadingLibrary.jsx` / `reading-library.css`: thư viện và bốn phần Đọc hiểu, Từ & cách dùng, Hội thoại, Thử nhớ.
- `StudioWorkspace.jsx`, `main.jsx`: route `#reading`; trang chủ dẫn vào bài đọc.
- PWA precache chứa WebP và bundle để mở bài/ảnh sau lần tải online đầu tiên.

Nội dung mới đóng gói cùng frontend, tách khỏi catalog 640 mục hiện có. **Kết quả tự luyện mới chỉ ở state của màn hình, chưa lưu bền vững, chưa cộng XP/SRS hay đồng bộ tài khoản**; ứng dụng ghi rõ điều này. Tiến độ của các luồng cũ không bị thay thế. Không thay schema, API, seed hoặc production database trong đợt này. Không phát sinh dịch vụ TTS trả phí.

## Kiểm thử

- `npm test`: 15/15 qua, gồm cấu trúc dữ liệu, highlight khớp mục từ, nguồn và file ảnh tồn tại.
- `npm run test:e2e`: 24/24 qua, gồm luồng học cũ và 3 kiểm thử đọc mới.
- Sau chỉnh focus/cuộn khi mở bài: chạy lại `npx playwright test e2e/reading.spec.js`, 3/3 qua. Axe kiểm tra cả trang đọc tại 390/1440 px không có lỗi WCAG A/AA được công cụ phát hiện; không thay thế audit thủ công đầy đủ.
- `npm run build` qua; `npm run test:offline`: 2/2 qua, gồm tải lại và học bài mới/ảnh khi offline.
- Đã xem ảnh chụp màn hình, sửa lỗi bài đọc bị đặt trong h1 và cuộn giữ vị trí cũ khi mở bài. Screenshot: `artifacts/reading-shop-390.png`, `artifacts/reading-shop-1440.png` (artifact local).

Local dùng PGlite khi PostgreSQL local không chạy. PowerShell, chỉ áp dụng cho terminal hiện tại:

```powershell
$env:DATABASE_URL = ''
$env:DB_DRIVER = 'pglite'
npm run dev
```

Không thay `.env`. Frontend 5173, backend 3001. Đợt này **chưa commit/push/deploy**.

## Bước tiếp theo

1. Review local sáu bài và mức phù hợp của ảnh; nhờ người có chuyên môn rà ngôn ngữ, bản dịch và độ khó trước công bố như nội dung đã thẩm định.
2. Thêm sáu bài còn lại của pilot, ưu tiên sức khỏe thường ngày, du lịch/lưu trú, học tập, dịch vụ, sở thích và giao tiếp xã hội; bổ sung ảnh riêng đúng tình huống. Chọn nguồn và kiểm tra quyền từng bài/asset trước nhập.
3. Mở rộng độ sâu bài theo roadmap (đọc ngữ cảnh mới, hội thoại đa dạng, bài vận dụng); không tăng số lượng bằng cách lặp mẫu hoặc sao chép nội dung thiếu quyền.
4. Theo ưu tiên user, đợt sau mới nối ID bài/từ với backend, version nội dung, lưu kết quả tài khoản và ôn cách quãng. Đánh giá phân trang/API/CDN khi mở rộng, thay vì đóng toàn bộ kho lớn vào frontend.
