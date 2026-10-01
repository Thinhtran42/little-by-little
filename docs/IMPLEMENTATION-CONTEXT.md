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

## Kế hoạch nội dung và tương lai — 09/09/2026

- User yêu cầu kế hoạch vocabulary/đoạn văn/chủ đề/nguồn và hướng phát triển. Đã đọc catalog, schema, seed, CatalogContext, product-review và tra nguồn chính thức trên internet.
- Tài liệu: `docs/CONTENT-ROADMAP.md`. Đề xuất A2–B1, 6 nhóm lớn/24 chủ đề con, sense thay vì lemma đơn thuần; mỗi bài 3 đoạn và 2 hội thoại phân bổ qua học/ôn.
- Mốc tích lũy 12 → 48 → 144 bài, có cổng biên tập, thử người dùng, quyền nguồn, unified progress và versioned publishing trước mở rộng.
- Nguồn: CEFR/Nation để lập coverage; Tatoeba chọn lọc với license/attribution; VOA chỉ phần tự sản xuất; Commons theo từng asset; Wiktionary/Gutenberg có điều kiện riêng. Không nhập nội dung British Council thương mại mặc định, không xem đổi chữ bằng AI là sở hữu bản quyền.
- Phát hiện cần xử lý khi thực thi: seed `ON CONFLICT DO NOTHING` không cập nhật bài tồn tại; catalog đang tải/cache toàn bộ; station/đọc/mini quiz chưa đồng nhất global progress.
- Bước triển khai đề xuất CONTENT-01: audit/map 640 mục, schema+validator+source manifest, hai bài mẫu đầy đủ trước nhân rộng. Chỉ viết kế hoạch, chưa import/migration/TTS trả phí, chưa push tài liệu đợt này.

## Điều chỉnh ưu tiên nội dung — 11/09/2026

- User chốt đợt 1 phải nâng chất lượng bài học, bổ sung đoạn đọc/từ vựng từ nguồn mạng và dùng ảnh chụp thật, không phải illustration hiện tại. Đợt 2 mới nối kết quả/tiến độ tài khoản và hoàn thiện phần thiếu.
- Cập nhật đầu `CONTENT-ROADMAP.md` để ưu tiên mới ghi đè kế hoạch cũ đặt progress/API trước content. Không tự rewrite backend trong đợt 1.
- Đã tra Pexels/Unsplash license, VOA source và tìm 3 trang ảnh ứng viên (cafe, cửa hàng, sân ga). Chưa tải ảnh, chưa nhập bài hay thay UI; không được báo các ứng viên là asset đã kiểm tra trực quan.
- Nội dung thích nghi phải lưu source/credit/license; ảnh thật phải đúng bối cảnh, lưu tối ưu local/storage. Không dùng Google Images tùy ý hoặc ảnh AI giả làm ảnh chụp để đáp ứng yêu cầu này.

## CONTENT-01: sáu bài đầu và ảnh thật — 11/09/2026

> Cập nhật 12/09: đã nâng lên đủ 12 bài; xem mục cuối tài liệu cho trạng thái hiện tại.

- User nói “oke bắt đầu”; đã triển khai tại local, thay thế trạng thái chưa tải ảnh/nhập bài ở mục trước. Không push/deploy đợt này.
- `docs/CONTENT-IMPLEMENTATION.md` ghi đầy đủ file, nguồn, giới hạn và bước tiếp. URL `http://localhost:5173/#reading`.
- 6 bài / 12 đoạn / 6 hội thoại / 30 mục từ-cụm; hai bài tham khảo VOA và viết tình huống mới, bốn bài tự biên soạn. Có dịch, highlight tương tác, ví dụ, ghi chú, đọc hiểu và tự nhớ. Đây là 6/12 bài pilot, chưa hoàn thành roadmap.
- Sáu ảnh Pexels thật đã tải và xem trực quan, WebP local ~633 KB; registry lưu tác giả/URL/license/crop/alt. Studio chính chuyển các cảnh đã tích hợp sang RealPhoto; còn tái dùng ảnh giữa nhóm chủ đề, chưa có ảnh riêng từng từ. Prototype DEV giữ SVG.
- Dữ liệu mới static trong shared/reading-lessons.js, không sửa seed hay DB. Kết quả tự luyện mới chưa persist/sync/XP/SRS; user đã để phần này sang đợt 2. Giọng đọc vẫn từ thiết bị.
- 15 unit, 24 E2E, build và 2 offline qua. Sau sửa focus/cuộn mở bài, 3 E2E đọc qua lại; kiểm tra axe toàn trang ở mobile/desktop và ảnh chụp. Không chạy lại API suite vì không sửa backend.
- Dev đang chạy PGlite (env terminal, không sửa .env), frontend 5173/API 3001. Tiếp theo review nội dung và sáu bài pilot còn lại; chưa nhập Tatoeba hoặc kho lớn.

## CONTENT-02: sửa ảnh và đủ 12 bài pilot — 12/09/2026

- User chỉ chọn làm 1 và 2 trước: sửa ảnh theo ngữ cảnh + sáu bài còn lại. Đã xong, chưa push/deploy.
- Thêm shared/reading-pilot-two.js, gộp vào readingLessons: tổng 12 bài / 24 đoạn / 12 hội thoại / 60 mục từ-cụm. Sáu bài mới tự biên soạn: sức khỏe, khách sạn, thư viện, hỗ trợ kỹ thuật, board game, quyên góp cộng đồng. 12 bài có ảnh riêng theo bối cảnh chính.
- Thêm 10 ảnh chụp Pexels đã tải/kiểm tra trực quan; tổng 16 WebP (~1.31 MB). Sửa ánh xạ studio-data cho health/learning/interview/phone/plans/tech/help/feelings/entertainment/travel; truyện phrasal du lịch dùng hotel, sân ga vẫn dùng bus. Registry nguồn/alt/credit đầy đủ. Không thay đổi dữ liệu phrasal hay thuật toán.
- 16 unit / 24 E2E pass, build precache 42 file. Offline test mở thêm bài mới và ảnh phòng khám. Xem docs/CONTENT-IMPLEMENTATION.md cho chi tiết và giới hạn.
- Tiến độ bài đọc mới vẫn state màn hình, không persist/sync. Phần phrasal chuyên sâu, rà catalog cũ, progress/backend tiếp tục để sau. Nội dung chưa được giáo viên thẩm định độc lập.

## Đánh giá Destination và kiểm tra DB — 27/09/2026

- User yêu cầu đánh giá Destination B1/B2 và kiểm tra DB, chuyển Supabase nếu cần. Đã đọc mục lục B1/B2, sample B2 và hướng dẫn licensing chính thức Macmillan. Khuyến nghị dùng đối chiếu curriculum, B1 nền/B2 nâng cao, viết nội dung độc lập; chưa nhập sách hoặc liên hệ nhà xuất bản.
- Chi tiết và runbook: `docs/DESTINATION-AND-DATABASE-REVIEW.md`. Không tuyên bố đã đọc toàn bộ sách hoặc có license.
- PostgreSQL local trong .env trả ECONNREFUSED; PGlite .data/postgres đọc được: 1 user/1 settings/1 session, 640 phrases, 16 topics/16 scenarios, các bảng tiến độ/bài làm trống. Không in dữ liệu cá nhân. Đây không phải production.
- Render API dùng credential local trả HTTP 400, probe production health không phản hồi trong 20 giây. Chưa xác minh trạng thái/hạn DB production; không kết luận dữ liệu đã mất hoặc key đã hết hạn.
- Không tìm thấy cấu hình Supabase; đã hỏi user có project chưa, đề nghị lưu connection string vào .env.supabase local. Có `.env.supabase.example`; mở rộng gitignore .env.* và ngoại lệ example. Kiểm tra Git chỉ tracked .env.example/.env.render.example ở thời điểm này.
- 21/21 API/backend tests qua (PGlite + mock PostgreSQL), không phải test Supabase thật. Không đổi runtime/backend/schema/production, chưa migrate/seed/cloud/push/deploy. Thiếu target và source production để chuyển dữ liệu an toàn; user đã cho phép chuyển nếu cần, không hỏi lại quyền khi có đủ thông tin.

## B1/B2 tích hợp — 27/09/2026

- User muốn triển khai ngay hệ thống dựa trên B1/B2. Đã giải thích dùng curriculum tự viết, không nhập/paraphrase sách hoặc giả có quyền Macmillan. Không xin giấy phép vì không dùng nội dung sách. Tài liệu `docs/B1-B2-IMPLEMENTATION.md`.
- Có route #courses, 12 bài B1 từ pilot + 6 bài B2 mới, 18 grammar notes, 54 checkpoint questions. Thư viện tăng lên18 bài/36 đoạn/18 hội thoại/90 mục từ-cụm theo bài. Có flashcard/loa, đọc song ngữ, hội thoại, câu hỏi, link kho 640 câu cũ.
- Server chấm checkpoint theo registry versioned; dùng lesson_attempts hiện có. Generic lessons service mở rộng nhưng giữ station endpoints. Courses routes/service/repository tách rõ; CSRF/user isolation/idempotency/404/400/409 có tests. Account giữ kết quả reload/thiết bị khác; lỗi lưu không báo thành công.
- Correct không hint ôn ngày mai, sai/hint ôn hôm nay; chưa SRS thích nghi. Kết quả khóa học hiện riêng, chưa global streak/XP/Insights/export. Guest state chỉ màn hình; bài tự luyện ReadingLesson vẫn chưa lưu. Đừng nói đã hợp nhất toàn bộ progress.
- 17 unit,22 API qua; targeted course/station sau refactor cũng qua. Browser có28 test, một timeout bài đọc do18 bài tuần tự đã sửa budget riêng,7 affected tests pass lại. Build pass; bổ sung offline course test. Xem docs cho kết quả chốt.
- Chưa đầy đủ toàn bộ trình độ B1/B2, chưa nhập toàn bộ hai sách, chưa CEFR chứng nhận/chuyên gia review. Không push/deploy, không chuyển Supabase (chưa credentials). Dev đang chạy 5173/3001 PGlite.

## Chốt kiểm thử và mở local — 28/09/2026

- User yêu cầu tiếp tục. Đã hoàn tất phần kiểm thử còn lại và bàn giao bản B1/B2, không mở thêm scope mới.
- Lượt kiểm tra cuối:17 unit/22 API/28 E2E qua. Sau mất exec session qua ngày, chạy lại build production và3 offline: tất cả qua; git diff --check không lỗi khoảng trắng.
- Sửa UI tab checkpoint nằm dọc do CSS kế thừa và màu chuyển tab làm giảm contrast; axe cả overview/checkpoint ở390/1440px qua. Link reading→đúng course đã kiểm tra trực tiếp.
- Đã khởi động lại dev PGlite qua env terminal, không sửa.env: http://localhost:5173/#courses, API3001. Runtime local không phải Supabase; không gọi là đã migrate. Chưa commit/push/deploy.
- File bàn giao chính:docs/B1-B2-IMPLEMENTATION.md. Giữ các giới hạn curriculum/progress/export/SRS trong đó cho lần sau.

## Hoàn thiện vòng học và tiến độ — 28/09/2026

- User yêu cầu tiếp tục hoàn thiện app. Đã nối khóa học B1/B2 vào trang chủ, Ôn tập và Tiến bộ bằng LearningOverview. Thống kê ngày học gộp daily_activity/attempts/scenario_attempts/lesson_attempts, mỗi ngày một lần; XP và số câu catalog giữ nghĩa riêng.
- Quy tắc ôn mới trong shared/course-review.js: 1/3/7/14/30 ngày cho tự nhớ đúng qua ngày đến hạn khác nhau; lặp trong ngày không tăng mức; sai/hint quay hôm nay; choice không tăng productive level. Chưa là mô hình trí nhớ được hiệu chỉnh.
- Migration 2 thêm review_level/last_passed, giữ lịch sử cũ, chạy lặp có test. Export tài khoản transaction/lockUser bao gồm lịch sử quiz; reset xóa quiz đúng user. Import chỉ kho câu/cài đặt, có giải thích trên UI; không nhập archive thành bằng chứng thành thạo.
- Thêm PhrasalCourseGroups bốn nhóm tình huống mở đúng bài ngữ cảnh. Trang chủ thay khối giới thiệu tĩnh bằng gợi ý học/ôn để tránh thêm quá nhiều khối.
- npm run check trên source cuối:20 unit/22 API/29 E2E/build/3 offline đều qua. Bao gồm account reload/thiết bị khác, export/reset, lỗi lưu, nhóm phrasal, mobile/desktop và axe các màn hình course. npm audit --omit=dev:0 vulnerabilities.
- Dev đang chạy http://localhost:5173 (API3001), PGlite local qua env terminal, không sửa.env. Chưa push/deploy/Supabase. Không có nguồn/đích production được xác minh để migrate. Không bật TTS tính phí.
- Tài liệu mới docs/APP-COMPLETION.md ghi phạm vi, nghiệm thu, release/rollback và các việc còn lại; docs/B1-B2-IMPLEMENTATION.md đã cập nhật các giới hạn progress/export/SRS cũ. Ưu tiên tiếp: review thực tế người học/giáo viên, DB production backup/restore/staging khi có kết nối, mở rộng bài luyện nghe/viết và CMS có version.

## Làm lại phrasal verb — 29/09/2026

- User yêu cầu thay toàn bộ giao diện/bài học phrasal vì rối và ảnh không ổn. Đã thay PhrasalHub bằng thư viện thống nhất và ba bước ngữ cảnh → flashcard/cách dùng → tự nhớ/ghép câu. Bỏ hai danh sách chồng nhau khỏi StudioWorkspace, giữ bài station và dữ liệu cũ trong mục riêng.
- shared/phrasal-lessons.js:6 bài gốc/24 mục cụm/6 đoạn song ngữ/36 lượt thoại/30 câu luyện. Dạy từng nghĩa với mẫu tân ngữ và lỗi thường gặp. Không sao chép sách. Mức A2–B2 là định hướng biên tập.
- Thêm registry phrasal riêng vào service hiện có và /api/me/phrasal endpoints; server chấm/auth/CSRF/version/idempotency. Lưu lesson_attempts, lịch ôn shared/course-review; ghép từ dùng choice nên không tăng mức tự nhớ. Export/reset/ngày học có bao gồm; chỉ số B1/B2 không bị trộn. Không cần migration mới ngoài migration2 từ đợt trước.
- Sửa ảnh: thêm pv-dishes và pv-fitting từ MART PRODUCTION/Pexels có credit/license/alt, tải WebP local; trực quan xem lại cả6ảnh/crop. Tổng registry18ảnh. Không dùng SVG cũ ở trang phrasal mới. Caption giải thích liên hệ hành động và ảnh; nhân vật hư cấu.
- Đã xử lý CSS nav toàn cục gây bộ lọc xếp dọc, chữ số thẻ thiếu contrast và tiêu đề màn hình bị lặp. Các bước bài giữ quiz state khi đổi tab. Có reduced motion, retry lỗi tải/lưu, không báo thành công giả.
- Ngày29/09 tiếp tục từ phiên bị ngắt: exec/dev cũ không còn, đã mở lại dev5173/API3001 với PGlite qua env terminal. Ba test trước bị lỗi:2test còn trông chờ heading phrasal cũ đã sửa selector theo thiết kế mới;1test topics gặp error boundary ở lượt trước, chạy lại cả3đã qua. Bộ check cuối được chạy lại để xác nhận toàn hệ thống.
- Bàn giao/nguồn ảnh/giới hạn:docs/PHRASAL-REDESIGN.md. Chưa push/deploy/đổi database hoặc bật TTS trả phí. Giọng vẫn dùng hệ thống sẵn có. Khách không có tiến độ cloud; ghi tài khoản cần online.
- Chốt kiểm thử29/09: npm run check qua21unit/23API/33E2E/build/4offline, gồm test phrasal offline mới. Không còn lỗi test trong lượt cuối. Dev local5173/API3001 vẫn chạy. Hình desktop/mobile đã xem trong artifacts; ảnh rõ, bộ lọc ngang, không tràn màn hình.

## Phrasal: hoàn thiện hàng đợi và sửa lỗi — 29/09/2026

- Thay cơ chế mở từ câu đầu cần học rồi chạy tới cuối bằng queue đúng từng câu: câu đến hạn cũ trước, rồi câu chưa học; bỏ câu tương lai. Khi không có câu cần học, hiện ngày ôn và nút luyện thêm chủ động.
- Thêm kết quả từng câu cho cả khách và tài khoản, luyện riêng câu sai/gợi ý. Điểm lần trả lời đầu trong lượt giữ nguyên sau sửa sai; trạng thái từng câu cập nhật lần gần nhất. Đây không phải điểm thành thạo.
- Thêm tìm theo cụm, nghĩa Việt không dấu/có dấu/chữ hoa, tiêu đề; kết hợp chủ đề và chỉ bài đến hạn. Trạng thái rỗng có nút xóa bộ lọc. Logic thuần trong shared/phrasal-practice.js, không đổi DB/ID/version.
- Kiểm thử:23unit/23API/34E2E toàn suite qua; thêm1E2E riêng all-future/đến hạn/luyện thêm cũng qua (tổng35E2E hiện có). Hai unit liên quan chạy lại qua sau sửa Đ hoa. Tài liệu PHRA​SAL-REDESIGN.md bổ sung hành vi. Không push/deploy; dev local5173/API3001 vẫn chạy.

## Mở rộng phrasal từ6 lên18bài — 29/09/2026

- User: ít bài quá. Thêm12bài tự biên soạn trong shared/phrasal-expansion.js, gộp registry trước assessment. Tổng18bài/72mục cụm theo bài/69cụm khác nhau/18đoạn song ngữ/108lượt hội thoại/90câu luyện. Tám nhóm tình huống; xem PH​RASAL-REDESIGN.md cho danh sách.
- Giữ nguyên6bài cũ, ID/version/progress. Ba cụm lặp để luyện nghĩa hoặc bối cảnh khác; không dùng số lượng để tuyên bố độ phủ CEFR. Ảnh từ registry có sẵn, đúng nhóm cảnh; không phát sinh chi phí hoặc tải dữ liệu sách.
- UI mở6thẻ rồi Xem thêm6; tìm/lọc toàn bộ18bài và reset giới hạn hiển thị. API dùng registry mới, đã restart backend để nhận12ID mới, dev5173/API3001 PGlite. Không sửa.env/push/deploy.
- Đã bổ sung unit kiểm tra tổng số và toàn bộ highlight/ảnh/question; browser đi qua18bài (timeout riêng90s), kiểm tra mở18thẻ và nhóm học tập. Đang chốt npm run check; cập nhật kết quả ngay sau khi hoàn tất.
- Kết quả cuối: `npm run check` qua 23 unit / 23 API / 35 E2E / build / 4 offline. Toàn bộ 18 bài mở được, ảnh tải, highlight, bản dịch và hội thoại qua kiểm thử. Không còn công việc kiểm thử chờ trong đợt này; local vẫn chạy để user xem.

## Khóa công việc và gom danh mục — 02/10/2026

- User yêu cầu tiếp tục hoàn thiện, sắp xếp danh mục và dùng ảnh có ngữ cảnh. Menu chính còn 6 mục: Tổng quan / Khóa học / Thư viện / Ôn tập / Tiến bộ / Cài đặt. Hai trang nhóm mới, thanh điều hướng con và URL cũ được giữ; trang chủ giảm thẻ chủ đề.
- Thêm khóa công việc tự biên soạn trong shared/work-course.js: 20 buổi / 4 tuần, 20 đoạn đọc, 60 mục mẫu câu, 80 lượt thoại, 20 nhiệm vụ mở, 60 câu kiểm tra. Bốn buổi thử sức nằm trong tổng 20 buổi. Ảnh thật tái sử dụng registry local theo bối cảnh, không thêm ảnh trang trí vào danh mục.
- WorkCourse.jsx dùng ba phần tình huống / tự diễn đạt / kiểm tra. API /api/me/work-course dùng registry và service hiện có, lưu lesson_attempts theo tài khoản, lịch ôn, phiên bản, retry; không cần migration mới. Điểm kiểm tra không phải bằng chứng thành thạo. Bản nháp chỉ giữ trong bài đang mở, chưa lưu server hoặc chấm bài mở.
- Đã sửa nhãn textarea bằng htmlFor/id và tắt transition màu tab gây contrast thấp. Mở đủ 20 bài qua browser; xem ảnh giao diện desktop/mobile.
- npm run check cuối qua: 24 unit / 24 API / 40 E2E / build / 5 offline. git diff --check không có lỗi whitespace. Dev localhost:5173, API3001, PGlite qua env terminal; không sửa .env, chưa push/deploy/migrate Supabase/bật thanh toán hoặc TTS trả phí.
- Bàn giao chi tiết: docs/WORK-COURSE-AND-NAVIGATION.md. Còn cần pilot người học/giáo viên, lưu bài viết và phản hồi, xác minh backup/restore production trước kinh doanh; không tuyên bố toàn bộ app đã sẵn sàng bán.

## Tăng cường cách học — 02/10/2026

- User muốn tăng cường bài học và cách học. Đã bổ sung 20 câu đọc hiểu tự biên soạn với giải thích riêng cho 20 bài công việc; tab nghe–viết lại sử dụng 60 mẫu câu có sẵn, luyện lại riêng câu sai/có hỗ trợ, gợi ý nói theo/thay chi tiết.
- shared/work-practice.js giữ dữ liệu đọc hiểu và normalization; WorkPractice.jsx tách component khỏi WorkCourse. Không thay checkpoint/version/schema. Kết quả luyện nghe/đọc hiểu mới chỉ giữ trong màn hình, chưa đồng bộ server hoặc đưa vào SRS. UI giải thích rõ giới hạn; không chấm phát âm, không bật TTS trả phí.
- Test mới kiểm tra coverage nội dung, normalization, feedback đọc hiểu, câu dùng hỗ trợ không tính độc lập, retry chỉ câu cần luyện, state khi đổi tab, axe/layout 390 và 1440. Bảy E2E liên quan đã qua; 26 unit và build production qua. Đang chốt 5 offline; không chạy lại API vì không sửa backend. Xem tài liệu WORK-COURSE-AND-NAVIGATION.md cho hướng kế tiếp. Chưa push/deploy; local vẫn mở.
- Chốt kiểm thử: 26 unit / 7 E2E liên quan / build / 5 offline đều qua; đã xem screenshot mobile phần luyện nghe. Không còn test chờ trong đợt này.

## Đánh giá tình huống và định vị — 02/10/2026

- User hỏi nâng mục tình huống thật, nối lịch ôn kỹ năng, khác biệt thị trường. Đã đọc ProductPages.jsx/course-review.js/lesson repository và nguồn hãng ELSA/Babbel/Duolingo; trả lời phân biệt hiện trạng và đề xuất. Không sửa code trong lượt tư vấn.
- docs/SCENARIO-SKILL-REVIEW-PLAN.md ghi ba vòng hỗ trợ → tự tạo câu → biến thể, dữ kiện hình ảnh, schema attempts/state theo kỹ năng, migration giữ dữ liệu, chấm server/idempotency/export/reset, hàng đợi ôn chung và pilot. Ưu tiên nối lịch ôn trước rồi làm sâu 6 tình huống, chưa triển khai các đề xuất này.

## Commit và kiểm tra tự deploy — 02/10/2026

- User yêu cầu commit và kiểm tra tự deploy. Đã quét file Git theo mẫu token/private key/database URL; các URL khớp là placeholder/test. .env và .env.render bị ignore, không đưa lên Git. Quét theo mẫu không phải bảo đảm tuyệt đối không có secret.
- npm run check qua 26 unit / 24 API / 43 E2E / build / 5 offline. npm audit phát hiện 1 high + 3 moderate; npm audit fix cập nhật 8 package tương thích, audit về 0. Chạy lại 24 API và build sau bản vá đều qua.
- Workflow Validate chạy khi push main: npm ci, audit production mức high, unit, API, build. Không có bước gọi deploy hook trong YAML; việc tự deploy phụ thuộc kết nối/cài đặt Render. .env.render có tên RENDER_API_KEY nhưng giá trị trống; chưa đọc được trạng thái Render bằng API trong lượt này.
- Trước push, website trả asset cũ /assets/index-Bmy1Ox2s.js. Bản build mới: /assets/index-BZJeXvN7.js, StudioWorkspace-DiFBRiXz.js. Dùng dấu vết này cùng CI để xác minh phát hành tự động; không bấm deploy tay để tránh nhầm với auto deploy.
