import { additions, extraTopics } from "./content-expansion.js";
const baseTopics = [
  {
    id: "everyday",
    name: "Cuộc sống hằng ngày",
    en: "Everyday life",
    icon: "Sun",
    color: "peach",
    description: "Từ lời chào đầu ngày đến những cuộc trò chuyện nhỏ.",
    rows: `How's your day going?|Ngày của bạn thế nào rồi?
What have you been up to?|Dạo này bạn làm gì?
I'm on my way.|Tôi đang trên đường đến.
I'll be right back.|Tôi sẽ quay lại ngay.
Take your time.|Cứ từ từ nhé.
That sounds good to me.|Tôi thấy vậy ổn đấy.
Could you give me a hand?|Bạn giúp tôi một tay được không?
Let me know when you're ready.|Khi nào sẵn sàng thì nói tôi nhé.
I'm running a little late.|Tôi sẽ đến hơi muộn.
What do you feel like doing?|Bạn muốn làm gì?
It's up to you.|Tùy bạn quyết định.
I didn't catch that.|Tôi chưa nghe rõ.
Could you say that again?|Bạn nói lại được không?
I'll keep that in mind.|Tôi sẽ ghi nhớ điều đó.
Thanks for letting me know.|Cảm ơn bạn đã cho tôi biết.
Let's call it a day.|Hôm nay dừng ở đây thôi.
wake up|thức dậy|I usually wake up at seven.
get up|ra khỏi giường|It's time to get up.
head out|ra ngoài, lên đường|I'm going to head out now.
clean up|dọn dẹp|Let's clean up the kitchen.
No worries.|Không sao đâu.|Dùng để đáp lại lời xin lỗi hoặc lời cảm ơn.
Same here.|Tôi cũng vậy.|Đồng tình khi bạn có cùng cảm nhận.
You bet!|Chắc chắn rồi!|Cách đáp thân mật, thể hiện sự sẵn lòng.
So far, so good.|Đến giờ mọi thứ vẫn ổn.|Nói về tình hình đang diễn ra.`,
  },
  {
    id: "work",
    name: "Công việc & văn phòng",
    en: "Work & office",
    icon: "BriefcaseBusiness",
    color: "lavender",
    description: "Tự tin trao đổi, họp nhóm và làm việc cùng đồng nghiệp.",
    rows: `Could we schedule a meeting?|Chúng ta sắp xếp một cuộc họp được không?
I'll send you an update.|Tôi sẽ gửi bạn thông tin cập nhật.
What's the deadline?|Hạn chót là khi nào?
I'm working on it.|Tôi đang làm việc đó.
Could you clarify that point?|Bạn làm rõ ý đó được không?
Let's take a short break.|Chúng ta nghỉ một chút nhé.
I have a suggestion.|Tôi có một đề xuất.
That works for me.|Như vậy phù hợp với tôi.
Can I get your feedback?|Bạn cho tôi nhận xét được không?
I'll get back to you tomorrow.|Tôi sẽ phản hồi bạn vào ngày mai.
Let's go over the details.|Chúng ta xem lại các chi tiết nhé.
Are you available this afternoon?|Chiều nay bạn có rảnh không?
I need a little more time.|Tôi cần thêm một chút thời gian.
Thanks for your patience.|Cảm ơn bạn đã kiên nhẫn.
Let's keep everyone in the loop.|Hãy cập nhật thông tin cho mọi người.
I agree with your approach.|Tôi đồng ý với cách làm của bạn.
follow up|theo dõi, hỏi thêm sau đó|I'll follow up with the client tomorrow.
take over|tiếp quản|Can you take over this project?
put off|trì hoãn|Let's not put off the meeting.
figure out|tìm ra, hiểu ra|We need to figure out what went wrong.
We're on the same page.|Chúng ta cùng hiểu vấn đề như nhau.|Dùng khi đã thống nhất cách hiểu.
Let's touch base tomorrow.|Mai mình trao đổi nhanh nhé.|Thường dùng giữa đồng nghiệp.
I'll give it my best shot.|Tôi sẽ cố hết sức.|Thể hiện tinh thần sẵn sàng thử.
It's a work in progress.|Việc đó vẫn đang được hoàn thiện.|Dùng khi công việc chưa hoàn tất.`,
  },
  {
    id: "food",
    name: "Ăn uống & cà phê",
    en: "Food & coffee",
    icon: "Coffee",
    color: "sand",
    description: "Gọi món thật tự nhiên, từ quán quen đến nhà hàng mới.",
    rows: `A table for two, please.|Cho tôi bàn hai người.
Could I see the menu?|Cho tôi xem thực đơn được không?
What would you recommend?|Bạn gợi ý món nào?
I'd like an iced latte.|Cho tôi một latte đá.
Can I have it without sugar?|Cho tôi không đường được không?
Is this dish spicy?|Món này có cay không?
I'm allergic to peanuts.|Tôi dị ứng đậu phộng.
Could we have some water?|Cho chúng tôi chút nước được không?
I'll have the same.|Tôi gọi món giống vậy.
Can we get this to go?|Cho chúng tôi mang món này về được không?
That was delicious.|Món đó ngon lắm.
Could we have the bill, please?|Cho chúng tôi xin hóa đơn.
Can we split the bill?|Chúng tôi chia hóa đơn được không?
Is service included?|Đã bao gồm phí phục vụ chưa?
I'd like to make a reservation.|Tôi muốn đặt bàn.
I'm still deciding.|Tôi vẫn đang chọn món.
eat out|ăn ở ngoài|We eat out on Fridays.
cut down on|cắt giảm|I'm trying to cut down on sugar.
heat up|hâm nóng|Can you heat up the soup?
run out of|hết, không còn|We've run out of milk.
It's on me.|Bữa này tôi mời.|Dùng khi muốn trả tiền cho mọi người.
I'm stuffed.|Tôi no căng rồi.|Cách nói thân mật sau khi ăn.
Help yourself.|Cứ tự nhiên lấy nhé.|Mời ai đó tự lấy đồ ăn hoặc thức uống.
Just a little, please.|Cho tôi một chút thôi.|Dùng khi được mời thêm đồ ăn.`,
  },
  {
    id: "travel",
    name: "Du lịch & khám phá",
    en: "Travel & explore",
    icon: "Plane",
    color: "blue",
    description: "Sẵn sàng cho những chuyến đi và trải nghiệm mới.",
    rows: `Where is the nearest station?|Ga gần nhất ở đâu?
I'd like a one-way ticket.|Tôi muốn mua vé một chiều.
Which platform does it leave from?|Tàu khởi hành ở sân ga nào?
How long does it take to get there?|Đến đó mất bao lâu?
I have a reservation.|Tôi đã đặt trước.
What time is check-in?|Mấy giờ được nhận phòng?
Could I leave my luggage here?|Tôi để hành lý ở đây được không?
Is breakfast included?|Có bao gồm bữa sáng không?
Could you show me on the map?|Bạn chỉ trên bản đồ giúp tôi được không?
Is it within walking distance?|Có thể đi bộ đến đó không?
Could you take a photo of us?|Bạn chụp giúp chúng tôi một tấm ảnh được không?
I'm looking for this address.|Tôi đang tìm địa chỉ này.
Where can I buy a ticket?|Tôi mua vé ở đâu?
Does this bus go downtown?|Xe buýt này có đến trung tâm không?
I'd like to stay an extra night.|Tôi muốn ở thêm một đêm.
What time should we be back?|Mấy giờ chúng ta nên quay lại?
check in|làm thủ tục nhận phòng, lên máy bay|We need to check in before three.
check out|làm thủ tục trả phòng|We check out tomorrow morning.
set off|khởi hành|Let's set off early.
get around|di chuyển quanh một nơi|It's easy to get around by bus.
Let's hit the road.|Lên đường thôi.|Cách nói thân mật khi bắt đầu chuyến đi.
I'm traveling light.|Tôi mang ít hành lý.|Nói về việc chỉ mang những thứ cần thiết.
Better late than never.|Muộn còn hơn không.|Dùng khi điều gì đó cuối cùng cũng xảy ra.
It's off the beaten track.|Nơi này ít người biết đến.|Miêu tả một địa điểm ít khách du lịch.`,
  },
  {
    id: "friends",
    name: "Bạn bè & gặp gỡ",
    en: "Friends & connections",
    icon: "Users",
    color: "pink",
    description: "Bắt chuyện dễ dàng và kết nối với những người mới.",
    rows: `It's nice to meet you.|Rất vui được gặp bạn.
How do you know each other?|Hai bạn quen nhau như thế nào?
Do you have any plans this weekend?|Cuối tuần này bạn có kế hoạch gì chưa?
Would you like to join us?|Bạn muốn tham gia cùng chúng tôi không?
We should do this more often.|Chúng ta nên gặp như thế này thường xuyên hơn.
What do you do for fun?|Bạn thường làm gì để giải trí?
I've heard a lot about you.|Tôi đã nghe nhiều về bạn.
Let's stay in touch.|Mình giữ liên lạc nhé.
Sorry I couldn't make it.|Xin lỗi vì tôi đã không đến được.
Thanks for inviting me.|Cảm ơn bạn đã mời tôi.
Are you free on Saturday?|Thứ Bảy bạn có rảnh không?
What time works for you?|Mấy giờ thì tiện cho bạn?
I'll meet you there.|Tôi sẽ gặp bạn ở đó.
How was your weekend?|Cuối tuần của bạn thế nào?
That's so kind of you.|Bạn thật tốt bụng.
I had a great time.|Tôi đã có khoảng thời gian rất vui.
hang out|đi chơi, dành thời gian cùng nhau|Let's hang out this weekend.
catch up|trò chuyện để cập nhật tình hình|We should catch up over coffee.
come over|ghé nhà|Would you like to come over tonight?
get along|hòa thuận, hợp nhau|We get along really well.
Long time no see!|Lâu rồi không gặp!|Chào một người lâu ngày mới gặp lại.
Count me in!|Cho tôi tham gia với!|Đồng ý tham gia một hoạt động.
I'm all ears.|Tôi đang lắng nghe đây.|Thể hiện bạn rất muốn nghe câu chuyện.
Rain check?|Để dịp khác nhé?|Cách thân mật để xin hẹn lại.`,
  },
  {
    id: "shopping",
    name: "Mua sắm & chi tiêu",
    en: "Shopping & money",
    icon: "ShoppingBag",
    color: "mint",
    description: "Hỏi giá, chọn đồ và mua sắm một cách tự tin.",
    rows: `I'm just looking, thanks.|Tôi chỉ xem thôi, cảm ơn.
How much does this cost?|Cái này giá bao nhiêu?
Do you have this in a smaller size?|Bạn có cái này cỡ nhỏ hơn không?
Can I try this on?|Tôi thử cái này được không?
Where are the fitting rooms?|Phòng thử đồ ở đâu?
Does this come in other colors?|Mẫu này có màu khác không?
I'll take it.|Tôi lấy cái này.
Can I pay by card?|Tôi trả bằng thẻ được không?
Could I have a receipt?|Cho tôi xin hóa đơn được không?
Is this on sale?|Cái này đang giảm giá phải không?
What's your return policy?|Chính sách đổi trả ở đây thế nào?
I'd like to return this.|Tôi muốn trả lại món này.
It doesn't fit me.|Nó không vừa với tôi.
Do you have anything cheaper?|Bạn có món nào rẻ hơn không?
I'm looking for a gift.|Tôi đang tìm một món quà.
Could you wrap it, please?|Bạn gói giúp tôi được không?
try on|mặc thử|Can I try on this jacket?
pay back|trả lại tiền đã vay|I'll pay you back tomorrow.
save up|tiết kiệm dần|I'm saving up for a new laptop.
sell out|bán hết|These shoes usually sell out fast.
It's a good deal.|Món này giá hời đấy.|Nói khi giá mua hợp lý.
It's out of my budget.|Nó vượt ngân sách của tôi.|Dùng để giải thích giới hạn chi tiêu.
I'll sleep on it.|Để tôi suy nghĩ thêm một đêm.|Chưa quyết định mua ngay.
It's worth every penny.|Nó đáng từng đồng.|Thể hiện sự hài lòng với giá trị món đồ.`,
  },
  {
    id: "feelings",
    name: "Cảm xúc & quan điểm",
    en: "Feelings & opinions",
    icon: "Heart",
    color: "rose",
    description: "Nói điều bạn nghĩ, chia sẻ điều bạn cảm thấy.",
    rows: `I'm really excited about it.|Tôi thực sự hào hứng về điều đó.
I'm a bit nervous.|Tôi hơi lo lắng.
That means a lot to me.|Điều đó rất có ý nghĩa với tôi.
I see what you mean.|Tôi hiểu ý bạn.
I'm not sure about that.|Tôi không chắc về điều đó.
I couldn't agree more.|Tôi hoàn toàn đồng ý.
I look at it differently.|Tôi nhìn nhận điều đó theo cách khác.
How do you feel about it?|Bạn cảm thấy thế nào về việc đó?
I need some time to think.|Tôi cần chút thời gian suy nghĩ.
That must be difficult.|Chắc hẳn điều đó khó khăn lắm.
I'm happy for you.|Tôi mừng cho bạn.
It's okay to feel that way.|Cảm thấy như vậy cũng không sao.
I'd rather stay home tonight.|Tối nay tôi muốn ở nhà hơn.
I really appreciate your help.|Tôi thực sự trân trọng sự giúp đỡ của bạn.
I'm proud of you.|Tôi tự hào về bạn.
Things will get better.|Mọi chuyện sẽ tốt hơn.
cheer up|vui lên|I hope this cheers you up.
calm down|bình tĩnh lại|Take a moment to calm down.
open up|cởi mở chia sẻ|She finds it hard to open up.
get over|vượt qua, hồi phục sau|It took time to get over the disappointment.
I'm over the moon.|Tôi vui sướng vô cùng.|Diễn tả niềm vui rất lớn.
I'm on the fence.|Tôi còn phân vân.|Chưa chọn giữa những khả năng khác nhau.
That's a relief.|Thật nhẹ cả người.|Dùng khi nỗi lo được giải tỏa.
Hang in there.|Cố gắng lên nhé.|Động viên ai đó trong lúc khó khăn.`,
  },
  {
    id: "learning",
    name: "Học tập & phát triển",
    en: "Learning & growing",
    icon: "GraduationCap",
    color: "yellow",
    description: "Học cách hỏi, thử điều mới và tiến bộ mỗi ngày.",
    rows: `What does this word mean?|Từ này có nghĩa là gì?
How do you pronounce this?|Từ này phát âm như thế nào?
Could you give me an example?|Bạn cho tôi một ví dụ được không?
I'm still learning.|Tôi vẫn đang học.
Could you speak a little more slowly?|Bạn nói chậm hơn một chút được không?
Let me try again.|Để tôi thử lại.
I made a mistake.|Tôi đã mắc lỗi.
That makes sense now.|Giờ tôi hiểu rồi.
How do you spell that?|Từ đó đánh vần thế nào?
What's the difference between these two?|Hai cái này khác nhau thế nào?
I need more practice.|Tôi cần luyện tập thêm.
Can you check my answer?|Bạn kiểm tra câu trả lời giúp tôi được không?
I'm getting better at it.|Tôi đang làm việc đó tốt hơn.
Let's practice together.|Chúng ta cùng luyện tập nhé.
I've learned something new today.|Hôm nay tôi đã học được điều mới.
One step at a time.|Cứ từng bước một.
look up|tra cứu|Look up the word in a dictionary.
pick up|học được một cách tự nhiên|I picked up some Spanish while traveling.
keep up with|theo kịp|It's hard to keep up with the class.
go over|xem lại, ôn lại|Let's go over these notes.
Practice makes perfect.|Có công luyện tập, có ngày thành thạo.|Khuyến khích luyện tập thường xuyên.
I'm getting the hang of it.|Tôi đang dần quen cách làm rồi.|Dùng khi kỹ năng bắt đầu tiến bộ.
It's a piece of cake.|Việc đó dễ như ăn bánh.|Cách nói thân mật về một việc dễ.
Little by little.|Từng chút một.|Miêu tả sự tiến bộ từ những bước nhỏ.`,
  },
];
export const topics = [...baseTopics, ...extraTopics];
const makePhrase = (t, row, i, type) => {
  const [en, vi, note] = row.split("|").map((v) => v.trim());
  return { id: `${t.id}-${i}`, topic: t.id, en, vi, note, type };
};
export const phrases = topics.flatMap((t) => {
  if (additions[t.id])
    return [
      ...t.rows
        .split("\n")
        .map((r, i) =>
          makePhrase(
            t,
            r,
            i,
            i < 16 ? "sentence" : i < 20 ? "phrasal" : "expression",
          ),
        ),
      ...additions[t.id]
        .split("\n")
        .map((r, i) =>
          makePhrase(
            t,
            r,
            i + 24,
            i < 8 ? "sentence" : i < 12 ? "phrasal" : "expression",
          ),
        ),
    ];
  return t.rows
    .split("\n")
    .map((r, i) =>
      makePhrase(
        t,
        r,
        i,
        i < 24 ? "sentence" : i < 32 ? "phrasal" : "expression",
      ),
    );
});
export const phraseById = Object.fromEntries(phrases.map((p) => [p.id, p]));
