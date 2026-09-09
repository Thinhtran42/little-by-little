# Studio — tiến độ thực thi và bàn giao

## Cập nhật phát hành: Studio là giao diện chính

User đã duyệt bản local và yêu cầu thay thế UI cũ, kiểm tra rồi push. Studio hiện mở trực tiếp tại `/` trong cả dev và production; `?preview=studio-full` vẫn tương thích. Đã bỏ JSX shell/trang cũ khỏi App và bỏ liên kết so sánh. Các stylesheet nền còn dùng bởi modal/account/learning được giữ lại, không phải lựa chọn UI cũ. Prototype field-notes vẫn chỉ DEV.

Kiểm tra sau chuyển default: 21/21 E2E pass; audit production dependencies 0 vulnerabilities; build chứa chunk Studio và PWA precache; offline production Studio 1/1 pass. Các đoạn ghi “chưa áp dụng production” phía dưới là lịch sử triển khai trước khi user duyệt.

Cập nhật: 09/09/2026. Phạm vi mới nhất: nâng cấp UI trước; mở rộng vocabulary/đoạn đọc và nghiên cứu nguồn ở đợt sau. User cho phép thực hiện toàn bộ giao diện, không giới hạn một phase mỗi lượt như prompt mẫu cho model nhỏ trong handoff.

## Mở bản thực tế

- Studio dùng catalog/tài khoản thật: http://localhost:5173/?preview=studio-full
- Giao diện hiện hành để đối chiếu: http://localhost:5173/
- Prototype độc lập trước đây: http://localhost:5173/?preview=field-notes
- Không commit/push/deploy ở đợt này. Studio hiện chỉ được nạp khi `import.meta.env.DEV` và query đúng; build production vẫn giao diện hiện hành.
- Local đang chạy frontend 5173, API 3001 bằng PGlite. `.env` đang trỏ PostgreSQL local chưa chạy; không thay bí mật hay cấu hình triển khai.

Nếu cần khởi động lại trong PowerShell, đóng terminal dev cũ trước rồi chạy ở root:

```powershell
$env:DATABASE_URL = ''
$env:DB_DRIVER = 'pglite'
npm run dev
```

Hai biến trên chỉ áp dụng terminal đó. Không dùng PGlite/file disk tạm của host làm database production. PostgreSQL adapter của hệ thống vẫn giữ nguyên.

## Đã triển khai

| Khu vực | Thay đổi và trạng thái |
| --- | --- |
| Shell | Sidebar Studio, điều hướng mobile mở/đóng, Escape, liên kết bỏ qua điều hướng, breadcrumb, bật/tắt chuyển động và hỗ trợ OS reduced-motion |
| Home | Một CTA học theo dailyPlan thật, số học/đến hạn thật; khối hành động pick it up; chỉ ba chủ đề gợi ý, các thống kê chi tiết chuyển sang màn riêng |
| Chủ đề | Minh họa local SVG, số lượng/progress tính từ catalog thay vì hardcode 40, vào từng chủ đề |
| Thư viện/lưu | Tìm en/vi, loại câu, tiến độ, 12 câu mỗi lần, mở thêm, notes thu gọn, icon loa/bookmark/đã xem, luyện từng câu |
| Phrasal | Nhóm tình huống, hình Studio dùng chung, vào đoạn đọc/hội thoại hoặc bài đón bạn ở ga; không bày danh sách 128 cụm |
| Lộ trình | Chọn một chủ đề, chia nhóm 5 câu, hiển thị số câu nhớ vững thật; không render 128 bài cùng lúc |
| Ôn tập | Ưu tiên đến hạn, mỗi lượt tối đa 10 câu, mở thêm danh sách theo nhóm 8; tiếp tục gọi session thật |
| Buổi học | Skin Studio, hình theo bối cảnh chủ đề, thẻ/xếp câu/tự nhớ hiện hành; giữ onResult/onNote, API grading, feedback, retry và focus trap |
| Luyện tập/tiến bộ | Thành phần nghiệp vụ hiện hành được trình bày trong Studio với bố cục, màu, typography, card mới; giữ scenario grading, chart và microphone |
| Tài khoản | Giữ auth/Google entry, recovery, sync/error, profile, export/import/reset/delete; skin Studio responsive |

Tất cả các màn đã có bản local review được. Đây là UI mới trên logic học hiện hữu; chưa phải thiết kế lại thuật toán học hay hoàn thành mọi cải tiến sản phẩm trong product-review.

## Kiến trúc và source map

- `frontend/src/main.jsx`: App vẫn sở hữu state điều hướng, dailyPlan, start/speak/save, callbacks và session. Nhánh DEV lazy-load `StudioWorkspace` truyền controller; không tạo provider/account/progress thứ hai.
- `frontend/src/components/studio/StudioWorkspace.jsx`: shell, chọn màn, overlays, nối thành phần hiện hữu.
- `StudioHome.jsx`: trang chủ.
- `StudioLibrary.jsx`: TopicTile, PhraseCard, thư viện và saved.
- `StudioReview.jsx`: review và path.
- `studio-data.js`: ánh xạ minh họa/nhãn, không chứa bài học hoặc tiến độ giả.
- `studio.css`, `studio-learning.css`: chỉ scope `.studio-app` và các class Studio. Không thay stylesheet legacy.
- `components/FieldScene.jsx`: tách minh họa SVG đã có khỏi prototype để dùng chung, không tải progress demo theo.
- `StudySession` / `ContextPractice`, `PhrasalHub` / `PhrasalStories`: thêm prop minh họa tùy chọn; default vẫn hình cũ. Không đổi chấm điểm.
- `backend/db/adapters/pglite.js`: fix parser SQL DATE OID 1082 giữ `YYYY-MM-DD`, giống PostgreSQL adapter.

## Lỗi phát hiện và xử lý

1. PostgreSQL local 127.0.0.1:54329 không chạy: dùng env PGlite ở terminal, không sửa `.env`.
2. E2E cũ tìm nút `Sẵn sàng thử nhớ` đã bị thay từ trước. Thêm `e2e/helpers/study.js` thực hiện lật thẻ, xếp đúng từng từ, kiểm tra xếp, rồi tự nhớ. Giữ các assertion correctness/retry/persistence cũ.
3. Test bookmark cũ kỳ vọng phrasal là list 128 câu. Chuyển sang thư viện chủ đề, vẫn kiểm tra search/bookmark/reload/path.
4. PGlite trả DATE thành timestamp, làm sai contract ngày của progress khi đọc lại. Sửa ở adapter, thêm regression query và transaction; test đồng bộ hai trình duyệt giữ assertion ngày chỉ `YYYY-MM-DD`.
5. Serif fallback cho một số chữ Việt nhìn tách dấu: tiêu đề tiếng Việt dùng font local Be Vietnam Pro; tiếng Anh trong câu và artwork vẫn có serif.

## Bằng chứng kiểm tra

- `npm test`: 14/14 pass.
- `npm run test:api`: 21/21 pass, gồm regression PGlite DATE.
- `npm run test:e2e`: 21/21 pass tại thời điểm kiểm tra toàn bộ sau fix; gồm cả legacy, prototype, Studio, đồng bộ hai thiết bị và thất bại lưu phải báo đúng.
- `npm run build`: pass; Studio không vào bundle production do DEV gate.
- `npm run test:offline`: 1/1 pass trên build production hiện hành, không phải chứng nhận offline cho Studio production.
- `e2e/studio.spec.js`: tìm/lưu/reload/tự nhớ thật, onboarding, reduced-motion, axe WCAG A/AA trên home, 9 màn ở 390px và 1440px không tràn ngang.
- `e2e/cloud.spec.js`: cùng regression chạy cho legacy và Studio; tạo tài khoản test, chặn API save, thử lại, kiểm tra DB, đăng nhập browser thứ hai, xử lý session hết hạn và dọn tài khoản test.
- Ảnh `artifacts/studio-{home,topics,phrasal,review,saved,path,practice,insights,account}-{390,1440}.png`, không commit artifact.

## Giới hạn phải giữ rõ

- SVG dùng lại theo bối cảnh chung, chưa có minh họa riêng từng từ/câu hoặc đầy đủ 16 chủ đề khác nhau. Không mô tả ảnh như định nghĩa chính xác của mọi câu.
- Animation minh họa hiện chỉ có cafe/bus trong component sẵn có; home dùng cafe. Mini quiz hành động không cộng vào mastery.
- Đọc/hội thoại phrasal hiện hành có phần tự luyện chưa đồng bộ; riêng bài ga có API của nó. Chưa gom station vào global export/reset/planner.
- Browser TTS hiện hành: giọng phụ thuộc thiết bị; không tạo audio trả phí.
- Chưa xác minh OAuth Google thật trên local, Safari/iOS thật hoặc đánh giá người học. Axe home không thay thế audit toàn ứng dụng.
- Tên topic selection vẫn state trong App, không có URL riêng từng chủ đề như trước. Chuyển UI giữ tiến độ nhưng không giữ mọi modal đang mở.

## Bước tiếp theo

1. User mở Studio local và đánh giá các màn học, phrasal, thư viện, mobile. Tiếp nhận feedback về mật độ, màu và hình.
2. Hoàn thiện các màn cần điều chỉnh; kiểm tra production Studio khi quyết định chuyển default, vì hiện build không chứa Studio.
3. Trước phát hành Studio: kiểm tra preview deployment, OAuth callback/cookie, PWA upgrade, loading/error mạng thật; cập nhật guide và mới push/deploy theo yêu cầu.
4. Đợt nội dung sau: xác định coverage theo CEFR/tình huống/sense; nguồn có license hợp lệ, nguồn gốc và attribution lưu cùng dữ liệu. Viết bài mới theo mục tiêu và context, không sao chép đoạn từ web rồi đổi chữ. Pipeline schema/validation/review trước import DB; giữ ID ổn định và không tăng số lượng bằng câu trùng.
5. Nội dung mới ưu tiên nhiều đoạn ngắn/hội thoại dùng lại cùng cụm trong context khác, hình đúng nghĩa và bài tự nhớ sau khoảng cách. Đợt hiện tại không thu thập internet hoặc tăng catalog.
