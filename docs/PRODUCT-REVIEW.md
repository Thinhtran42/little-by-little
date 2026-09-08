# Đánh giá sản phẩm và kế hoạch cải thiện Little by Little

Ngày đánh giá: 08/09/2026. Cơ sở: đọc source của bản `d4ce02e` và các tài liệu trong repo; tham khảo nguồn học thuật và tài liệu dạy tiếng Anh ở cuối file. Đây là đánh giá sản phẩm dựa trên mã nguồn, chưa phải nghiên cứu người dùng, kiểm thử thị giác trên mọi thiết bị hoặc kiểm định hiệu quả học.

## 1. Nhận định chính

Sản phẩm có nền móng để thử nghiệm: tài khoản, PostgreSQL, lịch ôn, chấm bài phía server và nội dung giao tiếp tiếng Việt–Anh. Nhưng trải nghiệm vẫn là nhiều tính năng đứng cạnh nhau, chưa thành một hành trình học thống nhất. Thêm hàng trăm câu hoặc thêm hình trang trí sẽ không tự giải quyết vấn đề này.

Nên tập trung vào lời hứa: **“Mỗi ngày học một tình huống nhỏ, nhớ lại được và biết dùng trong tình huống khác.”** Đối tượng ban đầu nên là người Việt có chút nền tảng, biết từ nhưng khó bật ra câu; chưa nên phục vụ đồng thời người mới hoàn toàn, luyện thi và tiếng Anh chuyên ngành.

Ưu tiên của tôi: hoàn thiện một bộ bài mẫu thật tốt → nối các hoạt động vào tiến độ → mở rộng nội dung theo chuẩn đó → đo người học có nhớ sau vài ngày hay không. Chưa nên tăng số trò chơi bằng mọi giá hoặc thêm chatbot AI không giới hạn.

## 2. Hiện trạng: điều gì thực sự còn thiếu?

| Phần | Quan sát trong source | Hệ quả và đề xuất |
|---|---|---|
| Thư viện cũ | 640 mục, 16 chủ đề; có câu, cụm động từ và cách nói | Đây là số mục, không phải 640 bài hoàn chỉnh. Cần chuyển dần sang các bài có mục tiêu giao tiếp |
| Khu phrasal mới | 4 nhóm, 12 đoạn đọc, 8 hội thoại bổ sung; các chương tái sử dụng nhóm từ | Hướng đúng, nhưng mới bao phủ ít tình huống; cần phân loại theo nghĩa và mục đích sử dụng |
| Lưu kết quả | `PhrasalStories.jsx` dùng state tại component; đáp án mất khi đổi bài/rời trang | Người học không có dấu vết đã học, ôn lại hoặc tiếp tục. Đây là thiếu hụt ưu tiên cao |
| Hai hệ thống hội thoại | Hội thoại cũ có API chấm/lưu; hội thoại mới chỉ mở lời đáp và nghe | Không nên gọi cả hai là bài đã hoàn thành nếu tiêu chí khác nhau |
| Hình ảnh | `ContextPractice.jsx` chủ yếu dùng icon; `StoryScene` dùng vài nhánh SVG, chia sẻ bố cục | Cho biết “đang ở đâu” nhưng ít cho thấy “đang làm gì” |
| Flashcard | Mặt trước thường là bản dịch, mặt sau là cụm gốc | Nên thêm thẻ từ hình/tình huống; đừng chỉ luyện dịch Việt–Anh |
| Xếp câu | Từ được đảo ngược cố định; với phrasal verb đôi khi chỉ có hai từ | Dễ đoán quy luật. Dùng xáo trộn có kiểm soát, cụm trong câu hoàn chỉnh và bài vị trí đại từ |
| Chấm bài | So mẫu và đáp án thay thế, có ghi nhận dùng gợi ý | Phù hợp bài nhớ mẫu; chưa phù hợp để chấm mọi câu giao tiếp tự do |
| Phản hồi | Backend gộp “đúng nhưng dùng gợi ý” vào `correct=false`; UI lấy cùng giá trị cho đúng/đạt | Có thể báo sai dù nội dung đúng. Tách correctness, assistance và mastery evidence |
| Lịch ôn | Quy tắc ngày cố định, tăng mức qua ngày khác; ưu tiên câu đến hạn | Có nền tảng hữu ích, nhưng mới tác động phần câu cũ, chưa có evidence từ bài đọc mới |
| Trang chủ | Đã thu gọn bằng `details`; phần chi tiết cũ vẫn rất lớn | Nên chuyển các khối sang trang phù hợp, giữ trang chủ phục vụ quyết định kế tiếp |
| Âm thanh | Speech synthesis của trình duyệt | Chất lượng và giọng phụ thuộc thiết bị; hội thoại thiếu nhịp và giọng nhân vật ổn định |

Không nên diễn giải “trả lời đúng ngay sau khi lật thẻ” là đã nhớ lâu. Đó là một bước học; cần kiểm tra lại sau khoảng cách thời gian và trong bối cảnh khác.

## 3. Thiết kế lại một bài học trước khi tăng số lượng

Một bài 8–12 phút là mốc thiết kế thử nghiệm, không phải cam kết cho mọi người. Bài gồm 3–5 cụm mục tiêu; phần lớn ngôn ngữ còn lại cần đủ quen thuộc để người học hiểu chuyện đang xảy ra.

1. **Tình huống:** một hình rõ hành động, ai nói với ai và việc người học cần làm.
2. **Đoạn đọc/nghe:** 60–100 từ, cụm mục tiêu được đánh dấu. Có bản dịch tùy chọn, không mở sẵn toàn bộ.
3. **Khám phá:** chạm cụm để nghe, xem nghĩa trong đoạn, cấu trúc và một lỗi hay gặp.
4. **Tập có hỗ trợ:** một bài ghép nghĩa hoặc xếp câu; cho bỏ qua khi đã quen.
5. **Tự nhớ:** giấu mẫu, điền hoặc nói lời đáp; lưu riêng việc dùng gợi ý.
6. **Vận dụng:** đổi người, đồ vật hoặc mục đích. Đây mới là bước giúp tránh thuộc một đoạn duy nhất.
7. **Kết thúc:** cho biết cụm nào cần ôn, cụm nào trả lời độc lập; một nút tiếp tục rõ ràng.

Ví dụ bài **“Đón bạn ở ga”**:

- Mục tiêu: hẹn địa điểm đón và báo thay đổi lịch.
- Cụm chính: `pick someone up`, `set off`, `get back`; học kèm `run late` nhưng ghi rõ đó không phải phrasal verb.
- Hình: người A cầm vali đứng ở cửa ga, người B lái xe đến; vị trí và hướng di chuyển phải rõ.
- Hội thoại tự viết: “Could you pick me up outside the station?” / “Sure. I’ll set off in ten minutes.” / “Thanks. I need to get back before six.”
- Bài cấu trúc: “Can you pick ___ up?” → `me`; giải thích vì sao không dùng “pick up me”.
- Bài chuyển tình huống: người cần đón là em gái, địa điểm là trường học; yêu cầu điều chỉnh lời nhắn.
- Ngày ôn sau: dùng một cảnh khác và giảm gợi ý; không phát lại toàn bộ đoạn đã thuộc.

Đây là bài mẫu đề xuất, chưa phải nội dung đã tích hợp.

## 4. Phrasal verbs nên được tổ chức như thế nào?

### Lối vào chính: tình huống và mục tiêu

| Nhóm | Các bài con đề xuất | Cụm mẫu |
|---|---|---|
| Buổi sáng & ở nhà | Rời giường; chuẩn bị ra ngoài; dọn phòng | wake up, get up, put on, tidy up |
| Ăn uống & đi chợ | Hết nguyên liệu; gọi mang đi; dọn sau bữa ăn | run out of, eat out, heat up, wash up |
| Du lịch & di chuyển | Khởi hành; làm thủ tục; đón người thân | set off, check in, check out, pick up |
| Công việc & cuộc họp | Lên lịch; đề xuất ý tưởng; xử lý lỗi | set up, put off, come up with, look into |
| Bạn bè & kết nối | Hẹn gặp; cập nhật chuyện cũ; làm hòa | hang out, catch up, get along with, make up |
| Học tập | Tra cứu; ghi chép; ôn lại; kiên trì | look up, write down, go over, give up |
| Công nghệ | Đăng nhập; sao lưu; thiết lập; tắt máy | log in, back up, set up, shut down |
| Sức khỏe & cảm xúc | Chăm sóc; hồi phục; giảm thói quen | look after, get over, cut down on, cheer up |
| Mua sắm & tiền bạc | Thử đồ; trả hàng; tiết kiệm; hoàn tiền | try on, take back, save up, pay back |
| Việc bất ngờ | Hủy lịch; xuất hiện; tìm giải pháp | call off, turn up, work out, deal with |

Danh sách này là khung biên tập. Mỗi cụm phải được duyệt đúng nghĩa và biến thể vùng miền trước khi xuất bản.

### Lối vào phụ: cấu trúc và quan hệ giữa cụm

- Tách được/không tách được; có tân ngữ/không có tân ngữ.
- Cặp dễ nhầm: wake up/get up; put on/wear; look for/look after.
- Đa nghĩa: `pick up` đón người khác `pick up` học được điều gì một cách tự nhiên. Mỗi nghĩa có ID riêng, bài và ví dụ riêng.
- Liên hệ theo particle chỉ là lớp khám phá phụ. Không dạy “up luôn nghĩa là tăng” vì nhiều nghĩa không suy ra đơn giản như vậy.

Không biến trang nhóm thành một danh sách hàng trăm từ có filter. Thứ tự là **chọn tình huống → chọn bài → học vài cụm → ôn các nghĩa đã học**. Tìm kiếm toàn thư viện vẫn có, nhưng là công cụ tra cứu phụ.

## 5. Kế hoạch mở rộng dữ liệu

### Mốc nội dung có thể kiểm soát chất lượng

- Đợt mẫu: sửa 4 nhóm hiện tại thành 12 bài hoàn chỉnh, thống nhất chấm và lưu tiến độ.
- Đợt mở rộng: 10 nhóm × 4 bài = 40 bài. Mỗi bài 1 đoạn đọc, 1 hội thoại 6–10 lượt, 1 tình huống chuyển giao và 3–5 cụm trọng tâm.
- Tổng 120–200 lượt giới thiệu cụm, không đồng nghĩa 120–200 cụm độc nhất vì cần tái sử dụng có chủ đích.
- Chỉ mở rộng tiếp khi các bài mẫu đã được người học và người biên tập kiểm tra. Không sinh 500 đoạn rồi duyệt sau.

### Cấu trúc dữ liệu đề xuất

| Đối tượng | Trường chính |
|---|---|
| `expression_senses` | ID ổn định, dạng gốc, nghĩa cụ thể, loại cụm, cấu trúc tân ngữ, separability, register, biến thể |
| `lessons` | ID, phiên bản, nhóm, mục tiêu “can-do”, độ khó do biên tập gán, thời lượng ước tính, trạng thái duyệt |
| `lesson_targets` | lesson ID, sense ID, vai trò mới/ôn, thứ tự |
| `passages` | đoạn đọc theo segment; segment tham chiếu sense ID, tránh dựa vào so chuỗi `**...**` |
| `dialogue_turns` | vai nói, lời thoại, audio ID, mục đích giao tiếp, nhánh/đáp án nếu có |
| `exercise_items` | loại bài, prompt, đáp án chấp nhận, distractor, giải thích, mức hỗ trợ |
| `media_assets` | URL/key lưu trữ, alt text, kích thước, tác giả/nguồn, quyền sử dụng, phiên bản |
| `lesson_attempts` | user, lesson version, đáp án, đúng/sai, gợi ý, ngày giờ, khóa chống ghi trùng |
| `sense_progress` | user, sense ID, bằng chứng nhớ độc lập, lịch ôn |

Các bảng trên là đề xuất, chưa tồn tại đầy đủ. Không cần tách microservices. Có thể dùng PostgreSQL + JSONB cho nội dung lồng nhau, nhưng danh tính bài/cụm và liên kết tiến độ nên có khóa rõ ràng. Giữ ID cũ khi migrate để không làm mất tiến độ.

### Quy trình biên tập

Brief mục tiêu → tra cứu nghĩa và cấu trúc → viết đoạn/hội thoại mới → người có năng lực ngôn ngữ duyệt → tạo media → kiểm tra tự động → preview → xuất bản phiên bản.

Kiểm tra tự động: mọi target xuất hiện hợp lệ; ID không trùng; không có link media hỏng; đáp án không mâu thuẫn; distractor không vô tình cũng đúng; dialogue có speaker; ảnh có alt; đủ giải thích và nguồn. Kiểm tra bằng người: độ tự nhiên, ngữ cảnh có hợp lý, bản dịch đúng nghĩa, độ khó của từ ngoài mục tiêu.

Tài liệu internet dùng để đối chiếu và lấy cảm hứng cấu trúc bài. Viết mới nội dung hoặc dùng nguồn được cấp phép; ghi attribution không tự tạo quyền tái sử dụng. Không lấy nguyên ảnh sách giáo khoa hoặc sửa vài chữ rồi coi là nội dung mới.

## 6. Hình ảnh: từ trang trí sang giúp hiểu nghĩa

Một biểu tượng máy bay giúp nhận ra chủ đề du lịch nhưng không phân biệt check in, set off và pick up. Hình tốt cần thể hiện người, đồ vật, hành động và quan hệ giữa chúng.

### Bộ hình đề xuất

1. **Ảnh bìa nhóm:** một cảnh rộng giúp người học chọn nơi muốn đến.
2. **Cảnh của bài:** một nhiệm vụ cụ thể, nhân vật quen thuộc và chi tiết liên quan.
3. **Khung hành động:** trước/sau hoặc chuỗi 2–3 khung cho các nghĩa khó thể hiện trong một ảnh.
4. **Thẻ kiểm tra bằng hình:** thay chi tiết bề mặt nhưng giữ cùng nghĩa để thử khả năng áp dụng.

| Cụm | Minh họa phù hợp | Điều nên tránh |
|---|---|---|
| wake up / get up | Hai khung: mở mắt còn nằm; rời giường đứng dậy | Một icon đồng hồ cho cả hai |
| run out of milk | Hộp sữa nghiêng nhưng không còn sữa, bát ngũ cốc chờ bên cạnh | Cốc sữa đầy hoặc nhân vật đang chạy |
| put off a meeting | Lịch chuyển cuộc họp từ hôm nay sang ngày khác | Hình văn phòng chung chung |
| pick someone up | Người chờ với vali và xe đến đón | Chỉ vẽ bàn tay nhặt đồ khi bài đang dạy nghĩa đón người |
| cheer someone up | Hai khung cảm xúc trước/sau khi được bạn động viên | Confetti bật mọi lúc |

Nên chọn một phong cách minh họa nhất quán: màu ấm, nét rõ trên mobile, ít chi tiết thừa, 2–3 nhân vật tái xuất. Có thể dùng ảnh AI hoặc đặt vẽ; cần duyệt hành động, vật thể và tính nhất quán. Chữ/bong bóng hội thoại đặt bằng HTML thay vì chôn trong ảnh.

Ví dụ brief tạo ảnh: “Minh họa biên tập 2D cho người lớn học tiếng Anh; cùng một người trong hai khung: khung trái mở mắt nhưng vẫn nằm trong giường, khung phải đã đứng cạnh giường; ánh sáng buổi sáng, cùng quần áo và phòng; không chữ, không logo, tập trung khác biệt hành động.”

Đề xuất thử 10 ảnh bìa + 12 cảnh bài mẫu trước. Kiểm tra người học có mô tả đúng hành động khi chưa đọc câu không. Sau đó mới nhân rộng media cho 40 bài. Hướng multimedia learning ủng hộ loại bỏ chi tiết không liên quan; đây là cơ sở thiết kế, chưa phải bằng chứng riêng cho app [2].

Media production: WebP/AVIF cùng phương án fallback phù hợp; nhiều kích thước; khai báo tỷ lệ để tránh giật layout; lazy-load ảnh ngoài màn hình. Mốc thử nghiệm 100–200 KB/ảnh mobile, điều chỉnh sau đo thực tế. Tôn trọng reduced-motion, có alt theo mục tiêu bài, không tự phát âm thanh. Hình có thể gợi đáp án nên hệ thống cần ghi nhận mức hỗ trợ của dạng bài đó.

## 7. Trang chủ và trò chơi

Trang chủ chỉ nên có: tiếp tục bài đang dở hoặc bài hôm nay; tóm tắt tiến độ một dòng; một thẻ khám phá có hình. Các trang khác: Khám phá, Ôn tập, Tiến độ, Tài khoản. Đừng dùng nhiều accordion để giữ nguyên mọi khối cũ trên trang chủ.

Trong bài chỉ có một hành động chính mỗi bước. Nút “quay về nhóm” giữ nguyên bài đang đọc. Màn kết thúc chỉ hiển thị kết quả có thật và việc nên làm tiếp.

| Hoạt động | Mục tiêu | Có thể làm bằng chứng nhớ độc lập? |
|---|---|---|
| Ghép hình–nghĩa | Làm quen ý nghĩa | Không |
| Xếp cụm trong câu | Học cấu trúc | Không tương đương tự nhớ |
| Điền cụm không có ngân hàng từ | Nhớ lại trong bối cảnh | Có, khi chưa mở gợi ý và đã có khoảng cách thời gian |
| Sửa vị trí đại từ | Tránh lỗi cấu trúc | Có cho kỹ năng tương ứng |
| Hội thoại phân nhánh | Hiểu lời đáp phù hợp | Chủ yếu nhận diện nếu được chọn đáp án |
| Nhìn cảnh mới, tự viết lời nhắn | Áp dụng sang tình huống khác | Có tiềm năng; cần đáp án linh hoạt/rubric |

Phần thưởng nên là hoàn thành nhiệm vụ, mở chương mới, nhìn lại câu từng sai đã nhớ sau nhiều ngày. Không dùng bảng xếp hạng hoặc đồng hồ đếm ngược mặc định. Mốc ôn cách quãng và gợi nhớ có cơ sở [1]; số phút, tần suất thưởng và thiết kế game vẫn cần thử với người dùng.

## 8. Database, bảo mật và vận hành

**Chưa có dữ liệu cho thấy phải đổi PostgreSQL để mở rộng.** Local dùng PGlite cho phát triển; production đã là PostgreSQL trên Render. Hàng nghìn bài không tự buộc phải đổi database. Giới hạn còn phụ thuộc số phiên đồng thời, cách đọc/ghi và gói tài nguyên; chưa có load test nên không hứa một con số người dùng.

Các điểm cần giải quyết:

- Bài đọc mới đang đóng gói trong JavaScript, chưa quản lý phiên bản qua API/database. Sau khi duyệt cấu trúc nội dung, chuyển sang lưu/publish có phiên bản; cache catalog, không tải hết media về cùng lúc.
- `readState` trả nhiều bảng và tối đa 5.000 attempts, khóa hàng settings trong transaction. Cần đo payload, độ trễ và tranh chấp khi nhiều request của cùng user; cân nhắc API summary, phân trang lịch sử và trả delta sau mutation.
- Ảnh/audio nên lưu object storage + CDN, PostgreSQL giữ metadata/key. Không lưu base64 của cả thư viện vào từng bản ghi bài học.
- Cloud trả phí nên ưu tiên backup/restore và độ sẵn sàng trước khi nghĩ đến sharding. Kiểm tra trạng thái và kỳ hạn database Free trực tiếp trong Dashboard; không dựa vào hướng dẫn cũ để bảo đảm dữ liệu còn lâu dài.
- CI hiện chỉ validate; chưa có job deploy sau CI. Cần thiết lập một cơ chế deploy có gate và kiểm tra commit thật đang chạy; tránh tuyên bố auto-deploy hoạt động chỉ vì đã push.
- Cảnh báo email sự cố hiện chưa được xác nhận hoạt động end-to-end. Cần gửi một sự cố thử có kiểm soát và xác minh người nhận nhận được thông báo.

**Ưu tiên bảo mật trước khi mở rộng người dùng:** Google OAuth hiện tự tìm và gắn tài khoản cũ theo email, trong khi đăng ký email/password chưa xác minh email. Người khác có thể đã tạo tài khoản bằng email nạn nhân và giữ mật khẩu/session sau khi nạn nhân đăng nhập Google. Không nên tự liên kết chỉ dựa trên email trùng. Cần quy trình chứng minh quyền sở hữu cả hai danh tính hoặc xử lý va chạm an toàn, cùng test chống account pre-hijacking. Đây là rủi ro suy ra từ luồng code, chưa khai thác thực tế.

Nên tách bảng danh tính OAuth theo `(provider, subject)`, thêm kiểm thử state/replay/account-linking, bảo vệ thông tin callback khỏi log, và xử lý đổi/xóa tài khoản cho người chỉ dùng Google (hiện giao diện yêu cầu mật khẩu họ không có). Các secret đã xuất hiện trong hội thoại trước cần được thay bằng credential mới; không ghi giá trị vào tài liệu.

## 9. Thứ tự triển khai và tiêu chí hoàn thành

| Ưu tiên | Công việc | Điều kiện xong |
|---|---|---|
| P0 | Sửa linking Google; kiểm tra backup và deploy gate | Test va chạm email/identity, khôi phục backup thử, CI fail không deploy |
| P1 | Một bài mẫu hoàn chỉnh với media đúng hành động | Người mới hiểu phải làm gì, hoàn thành không cần hướng dẫn; mobile đọc rõ |
| P1 | Lưu bài đọc/hội thoại và kết nối lịch ôn | Reload/đổi thiết bị tiếp tục đúng bài; gợi ý không tăng mastery; retry không nhân đôi kết quả |
| P1 | Phản hồi đúng/sai có giải thích | Không báo “sai” khi đúng có gợi ý; không chấm oan bộ đáp án hợp lệ đã duyệt |
| P2 | Làm sạch trang chủ và điều hướng | Một hành động chính; truy cập bài đang dở và nhóm bài rõ ràng |
| P2 | Duyệt 12 bài hiện tại rồi mở rộng 40 bài | Nội dung/media có phiên bản, quyền sử dụng và checklist biên tập |
| P2 | Audio nhất quán | Hai giọng hội thoại rõ, nghe từng lượt, phát chậm phù hợp, có transcript |
| P3 | Planner thích nghi và báo cáo tuần | Tải học giảm khi ôn tồn đọng; báo cáo phân biệt nhận diện và nhớ độc lập |
| P3 | AI phản hồi mở nếu thực sự cần | Có rubric, tập đánh giá đúng/sai, giới hạn chi phí, fallback và xử lý dữ liệu rõ ràng |

Không cần chờ đủ 40 bài để mời dùng thử; 8–12 bài tốt và lưu tiến độ đáng tin cậy đã đủ kiểm tra hướng sản phẩm. Không coi việc test unit/build qua là bằng chứng UI hoặc phương pháp học đã được kiểm chứng.

## 10. Đo xem sản phẩm có tốt hơn không

Thử 10–20 người đúng đối tượng trong 14 ngày. Đây là đề xuất, chưa có dữ liệu thu thập.

- Quan sát buổi đầu: tự tìm bài, hiểu tình huống, biết lý do sai và tiếp tục được không?
- Đo tỷ lệ hoàn thành bài đầu, quay lại D1/D7, rời ở bước nào; định nghĩa cohort và mẫu số rõ ràng.
- Kiểm tra nhớ không gợi ý ở ngày khác; báo cả số mẫu, không chỉ một phần trăm đẹp.
- Cho tình huống mới cùng nghĩa để phân biệt thuộc đoạn và sử dụng được.
- Hỏi ảnh giúp hiểu hành động hay chỉ “đẹp”; so hai phiên bản một cảnh trên nhóm nhỏ, chưa vội suy luận thống kê.
- Thu phản hồi “đáp án của tôi đúng nhưng bị chấm sai” và đưa vào quy trình biên tập.

Chỉ thu sự kiện cần thiết, không ghi token hoặc nội dung riêng tư vào analytics. Đề xuất events: lesson_started, exercise_submitted, hint_opened, lesson_completed, review_completed; kèm lesson version, dạng bài và mức hỗ trợ.

## 11. Nguồn và phạm vi áp dụng

1. [The Learning Scientists — Combining Effective Learning Strategies](https://www.learningscientists.org/blog/2017/9/14-1): cơ sở cho kết hợp spacing và retrieval; không bảo đảm kết quả của ứng dụng này.
2. [Cambridge Handbook — Principles for Reducing Extraneous Processing in Multimedia Learning](https://www.cambridge.org/core/books/abs/cambridge-handbook-of-multimedia-learning/principles-for-reducing-extraneous-processing-in-multimedia-learning-coherence-signaling-redundancy-spatial-contiguity-and-temporal-contiguity-principles/CD5B7AE1279A9AB81F8EEBB53DBEC86E): cơ sở cho hình liên quan trực tiếp, tín hiệu rõ và giảm chi tiết thừa; áp dụng vào thiết kế bài tiếng Anh là đề xuất của bản đánh giá.
3. [British Council — Phrasal verbs](https://learnenglish.britishcouncil.org/free-resources/grammar/b1-b2/phrasal-verbs): đối chiếu cấu trúc tách/không tách và vị trí đại từ; không phải nguồn để sao chép đoạn đọc/ảnh.

Đối chiếu source: [bài đọc](../frontend/src/components/PhrasalStories.jsx), [flashcard/xếp câu](../frontend/src/components/ContextPractice.jsx), [buổi học](../frontend/src/components/StudySession.jsx), [lịch ôn](../shared/progress.js), [đọc tiến độ](../backend/modules/learning/progress.repository.js), [OAuth](../backend/modules/auth/auth.service.js), [workflow CI](../.github/workflows/ci.yml). Tài liệu này bổ sung và cập nhật các nhận định cũ trong [PRODUCT.md](PRODUCT.md).
