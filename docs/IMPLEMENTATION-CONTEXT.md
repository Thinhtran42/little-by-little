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

## Mốc Field Notes — bản thử local theo yêu cầu mới

- Các thay đổi station/UI trước đó đã nằm trong commit d6eb5c7 trên main; ghi chú “chưa push” ở mốc cũ không còn áp dụng cho commit đó.
- Người dùng yêu cầu nâng bank từ/phrasal/mẫu câu và trùng tu UI nhưng phải thử local trước khi áp dụng. Không push/deploy bản thử này.
- URL `http://localhost:5173/?preview=field-notes`, về bản gốc bằng `/`. main.jsx chỉ lazy-load preview trong DEV; production loại mã preview.
- `shared/field-notes.js`: 6 tình huống, 36 mục có ví dụ/nghĩa/lỗi dễ nhầm, 6 đoạn đọc, 6 hội thoại (36 lượt). Nội dung tách khỏi catalog 640 mục và chưa publish vào database.
- `FieldNotesPreview.jsx` + `field-notes.css`: phong cách sổ tay, 6 minh họa SVG local, search/filter, flashcard, bài điền, ghi đúng/sai/gợi ý và ngày ôn local, reduced motion, nút về UI hiện tại.
- Giới hạn: progress preview chỉ localStorage riêng; chưa server sync, chưa SRS thích nghi, chưa bài vận dụng câu tự do, chưa audio tự nhiên. Không báo đã hoàn thành các phần này.
- Test: 14 unit pass, 3 Playwright pass; build production pass. Đã xem ảnh desktop/mobile và chỉnh CSS nav ảnh hưởng từ giao diện cũ.
- Dev chạy lại với DATABASE_URL rỗng + DB_DRIVER=pglite; ports 3001/5173. Không sửa .env hoặc dùng production DB.
- Chi tiết thiết kế, đường dẫn, kiểm thử và thứ tự triển khai tiếp trong `docs/FIELD-NOTES-PREVIEW.md`.

## Studio v2 (09/09/2026)

- Người dùng muốn wow hơn và hỏi nghiên cứu màu. Đã tra nguồn Elliot 2015, nghiên cứu signaling, WCAG; ghi rõ bằng chứng và giới hạn trong FIELD-NOTES-PREVIEW.md.
- Preview mặc định Studio, nút chuyển về Sổ tay; vẫn chỉ DEV, chưa push/deploy.
- Hero có 3 cụm bấm chọn, pin chỉ vị trí, nghĩa/câu ví dụ + loa; màu kem/xanh mực/cobalt/vàng, khung cảnh có chiều sâu, animation ngắn. Motion có nút giảm và tôn trọng prefers-reduced-motion. Giọng vẫn từ thiết bị.
- Đã xem ảnh desktop và kiểm tra responsive; cặp chữ chính/phụ/nút/highlight có contrast >4.5:1. Đây không phải audit toàn bộ accessibility.
- Kiểm tra cuối: 4/4 Playwright pass, gồm đổi cụm trong cảnh, Studio/Sổ tay, reduced-motion, học/lưu kết quả, 390px/1440px và về UI gốc.

## Action scenes v3 — 09/09/2026

- Đã triển khai theo đồng ý của user: `ActionScene.jsx`/`action-scene.css` cho pick it up (nhấc cốc) và get off (bước khỏi xe). Tích hợp vào story cafe/bus và chip pick it up trên hero.
- Có phát lại, trạng thái Trước/Sau, xử lý reduced-motion và thử điền cụm với giải thích. Mini quiz không cộng progress, không gọi server/TTS API. Vẫn DEV preview tại `/?preview=field-notes`, UI production giữ nguyên.
- 5/5 Playwright qua; test bổ sung kiểm tra cả hai animation hoàn tất cũng qua. Xem ảnh trạng thái sau ở artifacts/action-cafe-after.png và action-bus-after.png; bố cục/động tác hợp lý.
- Không push/deploy. Bước tiếp: nhận phản hồi local; nếu duyệt mới mở rộng các động tác cho put away/try on/call off và nối kết quả vào backend theo kế hoạch.

## Bàn giao redesign toàn app cho model nhỏ — 09/09/2026

- Người dùng đã đồng ý hướng Studio và yêu cầu file MD chi tiết để model nhỏ triển khai, model chính kiểm tra sau.
- Tài liệu chính: `docs/STUDIO-REDESIGN-HANDOFF.md`. Gồm source map, invariants, token/motion, từng màn, kiến trúc DEV preview App thật, đợt 0–8, test matrix, mẫu progress và prompt cho implementer/reviewer.
- Giao diện full Studio CHƯA được triển khai. Đợt đầu cần baseline và inventory; prototype hiện có không thay thế catalog/account thật.
- URL đề xuất cho full app thử: `/?preview=studio-full`; chưa tồn tại ở thời điểm viết tài liệu. `/` và `/?preview=field-notes` giữ nguyên.
- Chưa tạo progress thực thi hoặc đánh dấu bất kỳ đợt full redesign DONE. Không push/deploy.

## Full Studio local đã triển khai — 09/09/2026

- User yêu cầu bắt đầu nâng cấp toàn giao diện trước; mở rộng vocabulary/đoạn đọc và nghiên cứu nguồn dữ liệu để sau. Phần ghi CHƯA triển khai ở mục trước đã được thay thế bởi trạng thái này.
- Có `http://localhost:5173/?preview=studio-full`, dùng controller/callback/catalog/progress thật từ App. `/` giữ UI hiện hành. Studio chỉ DEV, chưa push/deploy.
- Đã làm shell/mobile, home gọn, chủ đề có SVG, thư viện/search/saved chia nhóm, phrasal theo tình huống, path chọn từng topic, review lượt tối đa 10; đồng bộ presentation study/practice/insights/account.
- Tách `components/studio/` và `FieldScene.jsx`; truyền illustration tùy chọn vào ContextPractice/PhrasalStories, giữ luồng chấm và sync cũ.
- Fix adapter PGlite DATE trả timestamp khác PostgreSQL; thêm regression. Cập nhật E2E stale sang luồng lật thẻ → xếp câu → tự nhớ. Cloud regression chạy cả hai UI.
- Kiểm tra: 14 unit, 21 API, 21 E2E pass; build pass; offline production hiện hành 1/1. Xem chi tiết và giới hạn tại `docs/STUDIO-REDESIGN-PROGRESS.md`.
- Local đang chạy PGlite qua env terminal do Postgres local chưa chạy; không sửa `.env`/bí mật. Dev frontend 5173/API 3001.
- Tiếp theo: user review local; hoàn thiện feedback rồi mới quyết định áp dụng production. Chưa làm content expansion, paid audio, hay rewrite thuật toán học.

## Studio trở thành giao diện chính — 09/09/2026

- User đã duyệt và yêu cầu thay UI cũ, kiểm tra rồi push GitHub.
- App hiện render Studio trên `/` cả dev/production. Bỏ legacy JSX và TopicCard khỏi main; giữ controller, providers và stylesheet nền còn được các component dùng. Bỏ nhãn xem thử/link UI cũ.
- Cập nhật regression theo thư viện phân trang/lộ trình một chủ đề/mobile menu mới. 21 E2E pass; build và offline production Studio pass; npm audit production 0 vulnerabilities.
- Prototype field-notes chỉ DEV, không vào production bundle. Mở rộng nội dung và TTS tính phí vẫn nằm ngoài đợt này.
