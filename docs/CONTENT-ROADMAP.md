# Kế hoạch mở rộng nội dung và phát triển Little by Little

## Ưu tiên mới do người dùng chốt — 11/09/2026

Phần này thay thế thứ tự triển khai trước đó nếu có mâu thuẫn.

**Đợt 1: chất lượng và độ phong phú của nội dung, ảnh chụp thật.** Tuyển chọn đoạn đọc/từ vựng từ nguồn cho phép tái sử dụng, biên tập thành bài phù hợp người Việt, tăng tình huống và hội thoại. Dùng ảnh chụp thật từ nguồn hợp lệ; không dùng tranh vector hay ảnh AI giả lập để đáp ứng yêu cầu “ảnh chân thật”. Không xem việc tăng số dòng từ vựng là hoàn thành nâng chất lượng.

**Đợt 2, làm sau:** nối kết quả, thống nhất tiến độ tài khoản và hoàn thiện các thiếu hụt hệ thống. Không để rewrite progress/API thành điều kiện chặn đợt nội dung. Đợt 1 có thể dùng schema nội dung và renderer hiện tại/mở rộng tối thiểu, giữ ID ổn định và nguồn gốc để nối ở đợt 2. Bài chưa đồng bộ phải ghi đúng trạng thái tự luyện; không tạo dấu hoàn thành giả.

### Nguồn ảnh thật đã kiểm tra

- [Pexels License](https://www.pexels.com/license/): cho phép dùng ảnh trong sản phẩm theo điều khoản, gồm thương mại; không bán lại ảnh nguyên bản như sản phẩm stock, không ngụ ý người trong ảnh chứng thực ứng dụng.
- [Unsplash License](https://unsplash.com/license): có quyền tải/sử dụng thương mại theo điều khoản; không coi Unsplash+ là ảnh miễn phí mặc định. Nếu dùng API phải tuân thủ riêng điều khoản API.
- Commons vẫn là lựa chọn khi từng ảnh có quyền rõ ràng. Không lấy ảnh từ Google Images rồi mặc định tự do sử dụng.
- Chọn ảnh có hành động/đồ vật khớp bài. Ví dụ bài đổi size: quần áo, quầy cửa hàng/phòng thử; bài tàu: sân ga/biển chỉ dẫn; không thay mọi chủ đề bằng cùng một ảnh phong cảnh đẹp.
- Lưu bản ảnh được phép vào assets hoặc storage, tạo bản WebP/AVIF phù hợp màn hình, giữ aspect ratio/focal point và alt mô tả đúng thứ thực sự nhìn thấy. Lưu tác giả, trang gốc, license, ngày kiểm tra; không phụ thuộc link ảnh ngẫu nhiên hay hotlink không ổn định.

Các ứng viên đã tìm thấy, chưa tải/duyệt trực quan hoặc tích hợp vào app:

| Bài | Ảnh ứng viên | Credit trên trang nguồn |
| --- | --- | --- |
| Cà phê | https://www.pexels.com/photo/a-coffee-cup-sitting-on-a-wooden-table-27407741/ | Ryon Justin Moran / Pexels |
| Mua sắm | https://www.pexels.com/photo/women-shopping-in-clothing-store-5864244/ | Rachel Claire / Pexels |
| Đi tàu | https://www.pexels.com/photo/empty-platform-in-train-station-9360429/ | Kiểm tra tác giả trước tải |

### Nguồn đọc/từ vựng và đầu ra đợt 1

- Ưu tiên VOA tự sản xuất, có quyền tái sử dụng và credit; không lấy ảnh AP/Reuters đi kèm. Đối chiếu [hướng dẫn VOA](https://learningenglish.voanews.com/p/6861.html).
- Ứng viên thực tế: [Coffee or Tea?](https://learningenglish.voanews.com/a/coffee-or-tea-/4551468.html), [American English vs. British English](https://learningenglish.voanews.com/a/words-and-their-stories-american-versus-british-english/3397694.html). Tuyển nội dung phù hợp độ khó, lưu nguồn và đánh dấu adapted; không gắn nhãn bài nguyên bản hoàn toàn khi dựa trên bài nguồn.
- Tatoeba cho câu/ví dụ sau khi lọc nghĩa, độ tự nhiên và quyền cụ thể; nguồn từ điển dùng kiểm tra collocation/register chứ không tự động copy toàn bộ definitions.
- Mỗi bài phải có ngữ cảnh, từ/cụm theo nghĩa, đoạn đọc chính + biến thể, hội thoại có mục đích, bản dịch/giải thích và ảnh thật đúng chủ đề. Thêm nguồn trực tiếp trong phần thông tin bài.
- Bắt đầu bộ 12 bài đã đề xuất, nhưng nghiệm thu chất lượng 2 bài đầu trước khi nhân rộng. Giữ thử nghiệm local; chưa mặc định push/deploy hay phát sinh chi phí dịch vụ.

Ngày: 09/09/2026. Trạng thái: đề xuất triển khai sau khi Studio trở thành UI chính. Đây là kế hoạch, chưa nhập dữ liệu, chưa thay schema, chưa mua dịch vụ. Các con số bên dưới là mục tiêu biên tập, không phải kết quả đã đạt hay cam kết hiệu quả học.

## 1. Quyết định sản phẩm

Tập trung người Việt trình độ khoảng A2–B1: biết nhiều từ nhưng khó diễn đạt trong đời sống. Cung cấp hỗ trợ A1 ở các bài cơ bản và mở rộng B2 sau; chưa đồng thời làm IELTS, trẻ em, tiếng Anh chuyên ngành sâu.

Lời hứa: **Mỗi ngày xử lý được một tình huống nhỏ bằng tiếng Anh, rồi nhớ lại được trong tình huống khác.**

Đơn vị sản phẩm là bài tình huống có mục tiêu giao tiếp, không phải số dòng trong từ điển. Một từ nhiều nghĩa phải tách nghĩa: pick up = nhấc vật; pick up = đón người; pick up = học được một cách tự nhiên. Không gom ba nghĩa vào một thẻ rồi coi là đã biết cả từ.

Dùng CEFR can-do để định hướng mục tiêu; độ khó do biên tập gán và thử với người học, không tự quảng cáo chứng nhận CEFR. Nguồn khung: [Council of Europe — CEFR descriptors](https://www.coe.int/en/web/common-european-framework-reference-languages/cefr-descriptors).

## 2. Hiện trạng và khoảng trống

- Catalog nguồn có 640 mục, 16 chủ đề; chủ yếu sentence/phrasal/expression. Đây không phải 640 bài hoặc 640 từ vựng đơn được biên soạn đầy đủ.
- Đã có câu ví dụ, hội thoại, một số chuyện phrasal và Studio với hình SVG. Hình hiện còn dùng lại giữa nhiều chủ đề, chưa diễn tả từng nghĩa.
- Phrase attempts có chấm/lưu server; một số hoạt động đọc và mini quiz chưa vào global progress. Bài ga có luồng riêng. Phải thống nhất tiến độ trước khi tăng hàng trăm bài mới.
- `backend/db/seed.js` dùng `ON CONFLICT DO NOTHING`: sửa text trong file seed không tự cập nhật nội dung của ID đã tồn tại trên DB production. Cần pipeline publish có revision, không chuyển sang ghi đè toàn bộ một cách mù quáng.
- `CatalogContext.jsx` tải catalog đầy đủ và cache localStorage. Khi có nhiều đoạn đọc/audio, cần manifest nhẹ và tải theo bài; không nhét tất cả vào bundle hoặc localStorage.

## 3. Hệ thống chủ đề

Giữ 16 topic ID hiện tại để bảo toàn bookmark/progress. Thêm taxonomy bên trên; một bài có thể nhiều tag nhưng có một nơi chính trong thư viện. Người dùng thấy khoảng 6 nhóm lớn, không phải 24 thẻ cùng đập vào mắt.

| Nhóm lớn | Bốn chủ đề con đề xuất | Tình huống mẫu |
| --- | --- | --- |
| Sinh hoạt & nhà cửa | Nhịp hằng ngày; nấu ăn; việc nhà; thuê nhà & hàng xóm | Trễ giờ; thiếu nguyên liệu; chia việc; báo vòi nước hỏng |
| Ăn uống & mua sắm | Quán cà phê/nhà hàng; siêu thị; quần áo; mua hàng online | Đổi món; tìm hàng; đổi size; kiện hàng thất lạc |
| Di chuyển & du lịch | Đi lại trong thành phố; sân bay; khách sạn; khám phá địa phương | Lỡ trạm; đổi cửa bay; phòng có vấn đề; hỏi đường |
| Công việc & học tập | Văn phòng; họp/remote; phỏng vấn; học nhóm & tự học | Báo tiến độ; xin làm rõ; kể kinh nghiệm; xin phản hồi |
| Con người & cảm xúc | Làm quen/small talk; bạn bè & lời mời; cảm xúc & bất đồng; gia đình | Mở chuyện; từ chối lịch sự; hiểu lầm; thống nhất kế hoạch |
| Dịch vụ & sở thích | Công nghệ/hỗ trợ; lịch hẹn & sức khỏe; giải trí/thể thao; tiền bạc & dịch vụ | Wi-Fi lỗi; dời lịch khám; rủ đi tập; hỏi khoản phí |

Sức khỏe/tiền bạc dạy giao tiếp, không hướng dẫn chẩn đoán hay quyết định tài chính. Bài có thể dùng bối cảnh Việt Nam nhưng lời thoại tiếng Anh tự nhiên; tránh dịch từng chữ từ tiếng Việt.

Mỗi chủ đề có 6 tình huống phát triển dần: yêu cầu đơn giản → làm rõ → thay đổi → xử lý trục trặc → thương lượng lịch sự → vận dụng trong bối cảnh mới. Không bắt mọi chủ đề cùng đúng 40 câu.

## 4. Mẫu chuẩn một bài

Thời gian hiển thị ban đầu ước tính 8–12 phút và điều chỉnh sau đo thực tế. Một buổi mặc định học 3–5 mục tiêu mới; lịch ôn được ưu tiên khi người học đang có nhiều câu đến hạn.

| Thành phần | Chuẩn biên tập |
| --- | --- |
| Mục tiêu | Một việc cụ thể: yêu cầu đổi size và hỏi thời hạn trả hàng |
| Mục tiêu từ/ngữ | Khoảng 5 sense: ví dụ 2 từ/collocation, 2 phrasal, 1 mẫu câu; không ép phrasal vào tình huống không tự nhiên |
| Ngữ cảnh | Ai nói với ai, ở đâu, quan hệ, mục đích, mức lịch sự |
| Đọc chính | A1 khoảng 40–70 từ; A2 70–110; B1 110–160; đây là khoảng biên tập, không phải quy định CEFR |
| Đọc biến thể | Một đoạn 40–90 từ dùng lại mục tiêu ở hoàn cảnh khác; xuất hiện trong lần ôn sau |
| Đọc chuyển giao | Một đoạn/tin nhắn/thông báo mới; không chỉ đổi tên người trong đoạn cũ |
| Hội thoại | Một hội thoại 6–10 lượt; một biến thể 4–8 lượt cho buổi ôn. Nhân vật phải có ý định và phản ứng hợp lý |
| Hình | Một hình bối cảnh; thêm 2–3 khung hành động khi nghĩa cần chuyển động |
| Bài tập | 1 câu hiểu ý, 1 bài ghép/xếp, 2 câu tự nhớ, 1 nhiệm vụ chuyển ngữ cảnh; không cần chơi hết mọi mode |
| Ghi chú | Nghĩa Việt, dạng từ, collocation, lỗi thường gặp, register/US–UK khi có ý nghĩa |
| Kết thúc | Nêu việc vừa luyện được, câu cần ôn và lịch quay lại; không tính lật thẻ là nhớ vững |

Ba đoạn và hai hội thoại là bộ tài sản của bài, không bắt người học đọc tất cả trong một lần. Từ mục tiêu được highlight có thể chạm xem; bản dịch mở theo đoạn. Khi tự nhớ, không để nguyên đáp án trong heading, alt text hoặc transcript cạnh câu hỏi.

### Ví dụ nguyên bản: đổi chiếc áo không vừa

Mục tiêu A2: yêu cầu đổi size lịch sự. Năm mục: receipt; size; try on; take back (return an item); Could I exchange this for…?

Đoạn đọc minh họa do soạn mới cho kế hoạch:

> Yesterday, I bought a blue jacket for my first day at work. I did not have time to **try it on** in the shop. At home, I noticed that the sleeves were too short. Luckily, I still had the **receipt**. This morning, I decided to **take it back**. The shop assistant asked what **size** I needed. “**Could I exchange this for** a medium?” I asked. She checked the shelf and brought me another jacket. This time, I tried it on before leaving.

Hội thoại ngắn:

- Customer: Hi. I bought this yesterday, but it’s too small.
- Assistant: Do you have the receipt?
- Customer: Yes, here it is. Could I exchange this for a medium?
- Assistant: Of course. Would you like to try it on first?
- Customer: Yes, please. Where are the fitting rooms?
- Assistant: Just over there, next to the mirror.

Lần ôn sau chuyển sang đôi giày mua online. Bài hỏi khác mục tiêu: người dùng muốn hoàn tiền thay vì đổi size; không chấp nhận câu lịch sự nhưng sai ý định. Take it back ở đây là trả món hàng, không phải rút lại lời vừa nói. Try it on tách đại từ đúng vị trí; “try on it” không được coi là đúng.

## 5. Từ vựng và phrasal phải được biên tập như thế nào?

- Lưu sense ID riêng; một lemma có nhiều sense. Theo dõi tiến độ ở sense, còn lemma dùng để tra cứu/tổng hợp.
- Dạy chunk/collocation: a tight deadline, make a reservation, get a refund. Không chỉ flashcard deadline = hạn chót.
- Nhóm đầu tiên theo mục tiêu tình huống: buổi sáng wake up/get up/head out; hẹn gặp pick someone up/set off/get back; giải quyết vấn đề look into/work out/follow up.
- Trong chế độ tra cứu có thể xem theo động từ gốc hoặc particle. Không lấy “mọi cụm với get” làm lộ trình mặc định cho người mới.
- Giới thiệu cụm dễ nhầm có khoảng cách, sau đó dùng bài đối chiếu: get on a bus / get in a car. Không dồn quá nhiều nghĩa tương tự cùng một lượt mới.
- Mỗi sense có ít nhất 2 ví dụ do biên tập viết ở context khác nhau; 1 chú ý về cấu trúc nếu cần; đáp án thay thế có kiểm duyệt.
- Phát hiện trùng theo lemma+sense+pattern, không chỉ so chuỗi. Các mục trong 640 catalog phải được audit/map trước khi gọi mục mới là “từ vựng mới”.

## 6. Lấy nguồn ở đâu?

Nguyên tắc: dữ liệu truy cập miễn phí không đồng nghĩa được tái phân phối thương mại. Sửa vài từ bằng AI không tự biến tác phẩm người khác thành nội dung độc quyền. Mục tiêu là sở hữu phần biên soạn bài học và biết chính xác quyền của phần tái sử dụng.

| Nguồn | Dùng cho việc gì | Cách áp dụng và giới hạn |
| --- | --- | --- |
| [CEFR — Council of Europe](https://www.coe.int/en/web/common-european-framework-reference-languages/cefr-descriptors) | Chọn mục tiêu can-do, hoạt động giao tiếp | Tham chiếu khung và tự viết mục tiêu bài; không coi là ngân hàng từ/câu để import |
| [Paul Nation — vocabulary resources](https://www.wgtn.ac.nz/lals/resources/vocrefs) | Tham khảo ưu tiên từ vựng và tài nguyên nghiên cứu | Kiểm tra điều khoản từng tài liệu trước khi tái phân phối; không suy từ có nút download ra commercial license |
| [Tatoeba — terms](https://tatoeba.org/tr/terms_of_use), [downloads](https://tatoeba.org/en/downloads) | Câu ví dụ ngắn, đối chiếu bản dịch | Text có cơ chế CC BY 2.0 FR/CC0; lưu license cụ thể, sentence ID, tác giả, URL, attribution và thay đổi. Tuyển chọn rồi duyệt tiếng Anh/Việt, không nhập toàn corpus |
| [Tatoeba — audio FAQ](https://en.www.en.wiki.tatoeba.org/articles/show/faq) | Một số audio câu ngắn | License từng recording độc lập với text, có thể NC hoặc không cho tái dùng; chỉ lấy file có quyền phù hợp. Không phải nguồn giọng đồng nhất cho hội thoại mới |
| [VOA Learning English — content reuse](https://learningenglish.voanews.com/p/6861.html), [terms](https://learningenglish.voanews.com/p/5374.html) | Đọc thực tế, audio tham khảo cho B1 trở lên | Nội dung VOA tự sản xuất được công bố public domain và cho tái dùng có credit; loại bài/ảnh/audio từ AP, Reuters, AFP hoặc bên thứ ba. Đối chiếu từng asset và hướng dẫn xin dùng/affiliate nếu áp dụng |
| [Wiktionary — copyrights](https://en.wiktionary.org/wiki/Wiktionary:Copyrights) | Tra cấu trúc, nghĩa, dạng từ | Có CC BY-SA/GFDL và điều khoản vật liệu bên ngoài. Nếu tái sử dụng thì giữ attribution và nghĩa vụ license của phần thích nghi; chưa ưu tiên đưa vào kho nội dung độc quyền |
| [Project Gutenberg — permission](https://www.gutenberg.org/policy/permission), [license](https://www.gutenberg.org/policy/license) | Truyện đọc mở rộng khi có B1/B2 | Kiểm tra quyền theo lãnh thổ, phiên bản/bản dịch và trademark; tác phẩm cũ không phải lựa chọn chính cho giao tiếp hiện đại |
| [Wikimedia Commons — reuse](https://commons.wikimedia.org/wiki/Commons:Reusing_content_outside_Wikimedia/en) | Ảnh đồ vật/địa điểm thật | Kiểm tra license và attribution trên từng file; không mặc định mọi ảnh trên Wikipedia đều dùng được |
| [British Council — app terms](https://learnenglish.britishcouncil.org/terms-of-use-for-apps) | Tham khảo phương pháp, format, độ tự nhiên | Không nhập bài/ảnh/audio từ app của họ vào sản phẩm bán; sử dụng khác phải kiểm tra điều khoản đúng website/tài liệu hoặc xin phép |

Ngày kiểm tra nguồn là ngày tài liệu này; điều khoản phải được kiểm tra lại lúc nhập. Trang Tatoeba tiếng Anh bị rate-limit lúc khảo sát, đã đối chiếu bản terms ngôn ngữ khác trên domain chính và tài liệu FAQ của dự án. Chưa phê duyệt quyền cho bất kỳ bộ tải cụ thể nào.

**Chọn nguồn cho pilot:** bài/đoạn/hội thoại tự biên soạn là lõi; Tatoeba chỉ chọn câu hỗ trợ có attribution; CEFR và tài nguyên từ vựng dùng để lập coverage. VOA dành cho nhánh đọc mở rộng sau. Hình chủ đạo tiếp tục SVG/illustration tự tạo để nhất quán Studio.

## 7. Pipeline biên tập và nhập dữ liệu

1. **Brief:** chọn người học, mục tiêu, sense mới/ôn, độ dài và hình cần có.
2. **Nguồn:** lập source record trước khi tải; lưu URL, tác giả, license/version, ngày kiểm tra, phạm vi quyền, credit bắt buộc. Không rõ quyền thì chưa nhập vào draft xuất bản.
3. **Draft:** tác giả/AI hỗ trợ viết từ brief; không đưa đoạn không được phép vào prompt để yêu cầu đổi chữ. Lưu ghi chú công cụ hỗ trợ, tránh khẳng định nội dung là do chuyên gia duyệt khi chưa có người duyệt.
4. **Validation tự động:** schema, ID, target tồn tại, đáp án hợp lệ, highlight đúng surface form, số từ, link asset, trùng lặp chính xác/gần giống. Similarity chỉ là tín hiệu để review, không phải bằng chứng quyền sử dụng.
5. **Language review:** kiểm tra nghĩa, collocation, grammar, register, bản dịch, ambiguity và độ khó. Người duyệt độc lập với người tạo khi có thể; trước bán cần người biên tập tiếng Anh đủ năng lực.
6. **Learning review:** prompt không lộ đáp án, có task chuyển context; câu chọn lựa không có hai đáp án đều đúng; feedback giải thích lỗi.
7. **Media review:** hình đúng nghĩa; audio khớp revision transcript, có pronunciation check; caption/alt và reduced-motion. Preview trên mobile.
8. **Publish:** preview → approved → published qua batch có revision, audit log và rollback. Frontend chỉ đọc published; draft không xuất hiện qua API công khai.
9. **Theo dõi:** report nội dung sai gắn lesson/version/question; sửa có version, giữ attempt cũ để giải thích lịch sử.

Không public raw HTML từ nguồn ngoài; lưu plain text/segment cấu trúc. Không để importer tải URL tùy ý từ UI người dùng: allowlist nguồn, giới hạn dung lượng, MIME, timeout; media đưa qua kiểm duyệt. Quyền edit/publish kiểm ở server.

## 8. Nền tảng kỹ thuật

Giữ React + modular backend JS + PostgreSQL. Không cần đổi DB chỉ để thêm vài nghìn sense và vài trăm bài; xác định giới hạn bằng dung lượng/latency thực tế. Chi phí audio/ảnh và cách tải catalog có thể đáng chú ý hơn text.

### Mô hình dữ liệu đề xuất

| Đối tượng | Trường/quan hệ cốt lõi |
| --- | --- |
| domains/topics | ID ổn định, parent, nhãn, thứ tự; taxonomy độc lập catalog cũ |
| lexical_entries / senses | lemma, type, sense ID, nghĩa Việt, cấu trúc, separability, register, variants, CEFR editorial |
| lessons / lesson_versions | topic, canDo, version, status, level, estimatedMinutes, reviewer |
| lesson_targets | lessonVersion, senseId, role new/review, position |
| passages / dialogue_turns | loại main/variant/transfer, speaker, segments; segment có text và senseId tùy chọn |
| exercises | lessonVersion, targetSenseIds, prompt, rubric, acceptedAnswers, distractors, hint policy |
| media_assets | storageKey, MIME, dimensions/duration, transcriptHash, voice, sourceId, alt, status |
| source_records | sourceURL, author, license, rightsNotes, checkedAt, attribution, changes |
| learning_events / sense_progress | eventKey, userId, target, exerciseVersion, mode, hinted, result; lịch ôn theo sense |
| legacy_phrase_senses | ánh xạ phrase ID cũ sang sense; giữ liên kết bookmark/attempt đã tồn tại |

Highlight ví dụ `pick her up` phải tham chiếu cùng sense với `pick up someone`, không dùng replace chuỗi lemma để tìm. JSON segments được validate trước publish.

### Thứ tự chuyển đổi an toàn

- Migration additive, không xóa phrase IDs/progress cũ. Mapping không rõ nghĩa chuyển hàng chờ duyệt.
- Viết lesson API chung, chuyển bài station thành adapter dùng API đó trước; thêm tests idempotency, auth isolation, retry, revision và rollback.
- Nối đọc/hội thoại/thẻ vào cùng dữ liệu học. Phân biệt viewed / practiced / independently recalled; tự đánh dấu và nhận diện không được nâng mastery như tự nhớ.
- Cập nhật export/import/reset/delete để bao phủ dữ liệu lesson mới, cùng chính sách giữ/xóa event.
- Thay seed-only bằng publish command có dry-run diff và expected revision; không ghi đè chỉnh sửa admin ngoài ý muốn. Có thể khởi đầu JSON files + CLI + preview, sau đó mới CMS đầy đủ.
- Catalog API trả topic/lesson summaries; lesson detail tải theo ID/version. Search phân trang server, index topic/level/published; PostgreSQL đủ cho bước đầu, chưa cần vector DB.
- Ảnh/audio ở object storage/CDN theo content hash. Client cache lesson đã tải bằng IndexedDB/Cache API và giới hạn dung lượng; progress tài khoản vẫn authoritative ở server.
- Không sinh TTS mỗi lần bấm loa: tạo audio sau duyệt text, cache theo transcript+voice+version. Queue và hạn mức chi phí, thất bại có retry. Chưa chọn/gọi dịch vụ trả phí trong kế hoạch này.

## 9. Kế hoạch sản lượng và cổng chất lượng

Các mốc là phạm vi tích lũy, không cộng tất cả cột lại. Một sense có thể xuất hiện ở nhiều bài; số slots không đồng nghĩa số từ độc nhất. Nội dung cũ đủ chuẩn được tái sử dụng và tính vào mục tiêu, không tính hai lần.

| Mốc | Phạm vi | Đoạn đọc / hội thoại | Điều kiện qua mốc |
| --- | --- | --- | --- |
| Pilot | 12 bài, 6 chủ đề ưu tiên, khoảng 45–60 sense đã duyệt | 36 đoạn / 24 hội thoại | Schema, rights, grading, resume, export/reset hoạt động; mỗi bài được review và thử với người học |
| Bộ nền | 48 bài, 12 chủ đề, khoảng 180–220 sense | 144 đoạn / 96 hội thoại | Có report/correction, xuất bản version, theo dõi trả lời sau 7 ngày; không còn nội dung lỗi nghiêm trọng đã biết |
| Thư viện rộng | 144 bài, 24 chủ đề, khoảng 450–550 sense | 432 đoạn / 288 hội thoại | Có biên tập viên, quy trình ổn định, ngân sách media và bằng chứng người dùng muốn các chủ đề mới |

Phân bổ nhắm tới khoảng 50–60% vocabulary/collocations, 20–25% phrasal senses và phần còn lại sentence patterns; điều chỉnh theo tình huống, không chạy theo quota từ hiếm.

Pilot 12 bài đề xuất: gọi cà phê/đổi món; hỏi đường/lỡ trạm; báo trễ/xin làm rõ công việc; mời bạn/từ chối lời mời; đổi size/trả hàng; báo Wi-Fi lỗi/dời lịch hẹn. Hai bài một chủ đề đủ thử tái sử dụng từ ở context khác.

### Thứ tự thực hiện, không hứa thời hạn thiếu nguồn lực

1. Audit 640 mục và mapping sense; viết schema/validator/source manifest, chọn 2 bài mẫu hoàn chỉnh.
2. Xây lesson renderer/API/progress chung, chuyển bài ga và 2 bài mẫu; kiểm tra account/guest/offline.
3. Hoàn thành pilot 12 bài + hình, nghe thử audio nếu có; thử với 5–10 người học mục tiêu. Mẫu này dùng tìm lỗi, không chứng minh hiệu quả thống kê.
4. Sửa theo quan sát, mở 48 bài theo batch 6–12 đã duyệt. Chỉ mở 144 khi review/publish không thành nút thắt.

Đo thời gian thực tế cho hai bài đầu rồi mới ước lượng lịch còn lại: tổng công = số bài × thời gian viết+review+media+QA, cộng phần nền tảng. AI giảm thời gian nháp nhưng không loại bỏ kiểm duyệt.

## 10. Giữ người học và đo hiệu quả

- Chuỗi truyện có nhân vật trở lại: chuyển nhà, ngày đầu đi làm, chuyến đi cuối tuần. Mỗi tập tự đứng được và liên kết sense cũ.
- Nhiệm vụ đời sống: tìm đúng sân ga, giải quyết đơn hàng nhầm, đổi lịch với đồng nghiệp. Chơi bằng lựa chọn/tự nhập có phản hồi, không thưởng đoán bừa.
- Ôn luân phiên ảnh→cụm, nghe→ý, tình huống→câu, điền đoạn mới. Bài chuyển context giúp phân biệt nhớ đúng mẫu với biết dùng.
- “Hôm nay ít thời gian”: chỉ ôn câu đến hạn, không phạt mất streak. Không tăng từ mới khi backlog vượt tải người học chọn.
- Dashboard tách số đã xem, đã luyện, tự nhớ sau thời gian; không lấy điểm game làm vốn từ thành thạo.

Chỉ số cần đo từ event/version: hoàn thành bài đầu; quay lại D7; tự nhớ đúng lần đầu sau 7 ngày không gợi ý; làm đúng task context mới; số câu bỏ cuộc; lỗi nội dung/100 lượt làm; thời gian tải media; chi phí/learner hoạt động. Khi báo recall phải ghi mẫu số là các lượt review đủ điều kiện đã được làm và báo riêng người không quay lại, tránh bỏ qua họ rồi công bố tỷ lệ đẹp.

Mốc tham khảo nội bộ để bắt đầu thảo luận, chưa là benchmark ngành: >=70% người thử hoàn thành bài đầu; >=70% trả lời đúng ở lượt review D7 đã làm. Đo baseline trước, điều chỉnh độ khó/khối lượng; không dùng các số này làm quảng cáo “hiệu quả đã chứng minh”.

## 11. Hướng phát triển tương lai

| Giai đoạn | Giá trị chính | Phụ thuộc |
| --- | --- | --- |
| Nền tảng gần nhất | Kho bài có review, nhiều tình huống, lưu và ôn thống nhất | Pilot, versioned content, metrics |
| Cá nhân hóa | Chọn tình huống theo mục tiêu và lỗi thực tế; gợi ý bài kế tiếp | Dữ liệu sense/attempt đáng tin, đủ độ phủ |
| Nghe/nói tốt hơn | Hai giọng tự nhiên, hội thoại nhiều vai, shadowing ngắn | Quyền audio, cache, ngân sách; speech-to-text không được gọi là điểm phát âm |
| AI roleplay có giới hạn | Thử tình huống mở sau khi học, feedback theo rubric | Kiểm duyệt, giới hạn chi phí, bảo vệ dữ liệu, bộ đánh giá sai/chấm oan; không thay bài chuẩn bằng chat vô hạn |
| Gói chuyên biệt | Đi làm, du lịch, dịch vụ khách hàng, IT giao tiếp | Nhu cầu thật và reviewer đủ chuyên môn |
| Bán sản phẩm | Gói miễn phí đủ hoàn thành một hành trình; gói trả phí thêm bộ bài/voice/roleplay quota | Người học quay lại, payment/support/privacy/deletion và chi phí phục vụ rõ ràng |
| Nhóm học/doanh nghiệp | Giáo viên giao bài, nhóm luyện theo tình huống | Có khách hàng cần và quyền dữ liệu phù hợp; chưa làm mạng xã hội trước |

Chưa ưu tiên: leaderboard toàn cầu, quá nhiều currency/game, chatbot không giới hạn, thu thập hàng triệu câu, đổi DB vì cảm giác “scale”, app native khi PWA chưa đủ tốt. Mỗi tính năng mới phải phục vụ tình huống, khả năng tự nhớ hoặc sự quay lại của người học.

## 12. Bước nên bắt đầu ngay khi triển khai

**CONTENT-01:** inventory/mapping 640 mục → schema sense/lesson/source → hai bài mẫu “đổi size” và “đổi lịch hẹn” đầy đủ đoạn/hội thoại/hình/rubric → preview qua cùng renderer. Nghiệm thu chất lượng hai bài rồi mới nhân rộng.

Không cần mua corpus, chuyển cloud database hay chạy AI/TTS tốn phí để bắt đầu bước này. Tài liệu này chưa làm phát sinh nhập dữ liệu hay deploy.
