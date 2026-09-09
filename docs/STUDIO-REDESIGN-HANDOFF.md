# Bàn giao: chuyển toàn bộ Little by Little sang giao diện Studio

Ngày: 09/09/2026. Đối tượng: model triển khai nhỏ hơn và model kiểm tra sau đó.

## 0. Đọc phần này trước khi viết code

**Yêu cầu người dùng:** làm lại toàn bộ giao diện theo bản Studio đã được xem và đồng ý về hướng thẩm mỹ, giữ tính năng học đang có, thử local trước khi áp dụng chính thức. Người dùng muốn model nhỏ triển khai rồi model chính kiểm tra.

**Đầu ra mong muốn:** một giao diện Studio đầy đủ các màn, dùng dữ liệu và hành vi thật của app; giao diện cũ vẫn mở được để đối chiếu. Bản prototype 6 bài không được dùng để thay thế toàn bộ sản phẩm 640 mục.

**Phạm vi hiện tại:** triển khai và kiểm thử local. Không push, deploy, thay cấu hình Render, bật cloud billing, gọi TTS tính phí hoặc sửa database production trong nhiệm vụ này. Khi người dùng có chỉ dẫn mới thì chỉ dẫn đó ưu tiên hơn tài liệu.

**Cách làm:** mỗi lượt thực hiện đúng một đợt nhỏ trong mục 7; đọc source, sửa, chạy kiểm tra liên quan, cập nhật context. Không hoàn thành cả dự án bằng một file JSX khổng lồ hoặc một lớp CSS override phủ tất cả màn hình.

**Không coi tài liệu này là báo cáo công việc đã làm.** Các đợt bên dưới là kế hoạch. Chỉ đánh dấu DONE sau khi có code và bằng chứng kiểm tra.

## 1. Những gì đang có thật

### 1.1 Hai giao diện hiện tại

| Giao diện | URL local | Dữ liệu / đặc điểm |
|---|---|---|
| App hiện tại | `http://localhost:5173/` | Catalog 640 mục/16 chủ đề, tài khoản, planner, ôn tập, lưu tiến độ server cho user đăng nhập |
| Field Notes / Studio prototype | `http://localhost:5173/?preview=field-notes` | 6 bài biên soạn theo tình huống, 36 mục, 6 đoạn đọc, 6 hội thoại; progress local riêng |

Prototype chỉ được lazy-load khi `import.meta.env.DEV`. Bản production hiện không chứa prototype này. Đây là cơ chế cần giữ trong thời gian làm lại giao diện.

Trong prototype có hai lựa chọn Studio/Sổ tay, tìm kiếm, đọc/dịch, flashcard, bài điền cụm, nút giảm chuyển động. Animation `pick it up` và `get off` có phát lại, Trước/Sau, mini quiz.

**Các giới hạn không được che giấu:**

- `lbl-field-notes-preview-v1` là localStorage riêng, không phải tiến độ account.
- Mini quiz trong ActionScene chưa cộng vào tiến độ/SRS.
- Thời gian ôn prototype 10 phút/1 ngày là quy tắc thử nghiệm, không phải thuật toán production.
- Giọng hiện có là speechSynthesis của thiết bị. Chưa tích hợp giọng cloud nam/nữ tự nhiên.
- Station lesson có backend riêng; lesson attempts chưa được đưa đầy đủ vào daily planner, export/reset toàn bộ tiến độ. Không tuyên bố đã xử lý các thiếu hụt này bằng việc đổi UI.
- Các story phrasal cũ và mới có mức lưu tiến độ khác nhau; phải đọc module cụ thể trước khi hiển thị “đã hoàn thành”.

### 1.2 Trạng thái Git khi viết tài liệu

Commit nền đã biết: `d6eb5c7` trên `main`. Preview và tài liệu đang là thay đổi local chưa commit. **Phải kiểm tra lại `git status` khi bắt đầu** vì người dùng có thể sửa tiếp.

Không reset/clean worktree, không xóa những file untracked vì tưởng là rác. Không stage toàn bộ repo hoặc đưa artifacts/.env/.data vào commit.

### 1.3 Đọc tài liệu theo thứ tự

1. File bàn giao này.
2. [IMPLEMENTATION-CONTEXT.md](IMPLEMENTATION-CONTEXT.md): mốc mới nhất và giới hạn.
3. [FIELD-NOTES-PREVIEW.md](FIELD-NOTES-PREVIEW.md): lựa chọn thiết kế và hành vi prototype.
4. [PRODUCT-REVIEW.md](PRODUCT-REVIEW.md): vấn đề học tập, nguồn nghiên cứu, thứ tự ưu tiên.
5. [BACKEND-STRUCTURE.md](BACKEND-STRUCTURE.md), [DATABASE-PROVIDERS.md](DATABASE-PROVIDERS.md) nếu chạm tới dữ liệu/backend.

Không in file .env, token, password, OAuth secret hoặc database URL có mật khẩu trong tool output.

## 2. Bản đồ source để tránh tìm mò

| File / thư mục | Trách nhiệm hiện tại | Cách dùng khi redesign |
|---|---|---|
| `frontend/src/main.jsx` | App, state điều hướng/session, nhiều JSX trang, speak/save/toggle/start, root providers | Tách dần phần trình bày, giữ callbacks và state hoạt động |
| `frontend/src/state/CatalogContext.jsx` | Tải/cache catalog, refresh | Nguồn dữ liệu thư viện; không thay bằng fieldNotes |
| `frontend/src/state/LearnerContext.jsx` | Auth, sync queue, progress, attempts, import/reset | Nguồn duy nhất cho dữ liệu account và mutation |
| `frontend/src/services/api.js` | Fetch `/api`, cookie, CSRF, timeout/error | Dùng lại; không viết fetch riêng bỏ CSRF |
| `frontend/src/services/eventKey.js` | Khóa sự kiện | Giữ idempotency/retry, đọc cách component gọi trước khi sửa |
| `frontend/src/components/ProductPages.jsx` | Modal, Onboarding, PlanPanel, PathPage, PracticePage, InsightsPage, AccountPage | Tách sang từng file nếu cần; giữ chữ ký props/hành vi |
| `frontend/src/components/StudySession.jsx` | Buổi học, chấm/tiếp câu, VoiceRecorder | Giữ state machine, chỉ thay bố cục trước |
| `frontend/src/components/CloudAccount.jsx` | Đăng ký/đăng nhập/khôi phục, SyncBanner | Không loại bỏ các trạng thái lỗi/đang lưu khi đổi theme |
| `frontend/src/components/PhrasalHub.jsx` | Chọn nhóm hoặc bài station | Thay bố cục, giữ đường vào tất cả bài |
| `frontend/src/components/PhrasalStories.jsx` | Nhóm/đoạn đọc phrasal | Tận dụng dữ liệu, không giả là đã có server persistence |
| `frontend/src/components/StationLesson.jsx` | Bài station tích hợp API | Phải giữ resume, hinted/correct, idempotency |
| `frontend/src/components/ContextPractice.jsx` | Luyện trong context | Xem đầy đủ các mode trước khi refactor |
| `frontend/src/components/FieldNotesPreview.jsx` | Mẫu Studio, hiện gom cả view và local demo state | Lấy phong cách; KHÔNG sao chép cơ chế local account/progress sang app thật |
| `frontend/src/components/ActionScene.jsx` | Hai cảnh động, quiz khám phá | Tái sử dụng, truyền motion, không gán nghĩa cho scene không hỗ trợ |
| `frontend/src/components/field-notes.css`, `action-scene.css` | Style mẫu | Chuyển thành component/token có scope thay vì chồng thêm override |
| `frontend/src/style.css`, `product.css`, `cloud.css` | CSS app hiện tại, có selector toàn cục | Giữ cho legacy, kiểm tra xung đột nav/button/heading |
| `shared/catalog.js`, `content-expansion.js` | Catalog production | Không đổi ID, không reseed thay nội dung chỉ để sửa UI |
| `shared/progress.js`, `learning.js` | Tiến độ, planner, chuẩn hóa/chấm đáp án | Không viết lại thuật toán cho giống prototype |
| `shared/phrasal-stories.js`, `phrasal-episodes.js`, `scenarios.js` | Nội dung nhóm và tình huống | Giữ khả năng truy cập đầy đủ |
| `shared/field-notes.js` | 36 mục theo nghĩa/tình huống trong prototype | Corpus draft riêng; chưa coi là catalog API |
| `backend/modules/learning/` | Chấm/lưu tiến độ account | Backend quyết định kết quả, FE không gửi correct để được tin |
| `backend/modules/lessons/` | Station progress/attempts | Hợp đồng riêng, không trộn vào endpoint phrase tùy ý |

Root đang bọc `ErrorBoundary → CatalogProvider → LearnerProvider → App/prototype`. Không nhân đôi provider mỗi khi đổi giao diện; không tạo một hệ thống auth thứ hai.

### Các hàm account quan trọng

`useLearner()` hiện trả: `data`, `setData`, `user`, `ready`, `status`, `error`, `revision`, `authenticate`, `logout`, `deleteAccount`, `submitAttempt`, `submitScenario`, `importProgress`, `resetProgress`, `refresh`.

- `submitAttempt(id, result)` gửi phraseId/answer/mode/hinted/key; account được server chấm. Đọc source vì guest và account có hành vi correctness/hinted khác nhau đã được ghi trong review.
- `setData` hiện có cơ chế chuyển thay đổi thành commands và xếp hàng sync. Không thay bằng localStorage.setItem cho người đã đăng nhập.
- Không đổi cách lưu session cookie sang localStorage token.

## 3. Bất biến: redesign không được làm mất điều gì

1. Catalog và IDs giữ nguyên. Bookmark, ghi chú, tick đã xem, lịch sử không biến mất.
2. Tick thủ công không có nghĩa đã thuộc. Xem đáp án không được tự tăng mastery.
3. Câu sai, dùng gợi ý, và đúng độc lập phải được xử lý theo logic hiện có; nếu thấy bug cũ ghi riêng, không đổi quy tắc âm thầm.
4. Login/register/logout/recovery/Google login phải còn đường truy cập. Không fake thành công OAuth khi chưa kiểm thử callback thật.
5. Sync error phải thấy được; không báo “đã lưu” nếu request thất bại. Giữ cơ chế retry/event key.
6. Route hash đang có phải mở được: `#home`, `#topics`, `#phrasal`, `#review`, `#saved`, `#path`, `#practice`, `#insights`, `#account`.
7. Browser back/forward, reload, đóng modal bằng Escape, trả focus và bỏ scroll lock đều còn hoạt động.
8. Import/export/reset/delete account vẫn đủ chức năng hiện có, giữ xác nhận khi thao tác phá dữ liệu.
9. Không hiển thị số người học, streak, tỷ lệ ghi nhớ hay “hoàn thành” giả để làm màn hình đẹp.
10. Không thêm dependencies/router/animation framework nếu CSS và React hiện có đủ; mọi thêm mới phải có lý do và ghi lockfile.

## 4. Quy chuẩn thiết kế Studio

### 4.1 Cảm giác và bố cục

- Studio giống một sản phẩm học được biên tập: xanh mực + kem, hình có hành động, khoảng trắng rõ, tiêu đề có cá tính.
- Trang đầu có một CTA học chính, tiến độ thật và vài lựa chọn tình huống. Số liệu chi tiết ở Insights, cài đặt ở Account.
- Không lạm dụng gradient, neon, glassmorphism, hàng loạt thẻ giống nhau và sparkle. Không thêm hiệu ứng chỉ để phủ kín màn hình.
- Dùng minh họa SVG hiện có, nhưng hình phải đúng context. Không dùng ảnh café cho mọi chủ đề.
- Desktop: khung nội dung khoảng 1200px; bài đọc rộng vừa phải; vùng học tránh kéo dài dòng ngang cả màn.
- Mobile: một cột, CTA không che input/nội dung, không tràn ngang, điều hướng vẫn vào được tất cả màn.

### 4.2 Token đề xuất (đưa vào một nơi)

```css
.studio-app {
  --studio-bg: #f7f5ee;
  --studio-surface: #fffaf0;
  --studio-ink: #23384e;
  --studio-muted: #586778;
  --studio-primary: #315ace;
  --studio-primary-ink: #fff9e9;
  --studio-highlight: #f5dfa0;
  --studio-highlight-ink: #253c52;
  --studio-success-bg: #e1ebd8;
  --studio-retry-bg: #f4e4d7;
  --studio-border: #cecdbd;
  --studio-radius-card: 18px;
  --studio-radius-button: 28px;
  --studio-space-1: 4px;
  --studio-space-2: 8px;
  --studio-space-3: 12px;
  --studio-space-4: 16px;
  --studio-space-6: 24px;
  --studio-space-8: 32px;
}
```

Đã đo ở prototype: ink/background 11.02:1, muted/background 5.31:1, CTA 5.73:1, highlight 8.63:1. Những con số này không đảm bảo component mới đều đạt contrast. Kiểm tra lại hover/disabled/placeholder/chữ nhỏ trên từng nền.

Chữ nội dung dùng font Be Vietnam Pro có sẵn; tiêu đề/đoạn tiếng Anh có thể dùng Georgia như mẫu. Không thêm font tải từ CDN ngoài. Chữ đọc thường khoảng 15–18px; đoạn tiếng Anh 18–22px, line-height 1.7–1.9; metadata tối thiểu mục tiêu 12px ở giao diện chính thức (prototype còn metadata quá nhỏ, cần cải thiện).

### 4.3 Chuyển động

| Loại | Cách làm | Giới hạn |
|---|---|---|
| Hover card/nút | transform nhẹ 2–6px + shadow | Không thay layout, không chạy trên mỗi render |
| Chuyển hoạt động | opacity/translate ngắn 180–300ms | Không nhấp nháy hoặc trì hoãn thao tác |
| Flashcard | Chuyển trạng thái 200–350ms | Ẩn đáp án thật ở mặt trước, không chỉ xoay chữ ra sau |
| Animation nghĩa | Bấm xem → diễn ra 2–3 giây → dừng | Có phát lại, Trước/Sau, không loop vô hạn |
| Đúng/sai | Icon + text + nền dịu | Không dùng mỗi đỏ/xanh để truyền nghĩa |

Hỗ trợ cả `prefers-reduced-motion` và tùy chọn trong app. Nếu motion đang chạy mà user tắt, trạng thái phải ổn định, không kẹt nút. Khi đổi bài/unmount, hủy audio/timer/subscription. Không dùng autoplay âm thanh.

### 4.4 Component nên có

Tách khi thực sự dùng chung: StudioShell, PrimaryButton, IconButton, SectionHeading, LessonCard, EmptyState, FeedbackPanel, ProgressSummary, StudyDialog. Props phải nhỏ, cụ thể; không truyền hàng chục state setter xuyên mọi component.

Nút phát luôn dùng icon loa, có aria-label/title. Label không phải bằng chứng đã có TTS tự nhiên. Tái sử dụng hàm speak và preference hiện có.

## 5. Kiến trúc chuyển đổi an toàn

### Quyết định cần theo

Thêm một đường thử riêng: `/?preview=studio-full#home`. Giữ `/?preview=field-notes` là mẫu tham chiếu và `/` là legacy trong giai đoạn triển khai.

`studio-full` là **App thật với biến thể trình bày Studio**; không phải bản sao của FieldNotesPreview.

Hướng thực hiện:

1. Root xác định preview chỉ trong DEV.
2. Truyền `appearance="studio"` vào App thật (hoặc tên prop tương đương).
3. Giữ state/catalog/account/controller trong App; tách JSX trang thành view component theo từng đợt.
4. StudioShell nhận nội dung view, điều hướng và slot account/sync; legacy shell vẫn có thể render các view legacy.
5. Dữ liệu được tính một lần từ context. Không copy dailyPlan/progress/auth sang một hook mới chỉ vì đổi theme.
6. Chỉ trích xuất controller/hook chung khi đã có nhu cầu rõ và test bảo vệ; tránh vừa đổi UI vừa viết lại toàn bộ kiến trúc state.

Được phép di chuyển App từ main.jsx sang file riêng để main.jsx chỉ bootstrap. Làm bước này cơ học, không đồng thời đổi behavior.

### CSS isolation

- CSS mới nằm dưới `.studio-app` hoặc module/class `studio-*`. Không thêm selector toàn cục `nav`, `button`, `h1`, `svg`, `input`.
- Prototype từng lỗi vì CSS cũ `nav { width:100%; flex-direction:column }`. Reset các thuộc tính layout cần thiết ở component mới, không fix bằng overflow:hidden che phần bị tràn.
- Đừng giải quyết bằng thêm `!important` hàng loạt. Dùng token, scope, specificity vừa đủ.
- Dynamic import CSS Studio chỉ khi mở nhánh thử nếu khả thi; kiểm tra production không tải code prototype.
- Không xóa CSS legacy cho đến khi tất cả consumer được kiểm tra và người dùng đã duyệt bỏ legacy.

## 6. Đặc tả từng màn hình

| Màn | Nội dung ưu tiên | Hành vi bắt buộc |
|---|---|---|
| Home | Lời chào, CTA tiếp tục/học hôm nay, tóm tắt đến hạn, 3–6 nhóm gợi ý | CTA lấy từ dailyPlan/data thật; người mới vào onboarding; hết kế hoạch không launch mảng rỗng |
| Topics | Chủ đề có hình, ô tìm kiếm, lọc loại và trạng thái khi vào nhóm | Toàn bộ catalog vẫn truy cập được; tìm en/vi; kết hợp query/filter/status đúng |
| Phrasal | Nhóm theo tình huống → bài → nghĩa/cấu trúc | Giữ nhóm/stories/station; không biến thành list 160 cụm trên một trang |
| Saved | Những câu đã lưu, tìm/lọc, empty state | Bookmark/unbookmark thật; reload/account khác giữ đúng |
| Review | Cụm đến hạn và điểm vào buổi ôn | Đếm theo logic hiện có; trả lời sai/gợi ý không giả là thành thạo |
| StudySession | Một nhiệm vụ chính mỗi bước, câu hỏi lớn, nút loa, gợi ý và feedback | Đủ các mode hiện có; không lộ đáp án trước; giữ retry/next/close/summary |
| Path | Lộ trình/ngày theo dữ liệu thật | Không mở khóa/hoàn thành giả; start đúng items |
| Practice | Hội thoại và luyện trong context | Giữ submitScenario, trạng thái bước, lưu/reset có sẵn; phân biệt khám phá và bài chấm |
| Insights | Tiến độ và hoạt động có ý nghĩa | Giải thích số liệu theo dữ liệu thật; không dùng biểu đồ giả hoặc tỷ lệ dự đoán |
| Account | Đăng nhập/đồng bộ/preferences/data management | Đủ export/import/reset/delete/recovery; xử lý lỗi/đang lưu rõ |
| Onboarding/modals | Ít thông tin, form rõ, điều hướng bàn phím | Focus trap, Escape, scroll lock và focus return; label rõ |
| Loading/error/offline | Trạng thái phù hợp phong cách | Giữ AppStatus/SyncBanner/ErrorBoundary; không infinite skeleton khi API lỗi |

Thứ tự trong sidebar/topbar có thể cải thiện nhưng route hash không đổi. Các chức năng phụ được đưa vào menu “Thêm”, không được xóa để trang nhìn gọn.

## 7. Các đợt triển khai cho model nhỏ

Chỉ làm một đợt mỗi lượt. Không tự nhảy sang đợt publish. Mỗi đợt đọc source mới nhất vì file có thể đã được tách ở đợt trước.

### Đợt 0 — Inventory và baseline

- Chạy git status, đọc các file trọng tâm, ghi danh sách màn/chức năng đang có.
- Mở app gốc và prototype, lấy ảnh desktop/mobile để so sánh.
- Chạy baseline tests; lỗi có sẵn phải ghi rõ trước khi sửa.
- Tạo `docs/STUDIO-REDESIGN-PROGRESS.md` từ mẫu mục 10. Không tuyên bố baseline pass khi chưa chạy.
- Done: xác định nguồn dữ liệu thật, prototype boundary và baseline cụ thể.

### Đợt 1 — Entry, token, shell

- Thêm `?preview=studio-full`, DEV only; giữ hai entry cũ.
- Tách App/bootstrap nếu cần, giữ logic.
- Tạo token/CSS có scope, shell desktop/mobile, điều hướng đầy đủ.
- Các view chưa migrate có thể tạm render view cũ trong shell mới; ghi rõ chưa xong.
- Test: route direct/back/forward, đổi preview về legacy, account context không nhân đôi, mobile không overflow, build production không chứa nhánh thử.
- Done: nền chuyển đổi hoạt động, chưa tuyên bố toàn bộ UI Studio xong.

### Đợt 2 — Home và planner/onboarding

- Home như mẫu Studio nhưng số liệu và CTA từ App thật.
- Di chuyển các khối phụ sang đường dẫn phù hợp; bảo toàn reachability.
- Tạo giao diện onboarding/plan panel theo token.
- Test: user mới thiết lập, đổi goal/focus, start đúng bài, user đã xong hôm nay, empty/error.
- Done: học từ home thật được, không start sáu câu draft thay kế hoạch account.

### Đợt 3 — Topics, danh sách câu, Saved

- Card chủ đề có số liệu thật, dùng hình phù hợp hoặc fallback trung tính có label.
- Danh sách câu sạch, search/filter/status không bị mất.
- Icon loa/lưu/đánh dấu xem/ghi chú vẫn đủ chức năng cũ.
- Test: phối hợp filter, kết quả rỗng, bookmark/reload, account trên hai browser contexts, đổi theme không đổi data.

### Đợt 4 — Phrasal và Station

- Thiết kế nhóm → bài rõ ràng; giữ mọi story/episode và station.
- Station dùng API cũ, không đổi sang local state prototype.
- Tái sử dụng ActionScene nơi đúng nghĩa; không mở rộng animation mới trước khi nhóm/bài đã usable.
- Test: vào/ra nhóm, station resume, submitted/hinted, API fail, không lưu trùng khi retry.

### Đợt 5 — StudySession và Review

- Giữ thuật toán và state machine; đổi view từng mode.
- Đảm bảo mặt trước flashcard/recall không chứa đáp án trong DOM accessibility khi yêu cầu giấu.
- Feedback phân biệt kết quả và mức hỗ trợ theo contract thực tế. Nếu contract cũ mâu thuẫn, ghi riêng để reviewer quyết định, không tự sửa API trong đợt UI.
- Test: đúng, sai, hint, retry, cuối buổi, đóng giữa buổi, bàn phím, reduced motion.

### Đợt 6 — Path, Practice, Insights

- Dùng component chung và dữ liệu thật; giữ module luyện/ghi âm hiện có.
- Recorder phải giải phóng media tracks, không tự xin microphone khi chưa bấm.
- Test: start từ path, hoàn thành scenario, tải lại kết quả, không có dữ liệu insights, lỗi API.

### Đợt 7 — Account, trạng thái hệ thống, hoàn thiện mobile

- Đồng bộ CloudAccount, AccountPage, modal, SyncBanner, AppStatus, ErrorBoundary với theme.
- Test register/login/logout/recovery, lỗi mật khẩu, import/export/reset bằng account thử local; không dùng tài khoản thật để thử xóa.
- Google: kiểm tra link/state nếu có môi trường; callback thật cần đăng nhập người dùng. Báo rõ chưa test end-to-end nếu chưa làm được.
- Review touch targets, focus, contrast, 320/390/768/1440px, phóng chữ/zoom và bàn phím ảo.

### Đợt 8 — Reviewer gate trước khi áp dụng

- Chạy toàn bộ kiểm tra mục 9, hoàn thiện báo cáo mục 11.
- Không đổi default `/` hoặc xóa legacy tự động.
- Model chính review code/visual/flows. Sửa các lỗi được nêu.
- Chỉ khi người dùng yêu cầu áp dụng mới chuyển default theo phạm vi họ duyệt. Push/deploy chỉ khi được yêu cầu cho bản này.

## 8. Bank nội dung: phần nào thuộc lần redesign này?

**Trong phạm vi:** trình bày rõ bank hiện có; nhóm theo tình huống; phân biệt word/phrasal/pattern; ví dụ và lỗi dễ nhầm; giữ ID và đường vào các bài.

**Chưa tự làm trong đợt đổi UI:** publish toàn bộ fieldNotes vào DB, thiết kế lại SRS, migrate lesson attempts vào progress chung, thêm hàng nghìn câu, đổi nhà cung cấp TTS.

Nếu sau này được yêu cầu publish bank mới, làm task riêng có schema version/sense ID, API grading, migration, admin draft/review/publish, export/reset và test account isolation. Không gửi `cafe-1` của draft tới `/me/attempts` nếu ID đó chưa nằm trong catalog backend.

Phân loại draft `word/phrasal/pattern` khác production `sentence/phrasal/expression`; mapping phải tường minh, không cast tùy tiện hoặc đổi enum production âm thầm.

## 9. Kiểm thử và cách chạy local

### Lệnh an toàn

PowerShell tại root project:

```powershell
git status --short
npm test
npm run test:api
npm run build
```

Nếu dev chưa chạy và cần database local:

```powershell
$env:DATABASE_URL = ''
$env:DB_DRIVER = 'pglite'
npm run dev
```

Đây là env của process, không ghi đè .env. Kiểm tra port 3001/5173 trước. Nếu có process đang chạy, xác minh đó là dev project này; không kill toàn bộ Node hoặc dịch vụ khác. Không xóa `.data` khi schema/test không chạy.

Kiểm tra UI:

```powershell
npx playwright test e2e/field-notes.spec.js
npm run test:e2e
npm run test:offline
git diff --check
```

Đọc `playwright.config.js` và `playwright.prod.config.js` trước: test có thể tự start server. `test:offline` kiểm tra production build nên phải build trước. Chạy lệnh tuần tự và kiểm tra exit code từng lệnh; PowerShell dấu `;` không tự dừng khi lệnh trước thất bại.

CI hiện có install/audit/unit/API/build, **chưa chạy E2E**. CI xanh chưa chứng minh full UI đúng. Không thay workflow chỉ để né test đang fail.

### Ma trận bằng chứng bắt buộc

| Nhóm | Kiểm tra |
|---|---|
| Visual | Ảnh home/topics/phrasal/study/account ở desktop và mobile, xem ảnh thật sau khi chụp |
| Navigation | Direct URL, reload, back/forward, mobile menu, legacy vẫn vào được |
| State | Guest reload; account login và browser context thứ hai; bookmark/attempt/preferences |
| Error | API 500/network timeout, empty results, lỗi input, storage bị chặn |
| Learning | Đúng/sai/gợi ý/retry/final summary, không lộ đáp án, planner thực |
| Accessibility | Keyboard, focus dialog, Escape, nhãn nút icon, contrast, reduced motion |
| Audio | Không autoplay; không nhiều nguồn phát chồng; lỗi playback có phản hồi; rời bài cleanup |
| Regression | unit/API/E2E/offline/build theo phạm vi; production không lộ prototype trước khi duyệt |

Được cập nhật selector test khi UI đổi có chủ đích. Không xóa assertion về hành vi, giảm số case, đánh dấu skip hoặc sửa expected sai để lấy pass. Tách lỗi baseline khỏi regression bằng chứng cụ thể.

Nếu dùng screenshot, tắt/chờ animation trong bước chụp; ảnh giữa animation opacity thấp không phải ảnh hoàn thiện. Kiểm tra animation động riêng.

Không gọi mock là tích hợp thật. Báo riêng test có mock, test local backend và test chưa thực hiện.

## 10. Mẫu context mỗi đợt

Tạo/cập nhật `docs/STUDIO-REDESIGN-PROGRESS.md`, và thêm dòng mốc vào IMPLEMENTATION-CONTEXT.md. Không thay toàn bộ lịch sử context cũ.

```markdown
## Đợt N — tên đợt — ngày
Trạng thái: NOT STARTED / IN PROGRESS / READY FOR REVIEW / DONE / BLOCKED
Base commit:
URL thử:
Mục tiêu đợt:
Các file thay đổi:
Hành vi đã nối dữ liệu thật:
Phần vẫn prototype / tạm / chưa xong:
Kiểm tra đã chạy + exit code/kết quả:
Ảnh đã xem:
Lỗi baseline:
Lỗi mới và cách xử lý:
Quyết định/giả định cần reviewer biết:
Không đổi những contract nào:
Việc cần làm ngay ở lượt sau:
```

Giữ thêm bảng tổng:

| Đợt | Trạng thái | Bằng chứng | Bước kế |
|---|---|---|---|
| 0 Inventory | NOT STARTED | — | kiểm tra baseline |
| 1 Shell | NOT STARTED | — | — |
| 2 Home | NOT STARTED | — | — |
| 3 Topics/Saved | NOT STARTED | — | — |
| 4 Phrasal | NOT STARTED | — | — |
| 5 Study/Review | NOT STARTED | — | — |
| 6 Path/Practice/Insights | NOT STARTED | — | — |
| 7 Account/Polish | NOT STARTED | — | — |
| 8 Review gate | NOT STARTED | — | — |

Prototype đã xong không có nghĩa các đợt này đã xong.

## 11. Bàn giao để model chính kiểm tra

Khi hoàn thành một đợt, báo ngắn:

1. URL local và thao tác cụ thể để thấy thay đổi.
2. File đã sửa, vì sao sửa, ảnh trước/sau.
3. Kết quả test thực chạy, lỗi còn lại, khác biệt với thiết kế mẫu.
4. Có thay đổi dữ liệu/API/schema/package/CI không? Nếu có, giải thích riêng.
5. Phần chưa xong và đầu việc kế tiếp; không tuyên bố “release ready” nếu còn mode chưa nối thật.

Reviewer cần kiểm tra:

- Có thay prototype vào chỗ App thật và làm mất catalog/account không?
- Có hai nguồn progress hoặc hai auth provider không?
- Có màn nào mất đường vào sau khi làm gọn navigation không?
- Có contract/ID/enum/SRS đổi ngoài scope không?
- Có fake success, hidden error, stale state hoặc race khi đổi user không?
- Có stylesheet mới làm hỏng legacy/mobile không?
- Có copy-paste JSX/state quá nhiều, hardcode count hoặc component quá lớn không?
- UI có thực sự giống Studio ở mọi màn, hay chỉ bọc header mới quanh trang cũ?
- Có kiểm tra ảnh và hành vi chứ không chỉ build pass không?
- Có bất kỳ push/deploy/billing ngoài chỉ dẫn mới nhất của user không?

## 12. Prompt có thể copy cho model triển khai

```text
Hãy đọc docs/STUDIO-REDESIGN-HANDOFF.md và docs/IMPLEMENTATION-CONTEXT.md.
Triển khai đợt nhỏ tiếp theo chưa hoàn thành, bắt đầu bằng đợt 0 nếu chưa có baseline.
Tôi muốn toàn bộ app thật theo phong cách Studio đã duyệt; prototype chỉ là mẫu thiết kế.
Giữ catalog, account, progress, route và logic học. Preview mới tại ?preview=studio-full,
DEV only; giao diện hiện tại và ?preview=field-notes vẫn phải dùng được.
Không push/deploy, không gọi dịch vụ tính phí, không sửa production database.
Kiểm tra thay đổi tương xứng, cập nhật docs/STUDIO-REDESIGN-PROGRESS.md và context.
Báo URL local, file thay đổi, test thực chạy và phần chưa xong để model chính review.
Không đánh dấu đợt DONE nếu chỉ làm mock UI hoặc chưa nối dữ liệu thật.
```

## 13. Prompt cho model chính review sau đó

```text
Review đợt Studio vừa triển khai theo docs/STUDIO-REDESIGN-HANDOFF.md,
docs/STUDIO-REDESIGN-PROGRESS.md và git diff thực tế. Đọc source và kiểm thử local.
Ưu tiên regression về account/progress/learning/routes, rồi CSS isolation,
mobile/accessibility, mức khớp Studio và maintainability. Phân biệt lỗi cũ với lỗi mới.
Báo lỗi theo mức độ, chỉ ra file và thao tác tái hiện; đối chiếu các mục chưa hoàn thành.
Không chỉ dựa vào báo cáo của model triển khai hoặc CI xanh để kết luận.
Không push/deploy trong lượt review này.
```
