// Original editorial content. Preview corpus v1; separate from the production catalog.
// Rows: kind | English | Vietnamese meaning in this scene | example | usage note.
const drafts = [
  {
    id: "cafe",
    title: "Một ly cà phê, đúng ý bạn",
    en: "Your usual, with a twist.",
    place: "At the café",
    level: "A2",
    color: "#dc714d",
    scene: "cafe",
    goal: "Gọi đồ uống, đổi một thành phần và xin mang đi.",
    story:
      "It is raining, and the café near your office is almost full. You find a seat by the window and look at the menu. You usually order a latte, but today you want oat milk. Before you pay, your colleague calls: the meeting starts in ten minutes. You ask for your drink to go and pick it up at the counter. A small change of plan, handled in English.",
    translation:
      "Trời mưa, quán gần văn phòng gần kín chỗ. Bạn tìm được ghế cạnh cửa sổ và xem thực đơn. Hôm nay bạn muốn đổi sang sữa yến mạch. Đồng nghiệp gọi báo cuộc họp sắp bắt đầu, nên bạn xin mang đi và lấy đồ uống ở quầy.",
    dialogue: [
      ["You", "Could I have a small latte, please?"],
      ["Barista", "Of course. What kind of milk?"],
      ["You", "Could you use oat milk instead?"],
      ["Barista", "Sure. Are you staying here?"],
      ["You", "Actually, could I get that to go?"],
      ["Barista", "No problem. You can pick it up at the counter."],
    ],
    rows: `word|counter|quầy phục vụ|Your drink is on the counter.|At the counter = ở quầy; không phải chiếc bàn khách ngồi.
word|oat milk|sữa yến mạch|Could you use oat milk instead?|Milk thường không đếm được; gọi a glass of milk nếu cần một đơn vị.
phrasal|pick it up|lấy món đã chuẩn bị|You can pick it up at the counter.|pick something up: đại từ ở giữa. Đúng: pick it up; sai: pick up it. Nghĩa ở đây là lấy đồ, không phải đón người.
phrasal|sit down|ngồi xuống|Let's sit down by the window.|Không cần tân ngữ. Sit down diễn tả hành động; be seated diễn tả trạng thái ngồi.
pattern|Could I have|gọi món một cách lịch sự|Could I have a small latte, please?|Could I have + món, please? Dùng khi gọi món, không phải câu hỏi khả năng.
pattern|to go|mang đi|Could I get that to go?|Phổ biến trong tiếng Anh Mỹ; tiếng Anh Anh thường dùng takeaway.`,
  },
  {
    id: "commute",
    title: "Lỡ chuyến xe, vẫn kịp hẹn",
    en: "A little late. Still on the way.",
    place: "On the move",
    level: "A2",
    color: "#719598",
    scene: "bus",
    goal: "Báo đến muộn và hỏi điểm xuống xe.",
    story:
      "You leave home early, but the bus is already pulling away. The next one arrives in fifteen minutes. You send your friend a message instead of leaving them waiting without news. When you finally get on, you check the route with the driver. There are two stops with similar names. You ask which one is closer to the museum, get off at the right stop, and walk the last few minutes.",
    translation:
      "Bạn ra khỏi nhà sớm nhưng vẫn lỡ xe. Chuyến tiếp theo đến sau mười lăm phút. Bạn nhắn cho người bạn đang chờ rồi hỏi tài xế để không nhầm hai điểm dừng có tên gần giống nhau. Bạn xuống đúng điểm và đi bộ tới bảo tàng.",
    dialogue: [
      ["You", "I'm running a little late."],
      ["Friend", "No problem. Where are you?"],
      ["You", "I'm waiting for the next bus."],
      ["Driver", "Where do you need to go?"],
      ["You", "Which stop should I get off at for the museum?"],
      ["Driver", "The next stop. It is a short walk from there."],
    ],
    rows: `word|bus stop|điểm dừng xe buýt|I'll meet you at the bus stop.|Bus stop thường là điểm đón ven đường; bus station thường là bến có nhiều tuyến.
word|route|tuyến đường|Is this the right route for the museum?|A bus route = tuyến xe buýt. Dùng right route khi hỏi mình có đi đúng tuyến không.
phrasal|get on|lên xe buýt|You can get on the bus here.|get on a bus/train; với ô tô hoặc taxi thường dùng get in.
phrasal|get off|xuống xe buýt|We need to get off at the next stop.|get off the bus; không dùng get off from the bus trong mẫu này.
pattern|I'm running a little late|tôi đang bị chậm giờ một chút|I'm running a little late.|Run late là cụm kết hợp từ, không phải phrasal verb. Nên báo thêm giờ đến dự kiến.
pattern|Which stop should I|hỏi nên xuống ở điểm nào|Which stop should I get off at?|Which + danh từ + should I + động từ? Có thể kết thúc câu hỏi tự nhiên bằng at.`,
  },
  {
    id: "work",
    title: "Hỏi lại để làm cho đúng",
    en: "Clarity before the deadline.",
    place: "At work",
    level: "B1",
    color: "#bda2c8",
    scene: "work",
    goal: "Làm rõ yêu cầu và thương lượng thời hạn với đồng nghiệp.",
    story:
      "A colleague sends you a task just before lunch. The message says the report is urgent, but it does not mention a deadline. You could guess and rush, or ask a clear question. You decide to go over the brief together. One figure needs checking, so you offer to send a draft today and follow up tomorrow. Now both of you know what to expect, and you can work without guessing.",
    translation:
      "Đồng nghiệp gửi việc gấp nhưng không ghi hạn chót. Bạn hỏi rõ và cùng xem lại yêu cầu. Vì có số liệu cần kiểm tra, bạn đề nghị gửi bản nháp hôm nay rồi trao đổi tiếp vào ngày mai. Hai bên thống nhất điều cần làm.",
    dialogue: [
      ["You", "Could you clarify what you need in this section?"],
      ["Colleague", "Just the sales figures for this month."],
      ["You", "When do you need the final version?"],
      ["Colleague", "Tomorrow afternoon would be fine."],
      ["You", "I'll send a draft today and follow up tomorrow."],
      ["Colleague", "That works for me. Thanks for checking."],
    ],
    rows: `word|deadline|hạn chót hoàn thành|When is the deadline for the report?|Meet a deadline = kịp hạn; miss a deadline = trễ hạn.
word|draft|bản nháp|I'll send you a draft today.|A draft chưa phải final version. Đừng dùng draft như lời hứa đã hoàn thiện.
phrasal|go over|xem lại kỹ cùng nhau|Let's go over the brief together.|go over + tài liệu/chi tiết; nghĩa xem xét, không phải di chuyển qua.
phrasal|follow up|liên hệ tiếp sau trao đổi trước|I'll follow up with you tomorrow.|follow up with + người; follow up on + việc. Danh từ follow-up có dấu nối.
pattern|Could you clarify|nhờ làm rõ thông tin|Could you clarify what you need?|Could you clarify + nội dung? Lịch sự hơn nói rằng người kia giải thích khó hiểu.
pattern|That works for me|xác nhận phương án phù hợp|That works for me.|Dùng để đồng ý một giờ hẹn hoặc kế hoạch; không có nghĩa tôi làm việc đó.`,
  },
  {
    id: "home",
    title: "Chia việc nhà, giữ hòa khí",
    en: "A home we share.",
    place: "At home",
    level: "A2",
    color: "#bdba75",
    scene: "home",
    goal: "Nhờ bạn cùng nhà giúp một việc cụ thể.",
    story:
      "Your friends are coming over for dinner, and the kitchen is still a mess. You have enough time to cook, but not to do everything alone. Your flatmate offers to help. You ask them to put away the clean dishes while you wipe the table. The rubbish bin is full too. Instead of saying that nobody ever helps, you ask for one small favour. Soon the room is ready for your guests.",
    translation:
      "Bạn sắp có khách tới ăn tối nhưng bếp còn bừa. Bạn cùng nhà cất bát đĩa trong lúc bạn lau bàn. Bạn nhờ mang rác đi bằng một lời nhờ cụ thể, thay vì trách móc chung chung.",
    dialogue: [
      ["Flatmate", "Do you need a hand?"],
      ["You", "Yes, please. Could you put these dishes away?"],
      ["Flatmate", "Sure. Where do they go?"],
      ["You", "In the cupboard above the sink."],
      ["You", "Would you mind taking out the rubbish too?"],
      ["Flatmate", "Not at all. You carry on with dinner."],
    ],
    rows: `word|cupboard|tủ đựng bát đĩa hoặc đồ dùng|The plates are in the cupboard.|Trong bếp, cupboard/cabinet thường là tủ; wardrobe là tủ quần áo.
word|a hand|sự giúp đỡ, trong cụm này|Do you need a hand?|Give someone a hand = giúp ai đó. Không dịch từng chữ thành cho một bàn tay.
phrasal|put away|cất về đúng chỗ|Could you put away the clean dishes?|Có thể nói put the dishes away. Với đại từ: put them away.
phrasal|take out|mang rác ra ngoài|Could you take out the rubbish?|Take it out, không phải take out it. Rubbish phổ biến ở Anh, trash ở Mỹ.
pattern|Would you mind|nhờ ai làm việc gì lịch sự|Would you mind opening the window?|Would you mind + V-ing. Not at all nghĩa là sẵn lòng, không phải từ chối.
pattern|Do you need|hỏi người khác có cần giúp không|Do you need a hand?|Do you need + danh từ? Dùng để chủ động đề nghị giúp.`,
  },
  {
    id: "shopping",
    title: "Chiếc áo không vừa",
    en: "The right fit matters.",
    place: "In a shop",
    level: "A2",
    color: "#d39a77",
    scene: "shop",
    goal: "Hỏi kích cỡ, thử đồ và trao đổi về việc trả hàng.",
    story:
      "You bought a shirt yesterday without trying it on. At home, you notice that the sleeves are too tight. Today you bring it back with the receipt. You explain the problem calmly and ask for a larger size. The assistant checks the stock, but your favourite colour is sold out. Before choosing another shirt, you ask about a refund. You want to understand your options before deciding what to do.",
    translation:
      "Áo mua hôm qua bị chật tay. Bạn mang áo và hóa đơn tới cửa hàng, hỏi đổi cỡ lớn hơn. Màu bạn thích đã hết, nên bạn hỏi về hoàn tiền trước khi quyết định.",
    dialogue: [
      ["You", "Do you have this in a larger size?"],
      ["Assistant", "Let me check. Which colour?"],
      ["You", "Blue, please. Can I try it on?"],
      ["Assistant", "We have sold out of blue in that size."],
      ["You", "Could I get a refund instead?"],
      ["Assistant", "Let me check the receipt and our return policy."],
    ],
    rows: `word|receipt|hóa đơn, biên nhận mua hàng|I still have the receipt.|Keep the receipt = giữ hóa đơn; chữ p trong receipt không phát âm.
word|refund|tiền hoàn lại|Could I get a refund?|Get a refund = được hoàn tiền; exchange = đổi hàng. Quy định tùy cửa hàng.
phrasal|try it on|mặc thử chiếc áo|Can I try it on?|Try on dùng với quần áo; với đại từ phải nói try it on.
phrasal|sold out|đã bán hết|The blue shirts are sold out.|Be sold out = hết hàng; have sold out of + mặt hàng = đã bán hết mặt hàng đó.
pattern|Do you have this in|hỏi biến thể cỡ hoặc màu|Do you have this in a larger size?|In + màu/cỡ. Có thể thay bằng in black hoặc in a smaller size.
pattern|Could I get a refund|xin hoàn tiền|Could I get a refund, please?|Đây là lời hỏi; không hàm ý cửa hàng chắc chắn chấp nhận hoàn tiền.`,
  },
  {
    id: "friends",
    title: "Đổi lịch mà không mất vui",
    en: "Same friends. A new plan.",
    place: "With friends",
    level: "B1",
    color: "#8097b4",
    scene: "friends",
    goal: "Đề nghị đổi lịch và thống nhất một kế hoạch khác.",
    story:
      "You have planned a picnic for Saturday, but the forecast now says heavy rain. Nobody wants to cancel the whole weekend. You message the group and suggest meeting at a small bookshop café instead. One friend is busy in the morning, so you settle on three in the afternoon. You can still catch up and spend time together. The picnic can wait until next week, when the weather might be better.",
    translation:
      "Dự báo mưa lớn khiến nhóm phải đổi kế hoạch picnic. Bạn đề nghị gặp ở quán cà phê sách. Cả nhóm thống nhất ba giờ chiều để ai cũng tham gia được; buổi picnic dời sang tuần sau.",
    dialogue: [
      ["You", "The forecast looks terrible for Saturday."],
      ["Friend", "Shall we call off the picnic?"],
      ["You", "How about meeting at the bookshop café instead?"],
      ["Friend", "Sounds good. I am free after two."],
      ["You", "Does three work for you?"],
      ["Friend", "Perfect. It will be nice to catch up."],
    ],
    rows: `word|forecast|dự báo thời tiết|The forecast says heavy rain.|The weather forecast. Dùng heavy rain, không dùng strong rain.
word|instead|thay vào đó|Let's meet indoors instead.|Instead thường đứng cuối câu; instead of + danh từ/V-ing.
phrasal|call off|hủy một kế hoạch|We may need to call off the picnic.|Call it off = hủy; put it off = hoãn. Hai việc khác nhau.
phrasal|catch up|trò chuyện cập nhật chuyện gần đây|Let's catch up over coffee.|Catch up with + người. Trong cảnh này là trò chuyện, không phải đuổi kịp xe.
pattern|How about|đề xuất một phương án|How about meeting at the café?|How about + V-ing/danh từ; không dùng How about meet.
pattern|Does three work for you|hỏi giờ hẹn có phù hợp không|Does three work for you?|Thay three bằng Monday hoặc another time. Work ở đây nghĩa là phù hợp.`,
  },
];
export const fieldNotes = drafts.map(({ rows, ...lesson }) => ({
  ...lesson,
  items: rows.split("\n").map((row, index) => {
    const [kind, en, vi, example, note] = row.split("|");
    return { id: `${lesson.id}-${index + 1}`, kind, en, vi, example, note };
  }),
}));
