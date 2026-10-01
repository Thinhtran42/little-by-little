import { readingPilotTwo } from './reading-pilot-two.js';
import { readingB2 } from './reading-b2.js';
// Stable IDs are reserved for a later progress integration. This collection is self-practice.
const original = {
  kind: "original",
  title: "Little by Little — nội dung biên soạn mới",
  author: "Little by Little",
  checkedAt: "2026-09-11",
};
const coffee = {
  kind: "adapted",
  title: "Coffee or Tea?",
  author: "Anna Matteo / VOA Learning English",
  url: "https://learningenglish.voanews.com/a/coffee-or-tea-/4551468.html",
  licenseUrl: "https://learningenglish.voanews.com/p/6861.html",
  checkedAt: "2026-09-11",
  note: "Tham khảo phần giải thích cách nói; viết lại tình huống và bài tập. Không sử dụng lời bài hát, audio hoặc ảnh bên thứ ba.",
};
const variants = {
  kind: "adapted",
  title: "American English vs. British English",
  author: "Anna Matteo / VOA Learning English",
  url: "https://learningenglish.voanews.com/a/words-and-their-stories-american-versus-british-english/3397694.html",
  licenseUrl: "https://learningenglish.voanews.com/p/6861.html",
  checkedAt: "2026-09-11",
  note: "Chọn các cặp từ Anh–Mỹ rồi viết đoạn đọc, dịch và hội thoại mới. Không lấy media trong bài nguồn.",
};
// Vocabulary tuple: surface form, Vietnamese sense, use note, original example.
export const readingLessons = [
  ...readingB2,
  ...readingPilotTwo,
  {
    id: "reading-coffee-preferences-v1",
    topic: "Ăn uống",
    title: "Một lời mời ở quán cà phê",
    level: "A2–B1",
    photo: "cafe",
    goal: "Nói về sở thích và đề xuất một hoạt động khác mà vẫn lịch sự.",
    context:
      "Hai người bạn chọn nơi gặp nhau sau giờ làm. Một người thích chỗ yên tĩnh hơn sự kiện đông người.",
    source: coffee,
    terms: [
      [
        "not my cup of tea",
        "không hợp sở thích của tôi",
        "Cách nói thân mật; thường dùng ở dạng phủ định. Không chỉ nói về trà.",
        "Horror films are not my cup of tea.",
      ],
      [
        "prefer",
        "thích hơn",
        "Prefer A to B; dùng would prefer khi nói lựa chọn ở tình huống hiện tại.",
        "I prefer quiet places to crowded bars.",
      ],
      [
        "catch up",
        "trò chuyện để biết tin mới của nhau",
        "Catch up with someone; nghĩa trong bài không phải đuổi kịp.",
        "Let’s catch up over lunch.",
      ],
      [
        "instead",
        "thay vào đó",
        "Dùng để đưa lựa chọn thay thế; instead of đi với danh từ hoặc V-ing.",
        "We can meet tomorrow instead.",
      ],
      [
        "sounds good",
        "nghe có vẻ ổn",
        "Cách đồng ý thân mật với một đề xuất.",
        "A table by the window sounds good.",
      ],
    ],
    readings: [
      {
        title: "Sau giờ làm",
        text: "On Friday, Alex invites Mai to a crowded music bar. Mai likes spending time with him, but she explains with a smile, ‘Loud music is **not my cup of tea**.’ She says, ‘I **prefer** somewhere quiet where we can **catch up**.’ Alex suggests a small café near the station **instead**. Mai thinks that **sounds good**. They find a table by the window and order drinks. Saying no to one activity does not have to mean saying no to the person who invited you.",
        vi: "Thứ Sáu, Alex mời Mai đến quán bar nhạc đông đúc. Mai muốn dành thời gian với bạn nhưng giải thích rằng nhạc lớn không hợp sở thích của mình. Cô thích nơi yên tĩnh để trò chuyện, hỏi thăm nhau. Alex đề xuất quán cà phê nhỏ gần ga thay thế. Mai đồng ý. Họ ngồi cạnh cửa sổ và gọi đồ uống. Từ chối một hoạt động không có nghĩa là từ chối người đã mời.",
      },
      {
        title: "Cùng ý đó, một cuối tuần khác",
        text: "My friends want to go camping this weekend. Sleeping outdoors is **not my cup of tea**, although I enjoy walking in the countryside. I **prefer** to sleep in a bed. I suggest joining them for a short walk **instead** of staying overnight. They say that **sounds good**. We can **catch up** on the trail, and I can take the evening train home. We do not need to enjoy exactly the same things to make a plan together.",
        vi: "Bạn tôi muốn cắm trại cuối tuần. Tôi không thích ngủ ngoài trời dù thích đi bộ ở vùng quê. Tôi muốn ngủ trên giường nên đề xuất chỉ đi bộ cùng họ thay vì ở qua đêm. Họ đồng ý. Chúng tôi có thể trò chuyện trên đường, còn tôi bắt tàu tối về. Không nhất thiết có sở thích giống hệt nhau mới lên kế hoạch chung được.",
      },
    ],
    dialogue: [
      ["Alex", "Would you like to come to the music bar tonight?"],
      ["Mai", "Thanks for asking. Loud places aren’t really my cup of tea."],
      ["Alex", "What would you prefer?"],
      ["Mai", "Could we get a coffee instead? I’d love to catch up."],
      ["Alex", "That sounds good. How about the café near the station?"],
      ["Mai", "Perfect. I can meet you there at six."],
    ],
    question: {
      prompt: "Mai muốn điều gì khi đề xuất quán cà phê?",
      options: [
        "Hủy việc gặp Alex hoàn toàn",
        "Vẫn gặp bạn nhưng ở nơi phù hợp hơn",
        "Đổi sang một sự kiện âm nhạc khác",
      ],
      answer: 1,
      explanation:
        "Mai vẫn muốn catch up với Alex. Cô từ chối địa điểm ồn ào và đưa ra lựa chọn khác.",
    },
    recall: {
      prompt:
        "Hoàn thành câu với cụm diễn tả “không hợp sở thích”: Loud music is ____.",
      answer: "not my cup of tea",
      explanation:
        "Not my cup of tea nói về sở thích, không phải về đồ uống trong câu này.",
    },
  },
  {
    id: "reading-exchange-size-v1",
    topic: "Mua sắm",
    title: "Đổi chiếc áo không vừa",
    level: "A2",
    photo: "shop",
    goal: "Yêu cầu đổi size, giữ hóa đơn và hỏi nơi thử đồ.",
    context: "Bạn quay lại cửa hàng ngày hôm sau vì chiếc áo vừa mua bị chật.",
    source: original,
    terms: [
      [
        "receipt",
        "hóa đơn/biên nhận mua hàng",
        "Keep the receipt: giữ hóa đơn; không nhầm với recipe = công thức nấu ăn.",
        "Do I need the receipt to return this?",
      ],
      [
        "try it on",
        "thử mặc nó",
        "Try something on; đại từ đứng giữa: try it on, không phải try on it.",
        "Can I try it on before I pay?",
      ],
      [
        "take it back",
        "mang trả lại món hàng",
        "Take something back to the shop; ở đây không phải rút lại lời nói.",
        "The zip is broken, so I’ll take it back.",
      ],
      [
        "exchange",
        "đổi hàng",
        "Exchange A for B; khác refund = hoàn tiền.",
        "Could I exchange this for a larger size?",
      ],
      [
        "fitting room",
        "phòng thử đồ",
        "Cũng gặp changing room; fit nói về vừa kích cỡ.",
        "Is the fitting room available?",
      ],
    ],
    readings: [
      {
        title: "Chiếc áo cho ngày đầu đi làm",
        text: "Yesterday, Linh bought a jacket for her new job. She was in a hurry and did not **try it on**. At home, she noticed that the sleeves were too short. Fortunately, she still had the **receipt**. She decided to **take it back** the next morning. At the shop, she asked for an **exchange**, not a refund. The assistant found a medium jacket and showed her to the **fitting room**. This time, Linh checked the sleeves before leaving.",
        vi: "Hôm qua Linh mua áo khoác cho công việc mới. Vì vội, cô chưa thử áo. Về nhà cô thấy tay áo quá ngắn. May là cô vẫn giữ hóa đơn. Sáng hôm sau cô mang áo lại cửa hàng, yêu cầu đổi hàng thay vì hoàn tiền. Nhân viên tìm áo size M và chỉ phòng thử đồ. Lần này Linh kiểm tra tay áo trước khi ra về.",
      },
      {
        title: "Đổi sang màu khác",
        text: "Nam receives a shirt as a gift. The size is right, but he would like a different colour. His sister gives him the **receipt** and suggests that he **take it back** to ask about an **exchange**. The assistant explains that the labels must still be attached. Nam chooses a blue shirt and asks to **try it on**. He leaves his bag outside the **fitting room** with his sister. A few minutes later, he comes out smiling.",
        vi: "Nam được tặng một chiếc áo đúng size nhưng muốn màu khác. Chị đưa hóa đơn và đề nghị mang lại cửa hàng hỏi đổi. Nhân viên giải thích áo cần còn nhãn. Nam chọn áo xanh và xin thử. Anh để túi bên ngoài phòng thử cho chị giữ. Vài phút sau anh bước ra hài lòng.",
      },
    ],
    dialogue: [
      ["Customer", "Hi. I bought this yesterday, but it’s too small."],
      ["Assistant", "Do you have the receipt?"],
      ["Customer", "Yes. Could I exchange it for a medium?"],
      ["Assistant", "Let me check. Yes, we have one left."],
      ["Customer", "Can I try it on first?"],
      ["Assistant", "Of course. The fitting room is on your left."],
    ],
    question: {
      prompt: "Tại sao Linh quay lại cửa hàng?",
      options: [
        "Cô muốn đổi áo sang size phù hợp",
        "Cô làm mất hóa đơn",
        "Cô muốn nhận lại tiền và không lấy áo",
      ],
      answer: 0,
      explanation:
        "Tay áo quá ngắn. Linh yêu cầu exchange và lấy áo size M, không yêu cầu refund.",
    },
    recall: {
      prompt: "Điền hai từ còn thiếu: Could I ____ this ____ a medium?",
      answer: "exchange for",
      explanation:
        "Cấu trúc là exchange something for something. Bài này yêu cầu hai từ: exchange for.",
    },
  },
  {
    id: "reading-station-signs-v1",
    topic: "Di chuyển",
    title: "Một biển chỉ dẫn, hai cách gọi",
    level: "A2–B1",
    photo: "bus",
    goal: "Nhận ra vài cặp từ Anh–Mỹ và hỏi đường trong nhà ga.",
    context: "Bạn đi tàu với hành lý và cần tìm thang máy thay vì cầu thang.",
    source: variants,
    terms: [
      [
        "lift",
        "thang máy — thường gặp trong Anh Anh",
        "Trong Anh Mỹ thường nói elevator; ở đây lift là danh từ.",
        "Is there a lift to the platform?",
      ],
      [
        "elevator",
        "thang máy — thường gặp trong Anh Mỹ",
        "Cùng đồ vật với lift trong nghĩa của bài.",
        "Take the elevator to the second floor.",
      ],
      [
        "platform",
        "sân ga nơi lên/xuống tàu",
        "Không phải toàn bộ nhà ga; check the platform number.",
        "Our train leaves from platform four.",
      ],
      [
        "get off",
        "xuống tàu/xe buýt",
        "Get off a train/bus; với car thường dùng get out of.",
        "We need to get off at the next station.",
      ],
      [
        "look for",
        "tìm kiếm",
        "Look for something: đang tìm; find: tìm thấy.",
        "I’m looking for the ticket office.",
      ],
    ],
    readings: [
      {
        title: "Tìm đúng đường lên sân ga",
        text: "Sam has just arrived at a station with a heavy suitcase. He starts to **look for** an **elevator**, but the nearest sign says **lift**. A member of staff explains that both words can name the same thing. Sam follows the arrow and reaches the correct **platform** without carrying his bag up the stairs. Before boarding, he checks where to **get off**. Learning another regional word is useful, but checking the destination matters just as much as understanding the sign.",
        vi: "Sam đến ga với vali nặng và tìm thang máy. Biển gần nhất ghi lift, trong khi anh quen từ elevator. Nhân viên giải thích hai từ có thể chỉ cùng một thứ. Sam theo mũi tên, lên đúng sân ga mà không phải vác vali trên cầu thang. Trước khi lên tàu, anh kiểm tra ga cần xuống. Hiểu từ vùng miền hữu ích, nhưng kiểm tra điểm đến cũng quan trọng.",
      },
      {
        title: "Giúp một người mới đến",
        text: "At the next stop, two visitors **get off** the train and begin to **look for** a way out. One asks where the **elevator** is. A station worker points to a sign marked **lift** beside the stairs. The visitors thank her and leave the **platform** with their luggage. Later, at their hotel, they hear the word elevator again. They realise they do not need to correct either speaker: these are two common names for the same thing.",
        vi: "Hai du khách xuống tàu và tìm lối ra. Một người hỏi elevator ở đâu. Nhân viên chỉ biển lift bên cạnh cầu thang. Họ cảm ơn rồi rời sân ga cùng hành lý. Ở khách sạn họ lại nghe elevator. Họ hiểu rằng không cần sửa lời ai: đây là hai cách gọi phổ biến cho cùng một đồ vật.",
      },
    ],
    dialogue: [
      ["Traveller", "Excuse me, is there an elevator here?"],
      ["Staff", "Yes. Follow the sign for the lift."],
      ["Traveller", "Thank you. Does it go to platform three?"],
      ["Staff", "It does. Which station are you travelling to?"],
      ["Traveller", "Riverside. Where should I get off?"],
      ["Staff", "Riverside is the third stop on this train."],
    ],
    question: {
      prompt: "Biển “lift” giúp Sam tìm thứ gì?",
      options: [
        "Một chuyến tàu nhanh",
        "Thang máy để mang vali lên sân ga",
        "Quầy bán vé",
      ],
      answer: 1,
      explanation: "Trong ngữ cảnh này, lift và elevator đều chỉ thang máy.",
    },
    recall: {
      prompt: "Hoàn thành: We need to ____ at the next station. (xuống tàu)",
      answer: "get off",
      explanation:
        "Get off dùng với train/bus; không đổi thành get out of trong mẫu câu này.",
    },
  },
  {
    id: "reading-work-followup-v1",
    topic: "Công việc",
    title: "Cuộc họp cần một bước tiếp theo",
    level: "B1",
    photo: "work",
    goal: "Làm rõ việc cần làm, người phụ trách và thời hạn sau cuộc họp.",
    context: "Nhóm đang chuẩn bị bản demo. Một lỗi nhỏ làm kế hoạch bị chậm.",
    source: original,
    terms: [
      [
        "deadline",
        "hạn chót",
        "Meet a deadline = hoàn thành đúng hạn; miss a deadline = trễ hạn.",
        "The deadline is Friday afternoon.",
      ],
      [
        "look into",
        "tìm hiểu nguyên nhân/vấn đề",
        "Không tách: look into it; khác look for = tìm kiếm.",
        "I’ll look into the login problem.",
      ],
      [
        "go over",
        "xem xét lại các chi tiết",
        "Go over the plan/report; nghĩa trong bài là rà lại.",
        "Let’s go over the notes together.",
      ],
      [
        "follow up",
        "liên hệ/kiểm tra tiếp sau lần trao đổi trước",
        "Follow up with someone; follow up on an issue.",
        "I’ll follow up with the client tomorrow.",
      ],
      [
        "in charge of",
        "phụ trách",
        "Be in charge of something hoặc V-ing.",
        "Who is in charge of the presentation?",
      ],
    ],
    readings: [
      {
        title: "Đừng kết thúc bằng “để tính sau”",
        text: "The team has a problem with its product demo. The **deadline** is Friday, but the login screen still fails on some phones. Before the meeting ends, Nhi asks everyone to **go over** the next steps. Bao will **look into** the error this afternoon. Nhi is **in charge of** updating the client. She will **follow up** with Bao tomorrow morning before sending her message. Everyone leaves knowing what they need to do, rather than simply hoping the problem will disappear.",
        vi: "Nhóm gặp lỗi ở bản demo. Hạn chót là thứ Sáu nhưng màn hình đăng nhập vẫn lỗi trên một số điện thoại. Trước khi kết thúc cuộc họp, Nhi đề nghị rà lại việc tiếp theo. Bảo tìm hiểu lỗi chiều nay. Nhi phụ trách cập nhật cho khách hàng; sáng mai cô sẽ hỏi lại Bảo trước khi gửi tin. Mọi người đều rõ nhiệm vụ thay vì chỉ hy vọng lỗi biến mất.",
      },
      {
        title: "Một dự án học nhóm",
        text: "Our study group has to give a presentation on Monday. We agree to **go over** the slides on Saturday. I am **in charge of** the introduction, but one of my sources is missing. I promise to **look into** it tonight. My partner will **follow up** with me tomorrow so we can finish before the **deadline**. We write the plan in our group chat. Having a small, clear task makes the whole presentation feel less overwhelming.",
        vi: "Nhóm học phải thuyết trình thứ Hai. Chúng tôi hẹn rà slide thứ Bảy. Tôi phụ trách mở đầu nhưng thiếu một nguồn tham khảo nên sẽ kiểm tra tối nay. Bạn cùng nhóm hỏi lại tôi ngày mai để kịp hạn. Kế hoạch được viết vào nhóm chat. Việc chia nhiệm vụ nhỏ, rõ ràng giúp bài thuyết trình bớt quá tải.",
      },
    ],
    dialogue: [
      ["Nhi", "Before we finish, can we go over the next steps?"],
      ["Bao", "I’ll look into the login error this afternoon."],
      ["Nhi", "Thanks. Who is in charge of the client update?"],
      ["Bao", "You are. I’ll send you my findings first."],
      ["Nhi", "Great. I’ll follow up tomorrow morning."],
      ["Bao", "That works. We still have time before the deadline."],
    ],
    question: {
      prompt: "Nhi sẽ làm gì trước khi cập nhật cho khách hàng?",
      options: [
        "Chờ khách hàng báo lỗi lần nữa",
        "Hỏi lại Bảo về kết quả xử lý",
        "Tự đổi hạn chót sang tuần sau",
      ],
      answer: 1,
      explanation:
        "Nhi follow up with Bao sáng hôm sau rồi mới gửi thông tin cho khách hàng.",
    },
    recall: {
      prompt: "Điền cụm “phụ trách”: Who is ____ the client update?",
      answer: "in charge of",
      explanation: "Be in charge of + việc: phụ trách việc đó.",
    },
  },
  {
    id: "reading-home-cooking-v1",
    topic: "Nhà cửa",
    title: "Bữa tối thiếu một nguyên liệu",
    level: "A2",
    photo: "home",
    goal: "Báo thiếu đồ, chọn cách thay thế và chia việc trong bếp.",
    context:
      "Hai người ở chung nhà chuẩn bị bữa tối trước khi một người phải đi làm.",
    source: original,
    terms: [
      [
        "run out of",
        "hết, không còn thứ đang cần",
        "Run out of milk/time; giữ of trước danh từ.",
        "We’ve run out of rice.",
      ],
      [
        "ingredient",
        "nguyên liệu nấu ăn",
        "An ingredient; các nguyên liệu là ingredients.",
        "What ingredients do we need?",
      ],
      [
        "leave out",
        "bỏ một thành phần ra",
        "Leave it out: đại từ đứng giữa.",
        "You can leave out the chilli.",
      ],
      [
        "put away",
        "cất về chỗ",
        "Put the plates away / put them away.",
        "Please put away the clean dishes.",
      ],
      [
        "wash up",
        "rửa bát đĩa — Anh Anh",
        "Trong Anh Mỹ, do the dishes phổ biến; wash up có thể chỉ rửa tay.",
        "I’ll wash up after dinner.",
      ],
    ],
    readings: [
      {
        title: "Nấu với những gì đang có",
        text: "An opens the fridge and sees that they have **run out of** cream. It is an **ingredient** in the soup he planned to make. His flatmate suggests that they **leave out** the cream and use a little more stock. They taste the soup before adding salt. While it cooks, An starts to **put away** the clean dishes. His flatmate offers to **wash up** after dinner. The meal is simple, but they finish in time for An’s evening shift.",
        vi: "An mở tủ lạnh và thấy đã hết kem sữa, một nguyên liệu của món súp định nấu. Bạn cùng nhà đề xuất bỏ kem, thêm một ít nước dùng. Họ nếm trước khi thêm muối. Trong lúc nấu, An cất bát đĩa sạch. Bạn nhận rửa bát sau bữa tối. Bữa ăn đơn giản nhưng xong kịp ca làm tối của An.",
      },
      {
        title: "Cùng chuẩn bị bữa trưa",
        text: "We want to make sandwiches for a picnic, but we have **run out of** tomatoes. They are not the only fresh **ingredient** we have: there is still some cucumber. We decide to **leave out** the tomatoes today. After packing the food, we **put away** the bread and cheese so they do not sit on the counter all afternoon. I **wash up** the knife and the chopping board while my brother fills the water bottles. Then we are ready to leave.",
        vi: "Chúng tôi định làm bánh mì cho buổi picnic nhưng hết cà chua. Vẫn còn dưa chuột nên hôm nay bỏ cà chua. Đóng hộp xong, chúng tôi cất bánh mì và phô mai, không để trên bàn suốt chiều. Tôi rửa dao và thớt, em trai đổ nước vào chai. Sau đó cả hai sẵn sàng đi.",
      },
    ],
    dialogue: [
      ["An", "We’ve run out of cream. Do we need to buy some?"],
      ["Flatmate", "We can leave it out and add more stock."],
      ["An", "Good idea. I’ll put away these dishes first."],
      ["Flatmate", "Thanks. What time do you need to leave?"],
      ["An", "At seven. Could you wash up afterwards?"],
      ["Flatmate", "Sure. You cooked, so I’ll do the dishes."],
    ],
    question: {
      prompt: "Hai người giải quyết việc thiếu kem như thế nào?",
      options: [
        "Mua món ăn sẵn",
        "Bỏ kem và dùng thêm nước dùng",
        "Bỏ luôn bữa tối",
      ],
      answer: 1,
      explanation:
        "Họ điều chỉnh nguyên liệu, nếm lại món ăn rồi tiếp tục nấu.",
    },
    recall: {
      prompt: "Điền cụm “đã hết”: We have ____ milk.",
      answer: "run out of",
      explanation: "Run out of + danh từ. Không bỏ of.",
    },
  },
  {
    id: "reading-reschedule-friends-v1",
    topic: "Bạn bè",
    title: "Đổi lịch mà không mất cuộc hẹn",
    level: "A2–B1",
    photo: "friends",
    goal: "Giải thích việc bận đột xuất và đưa ra thời gian thay thế cụ thể.",
    context:
      "Bạn đã hẹn gặp một người bạn, nhưng công việc chiều nay kéo dài hơn dự kiến.",
    source: original,
    terms: [
      [
        "something came up",
        "có việc đột xuất",
        "Cách giải thích ngắn, không nhất thiết kể chi tiết riêng tư.",
        "Sorry, something came up at work.",
      ],
      [
        "put off",
        "hoãn lại",
        "Put off the meeting / put it off; không phải hủy hẳn.",
        "Could we put off our meeting until Friday?",
      ],
      [
        "available",
        "rảnh, có thể sắp xếp thời gian",
        "Are you available on + ngày / at + giờ?",
        "Are you available at six?",
      ],
      [
        "make it",
        "đến/tham gia được",
        "Can’t make it: không đến được; ở đây không phải tạo ra đồ vật.",
        "I can make it on Saturday.",
      ],
      [
        "work for you",
        "phù hợp với lịch/nhu cầu của bạn",
        "Does Tuesday work for you? Không mang nghĩa làm thuê trong câu này.",
        "Would an earlier time work for you?",
      ],
    ],
    readings: [
      {
        title: "Một tin nhắn đủ rõ",
        text: "Lan is supposed to meet Minh at six, but **something came up** at work. She does not wait until the last minute to send a message. She asks whether they can **put off** their coffee until tomorrow. Minh is not **available** then, but he can **make it** on Saturday morning. ‘Would ten o’clock **work for you**?’ he asks. Lan agrees and saves the new time. They have changed the plan without leaving either person wondering whether the meeting is still happening.",
        vi: "Lan hẹn Minh lúc sáu giờ nhưng có việc đột xuất ở công ty. Cô nhắn trước, không đợi sát giờ, hỏi có thể hoãn cà phê sang mai không. Minh không rảnh ngày mai nhưng đi được sáng thứ Bảy. Anh đề xuất mười giờ và hỏi Lan có tiện không. Lan đồng ý, ghi lại lịch mới. Hai người thay đổi kế hoạch rõ ràng, không để ai phải đoán cuộc hẹn còn diễn ra hay không.",
      },
      {
        title: "Khi chính bạn là người được đề nghị đổi lịch",
        text: "Your friend says that **something came up** and asks to **put off** dinner. You are disappointed, but you still want to see her. You explain that you are **available** on Sunday, not Saturday. She says she can **make it** after seven. You ask, ‘Would half past seven **work for you**?’ Once she agrees, you book a table. Suggesting a specific day and time is often more helpful than simply saying that you should meet another day.",
        vi: "Bạn của bạn có việc đột xuất và muốn hoãn bữa tối. Bạn hơi thất vọng nhưng vẫn muốn gặp. Bạn nói rõ mình rảnh Chủ nhật, không phải thứ Bảy. Cô ấy đi được sau bảy giờ. Bạn đề xuất bảy rưỡi, nhận được đồng ý rồi đặt bàn. Đưa ngày giờ cụ thể thường hữu ích hơn chỉ nói gặp vào hôm khác.",
      },
    ],
    dialogue: [
      ["Lan", "I’m sorry, something came up at work."],
      ["Minh", "No problem. Do you need to put off our coffee?"],
      ["Lan", "Yes. Are you available tomorrow?"],
      ["Minh", "I can’t make it tomorrow. Would Saturday work for you?"],
      ["Lan", "Yes. How about ten in the morning?"],
      ["Minh", "Perfect. See you then."],
    ],
    question: {
      prompt: "Điểm nào giúp hai người tránh hiểu lầm về lịch hẹn?",
      options: [
        "Không trả lời tin nhắn",
        "Chốt ngày giờ mới cụ thể",
        "Chỉ nói “hôm khác nhé”",
      ],
      answer: 1,
      explanation:
        "Họ thống nhất sáng thứ Bảy lúc mười giờ; cuộc hẹn được dời, không bị hủy.",
    },
    recall: {
      prompt: "Hoàn thành câu giải thích có việc đột xuất: Sorry, ____.",
      answer: "something came up",
      explanation: "Something came up nói về việc không lường trước đã xảy ra.",
    },
  },
];
