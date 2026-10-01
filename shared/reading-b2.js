const source = {
  kind: "original",
  title: "Little by Little — tình huống B2 tự biên soạn",
  author: "Little by Little",
  checkedAt: "2026-09-27",
};
export const readingB2 = [
  {
    id: "reading-b2-project-scope-v1",
    topic: "Công việc",
    title: "Một thời hạn, hai phương án",
    level: "B2",
    photo: "work",
    source,
    goal: "Đề xuất đánh đổi giữa phạm vi công việc và thời hạn bằng điều kiện rõ ràng.",
    context:
      "Nhóm sắp ra mắt sản phẩm nhưng khách hàng yêu cầu thêm chức năng.",
    terms: [
      [
        "trade-off",
        "sự đánh đổi",
        "A trade-off between A and B; lợi ích ở một mặt đi kèm chi phí ở mặt khác.",
        "There is a trade-off between speed and flexibility.",
      ],
      [
        "take on",
        "nhận thêm trách nhiệm / công việc",
        "Take on a task; với đại từ: take it on.",
        "We cannot take on another project this week.",
      ],
      [
        "push back",
        "dời sang thời điểm muộn hơn",
        "Push back a deadline; push it back. Trong ngữ cảnh khác có thể là phản đối.",
        "Could we push back the deadline by two days?",
      ],
      [
        "provided that",
        "với điều kiện là",
        "Diễn đạt điều kiện rõ ràng; thường trang trọng hơn if.",
        "We can launch on Friday provided that the tests pass.",
      ],
      [
        "scope",
        "phạm vi công việc",
        "The scope of a project; không đồng nghĩa với lịch thực hiện.",
        "The new request changes the scope of the project.",
      ],
    ],
    readings: [
      {
        title: "Nói rõ cái giá của việc thêm việc",
        text: "Three days before a product demonstration, a client asks Maya’s team to add a reporting screen. Maya wants to be helpful, but she knows that agreeing immediately would hide a **trade-off**. If the team decides to **take on** the extra work, there will be less time to test the existing features. She offers two options: keep the original **scope** and demonstrate on Friday, or **push back** the demonstration and include the new screen. The client chooses Friday, **provided that** the team sends a sketch of the future report beforehand. Maya writes down the agreement. Everyone now understands both what will be delivered and what will have to wait.",
        vi: "Ba ngày trước buổi demo, khách muốn thêm màn hình báo cáo. Maya hiểu rằng đồng ý ngay sẽ che giấu sự đánh đổi: nhận thêm việc thì ít thời gian kiểm thử chức năng hiện có. Cô đưa hai lựa chọn: giữ phạm vi ban đầu và demo thứ Sáu, hoặc lùi demo để làm màn hình mới. Khách chọn thứ Sáu với điều kiện nhận bản phác thảo báo cáo trước. Maya ghi lại thỏa thuận để mọi người biết phần nào được bàn giao và phần nào phải chờ.",
      },
      {
        title: "Áp dụng vào một sự kiện nhỏ",
        text: "A neighbourhood group is planning a weekend workshop. Someone suggests adding a second activity, which would expand the **scope** beyond the volunteers’ original plan. There is a **trade-off** between offering more activities and giving each visitor enough attention. The organiser says they can **take on** the new activity **provided that** two more volunteers are available. Otherwise, they should run it at the next event rather than **push back** the whole workshop. This time, the group keeps the date and limits the programme. They are not rejecting the idea; they are choosing a realistic amount of work for the people who have actually agreed to help.",
        vi: "Nhóm khu phố chuẩn bị workshop cuối tuần. Một người đề xuất thêm hoạt động, mở rộng phạm vi ban đầu. Nhóm phải cân nhắc giữa nhiều hoạt động và việc quan tâm đủ đến từng khách. Người tổ chức đồng ý nhận thêm nếu có hai tình nguyện viên nữa; nếu không, để sự kiện sau thay vì lùi cả workshop. Nhóm giữ ngày và giới hạn chương trình. Họ chọn khối lượng thực tế theo số người đã nhận lời giúp.",
      },
    ],
    dialogue: [
      ["Client", "Could you add a reporting screen before Friday?"],
      ["Maya", "We can, but we would need more time to test it."],
      ["Client", "What would you suggest?"],
      [
        "Maya",
        "We could keep Friday and show a sketch, or move the full demonstration to Tuesday.",
      ],
      [
        "Client",
        "Let’s keep Friday, provided that we receive the sketch tomorrow.",
      ],
      ["Maya", "Agreed. I’ll confirm the scope and dates by email."],
    ],
    question: {
      prompt: "Điểm chính trong cách Maya xử lý yêu cầu là gì?",
      options: [
        "Hứa làm mọi thứ trong cùng thời gian",
        "Giải thích đánh đổi và chốt phạm vi",
        "Từ chối mọi yêu cầu mới",
      ],
      answer: 1,
      explanation: "Cô đưa lựa chọn cụ thể và ghi lại phạm vi đã thống nhất.",
    },
    recall: {
      prompt: "Điền cụm lùi hạn: We may need to ____ the deadline.",
      answer: "push back",
      explanation: "Push back the deadline = dời hạn về sau.",
    },
  },
  {
    id: "reading-b2-hotel-complaint-v1",
    topic: "Du lịch & lưu trú",
    title: "Phản ánh vấn đề mà vẫn hợp tác",
    level: "B2",
    photo: "hotel",
    source,
    goal: "Mô tả điều không đúng với thỏa thuận và yêu cầu giải pháp phù hợp.",
    context:
      "Phòng khách sạn yên tĩnh bạn đặt lại nằm gần khu vực đang sửa chữa.",
    terms: [
      [
        "bring up",
        "đề cập một vấn đề",
        "Bring up an issue; bring it up.",
        "I would like to bring up a problem with my room.",
      ],
      [
        "disruption",
        "sự gián đoạn / phiền nhiễu",
        "Cause disruption; trong bài là tiếng ồn ảnh hưởng sinh hoạt.",
        "The work caused considerable disruption.",
      ],
      [
        "alternative",
        "phương án thay thế",
        "An alternative to something.",
        "Is there an alternative to changing hotels?",
      ],
      [
        "compensate",
        "bù đắp",
        "Compensate someone for something; không phải mọi tình huống đều mặc nhiên được bồi thường.",
        "They offered to compensate us for the inconvenience.",
      ],
      [
        "resolve",
        "giải quyết",
        "Resolve an issue/dispute; trang trọng hơn sort out.",
        "Can we resolve this before tonight?",
      ],
    ],
    readings: [
      {
        title: "Yêu cầu cụ thể tại lễ tân",
        text: "When Elena booked her room, she asked for a quiet place to prepare for an interview. On arrival, she finds that repair work is taking place directly outside her window. She decides to **bring up** the problem at reception rather than argue with the workers. Elena describes the **disruption** and shows the message confirming her request. She asks whether an **alternative** room is available. The receptionist cannot move her immediately, but offers a quieter room later that afternoon. Elena asks how the hotel might **compensate** her for the inconvenience, without assuming a particular refund is guaranteed. They agree on a practical arrangement and **resolve** the immediate problem before her interview preparation begins.",
        vi: "Elena đặt phòng yên tĩnh để chuẩn bị phỏng vấn nhưng đến nơi thấy công trình ngay ngoài cửa sổ. Cô phản ánh ở lễ tân, mô tả ảnh hưởng và đưa tin nhắn xác nhận yêu cầu. Cô hỏi có phòng thay thế không. Lễ tân đề nghị đổi phòng chiều đó. Elena hỏi khách sạn có thể bù đắp bất tiện thế nào, không mặc định được hoàn tiền theo mức cụ thể. Hai bên thống nhất phương án thực tế trước khi cô bắt đầu chuẩn bị phỏng vấn.",
      },
      {
        title: "Khi cuộc họp gặp tiếng ồn",
        text: "At a shared office, a small company rents a meeting room for a video call. Unexpected maintenance creates a similar **disruption**. The team leader chooses to **bring up** the issue calmly and asks for an **alternative** space with a reliable connection. The manager offers another room and extra booking time to **compensate** for the delay. This does not remove the inconvenience, but it helps **resolve** the problem without interrupting other customers. Afterwards, the team leader asks how future maintenance will be communicated. A complaint can address both an immediate need and a process that caused the difficulty, as long as the request remains clear and realistic.",
        vi: "Một công ty thuê phòng họp nhưng bảo trì đột xuất gây ồn. Trưởng nhóm bình tĩnh phản ánh và xin chỗ khác có kết nối ổn định. Quản lý đề xuất phòng khác và thêm thời gian để bù cho việc chậm trễ. Giải pháp không xóa bất tiện nhưng xử lý được vấn đề mà không ảnh hưởng khách khác. Sau đó nhóm hỏi cách thông báo bảo trì trong tương lai. Phản ánh có thể vừa giải quyết nhu cầu hiện tại vừa cải thiện quy trình.",
      },
    ],
    dialogue: [
      ["Elena", "I’d like to bring up an issue with my room."],
      ["Receptionist", "I’m sorry to hear that. What has happened?"],
      [
        "Elena",
        "There is repair work outside the window, although I requested a quiet room.",
      ],
      ["Receptionist", "We can offer a room on the other side this afternoon."],
      [
        "Elena",
        "That would help. Could I use a quiet space until it is ready?",
      ],
      ["Receptionist", "Let me check which room is available now."],
    ],
    question: {
      prompt: "Elena hỗ trợ yêu cầu của mình bằng cách nào?",
      options: [
        "Đưa tin nhắn xác nhận yêu cầu phòng yên tĩnh",
        "Yêu cầu công nhân dừng mọi công việc",
        "Khẳng định luôn được hoàn tiền toàn bộ",
      ],
      answer: 0,
      explanation:
        "Cô nêu sự việc và đưa thông tin đã xác nhận, rồi hỏi phương án khả thi.",
    },
    recall: {
      prompt: "Điền cụm đề cập: I’d like to ____ an issue.",
      answer: "bring up",
      explanation: "Bring up an issue là đưa vấn đề ra trao đổi.",
    },
  },
  {
    id: "reading-b2-evidence-v1",
    topic: "Học tập",
    title: "Một con số chưa kể hết câu chuyện",
    level: "B2",
    photo: "learning",
    source,
    goal: "Phân biệt dữ kiện, suy luận và giới hạn của một kết luận.",
    context: "Nhóm sinh viên đọc một khảo sát nhỏ về thói quen đi lại.",
    terms: [
      [
        "claim",
        "nhận định cần xem xét",
        "A claim about something; không mặc nhiên đúng hay sai.",
        "The report makes a claim about travel habits.",
      ],
      [
        "evidence",
        "bằng chứng",
        "Danh từ không đếm được: some evidence, a piece of evidence.",
        "We need more evidence before making a decision.",
      ],
      [
        "account for",
        "giải thích / tính đến",
        "Trong bài dùng nghĩa giải thích một kết quả. Không tách account và for.",
        "Several factors may account for the difference.",
      ],
      [
        "sample",
        "mẫu khảo sát",
        "A sample of respondents; không phải toàn bộ cộng đồng.",
        "The sample includes only twenty volunteers.",
      ],
      [
        "draw a conclusion",
        "rút ra kết luận",
        "Draw a conclusion from evidence; kết luận cần tương xứng dữ liệu.",
        "It is too early to draw a conclusion.",
      ],
    ],
    readings: [
      {
        title: "Ai đã trả lời khảo sát?",
        text: "A student group reads a **claim** that most people in their town want to cycle to work. The **evidence** comes from a survey shared in a cycling club. Before accepting the result, Noor asks who belongs to the **sample**. Club members may be more interested in cycling than other residents, which could **account for** the high level of support. The group does not dismiss the survey as useless. Instead, they describe what it tells them about this particular group and what remains unknown. They decide to ask people at several different locations before they **draw a conclusion** about the whole town. A striking number becomes more useful when its limits are visible.",
        vi: "Nhóm sinh viên đọc nhận định rằng đa số dân trong thị trấn muốn đạp xe đi làm. Bằng chứng là khảo sát trong câu lạc bộ xe đạp. Noor hỏi mẫu gồm những ai: thành viên có thể vốn thích đạp xe hơn dân cư nói chung, giải thích mức ủng hộ cao. Nhóm không coi khảo sát vô ích mà nêu rõ điều biết được về nhóm này và điều còn chưa biết. Họ muốn hỏi ở nhiều địa điểm trước khi kết luận về cả thị trấn.",
      },
      {
        title: "Đọc phản hồi về một ứng dụng",
        text: "Later, Noor sees a **claim** that a new study app works well for everyone. Its website presents positive comments as **evidence**, but does not explain how the users were selected. She wonders whether the **sample** includes people who stopped using the app. Motivation, previous knowledge and available time could all **account for** differences in results. Noor tries the free demonstration, but she does not **draw a conclusion** from one successful exercise. She wants to see whether she can remember the material a week later. Her aim is not to reject every recommendation; it is to match the strength of her belief to the quality of the information available.",
        vi: "Noor thấy nhận định một app học hiệu quả với mọi người, dựa trên lời khen mà không giải thích cách chọn người dùng. Cô tự hỏi mẫu có người đã bỏ app không. Động lực, kiến thức trước đó và thời gian đều có thể giải thích khác biệt kết quả. Noor thử demo nhưng chưa kết luận chỉ từ một bài làm đúng. Cô muốn kiểm tra còn nhớ sau một tuần hay không, để mức tin tưởng phù hợp chất lượng thông tin.",
      },
    ],
    dialogue: [
      ["Noor", "Who answered this survey?"],
      ["Ben", "It was shared with members of a cycling club."],
      ["Noor", "That could account for the positive result."],
      ["Ben", "So should we ignore it?"],
      [
        "Noor",
        "No. It tells us about those members, but not necessarily the whole town.",
      ],
      ["Ben", "Let’s state that limitation and gather a broader sample."],
    ],
    question: {
      prompt: "Vấn đề chính của khảo sát là gì?",
      options: [
        "Không được dùng khảo sát để tìm hiểu ý kiến",
        "Mẫu có thể không đại diện cả thị trấn",
        "Mọi thành viên đều trả lời sai",
      ],
      answer: 1,
      explanation:
        "Mẫu từ câu lạc bộ có thể thiên về người thích xe đạp; không thể tự khái quát cho toàn thị trấn.",
    },
    recall: {
      prompt:
        "Điền cụm giải thích nguyên nhân: Several factors may ____ the difference.",
      answer: "account for",
      explanation:
        "Account for something ở đây nghĩa là giải thích vì sao nó xảy ra.",
    },
  },
  {
    id: "reading-b2-digital-boundaries-v1",
    topic: "Công nghệ & dịch vụ",
    title: "Thông báo nào thực sự cần thiết?",
    level: "B2",
    photo: "phone",
    source,
    goal: "Đề xuất thay đổi thói quen số và thỏa thuận ngoại lệ.",
    context: "Nhóm làm việc đang bị ngắt quãng bởi tin nhắn ngoài giờ.",
    terms: [
      [
        "cut down on",
        "giảm bớt",
        "Cut down on something; không tách cụm.",
        "I want to cut down on unnecessary notifications.",
      ],
      [
        "switch off",
        "tắt",
        "Switch off notifications; switch them off.",
        "She switches off most alerts in the evening.",
      ],
      [
        "boundary",
        "giới hạn trong quan hệ / công việc",
        "Set a boundary; số nhiều boundaries khi nói nhiều giới hạn.",
        "We need a clear boundary between work and rest.",
      ],
      [
        "urgent",
        "khẩn cấp",
        "An urgent request; không đồng nghĩa mọi tin mới đều khẩn cấp.",
        "Please call if the issue is urgent.",
      ],
      [
        "make an exception",
        "cho phép ngoại lệ",
        "Make an exception for something/someone.",
        "We can make an exception for a planned emergency exercise.",
      ],
    ],
    readings: [
      {
        title: "Thống nhất cách liên lạc",
        text: "After several evenings interrupted by routine messages, Jo proposes a way to **cut down on** unnecessary notifications. She does not want colleagues to disappear when something is genuinely **urgent**. Instead, she suggests a clear **boundary**: ordinary questions can wait until morning, while an urgent problem should be reported by phone to the person on duty. Team members can **switch off** other alerts after work. They agree to **make an exception** during a scheduled launch, with the dates stated in advance. Jo summarises the arrangement in the team chat. The purpose is to make expectations explicit, so silence in the evening is not mistaken for a lack of commitment.",
        vi: "Sau nhiều tối bị tin nhắn thường xuyên làm gián đoạn, Jo đề nghị giảm thông báo không cần thiết. Cô vẫn muốn xử lý việc thực sự khẩn. Nhóm thống nhất: câu hỏi thường chờ sáng, việc khẩn gọi người trực; mọi người được tắt thông báo khác sau giờ làm. Có ngoại lệ trong đợt ra mắt đã lên lịch rõ. Jo tóm tắt thỏa thuận để việc không trả lời buổi tối không bị hiểu là thiếu trách nhiệm.",
      },
      {
        title: "Thỏa thuận trong nhóm học",
        text: "A study group faces the same problem before an exam. Some members send questions late at night, and others feel obliged to answer immediately. They decide to **cut down on** late messages by collecting questions in a shared document. Each person sets a **boundary** around their sleeping hours and can **switch off** the group chat. If a change to the exam location is **urgent**, the organiser will contact everyone directly. The group may **make an exception** for a final practice session, but only if the participants agree beforehand. The arrangement protects concentration without assuming that every member has the same daily schedule or the same amount of free time.",
        vi: "Nhóm học trước kỳ thi gặp vấn đề tương tự: tin nhắn khuya khiến người khác thấy phải trả lời ngay. Họ gom câu hỏi vào tài liệu chung để giảm tin muộn, đặt giới hạn giờ ngủ và được tắt chat. Nếu đổi địa điểm thi khẩn, người tổ chức liên hệ trực tiếp. Nhóm có thể dành ngoại lệ cho buổi luyện cuối nếu đã thống nhất. Cách này bảo vệ sự tập trung và tôn trọng lịch sinh hoạt khác nhau.",
      },
    ],
    dialogue: [
      ["Jo", "Could we agree on how to contact each other after work?"],
      ["Manager", "What would you change?"],
      [
        "Jo",
        "Routine questions could wait until morning. Urgent issues could go to the person on duty.",
      ],
      ["Manager", "What about launch night?"],
      ["Jo", "We could make an exception, provided everyone knows the dates."],
      ["Manager", "Let’s write that down and review it after the launch."],
    ],
    question: {
      prompt: "Nhóm vẫn xử lý việc khẩn bằng cách nào?",
      options: [
        "Yêu cầu mọi người bật mọi thông báo",
        "Bỏ qua cho đến sáng",
        "Gọi điện cho người trực",
      ],
      answer: 2,
      explanation:
        "Thỏa thuận phân biệt tin thường với việc khẩn và có kênh riêng cho người trực.",
    },
    recall: {
      prompt: "Điền cụm giảm bớt: We should ____ unnecessary alerts.",
      answer: "cut down on",
      explanation: "Cut down on + danh từ/V-ing chỉ giảm mức độ hoặc số lượng.",
    },
  },
  {
    id: "reading-b2-community-choice-v1",
    topic: "Cộng đồng & giúp đỡ",
    title: "Chọn một dự án cho khu phố",
    level: "B2",
    photo: "help",
    source,
    goal: "Cân nhắc ý kiến khác nhau và giải thích quyết định bằng tiêu chí.",
    context:
      "Nhóm tình nguyện có ngân sách hạn chế và hai đề xuất cần lựa chọn.",
    terms: [
      [
        "allocate",
        "phân bổ",
        "Allocate money/time to something.",
        "We need to allocate time to training.",
      ],
      [
        "weigh up",
        "cân nhắc các mặt",
        "Weigh up the options; thường gặp trong tiếng Anh Anh.",
        "Let’s weigh up the costs and benefits.",
      ],
      [
        "feasible",
        "khả thi",
        "Feasible không có nghĩa là tốt nhất; nói về khả năng thực hiện.",
        "Is the plan feasible with three volunteers?",
      ],
      [
        "in the long run",
        "về lâu dài",
        "Nói về kết quả trong thời gian dài hơn.",
        "A simple system may cost less in the long run.",
      ],
      [
        "reach a compromise",
        "đạt thỏa hiệp",
        "Hai bên điều chỉnh yêu cầu; không nhất thiết ai cũng được mọi điều muốn.",
        "We managed to reach a compromise.",
      ],
    ],
    readings: [
      {
        title: "Không chỉ nhìn vào giá mua",
        text: "A neighbourhood group has enough money for either new sports equipment or a small lending library. Before they **allocate** the budget, the volunteers **weigh up** the likely costs beyond the first purchase. Sports equipment needs storage, while a library needs someone to organise returns. They ask which plan is **feasible** with the people available and which would serve more residents **in the long run**. Rather than choose the loudest suggestion, they use agreed criteria. Eventually, they **reach a compromise**: start with a small collection of donated books and reserve part of the budget for shared equipment. They also set a date to review whether the arrangement is actually being used.",
        vi: "Nhóm khu phố đủ tiền cho dụng cụ thể thao hoặc thư viện cho mượn nhỏ. Trước khi phân bổ, họ cân nhắc chi phí sau khi mua: chỗ cất dụng cụ, người quản lý trả sách. Họ đánh giá tính khả thi với nhân lực hiện có và lợi ích lâu dài theo tiêu chí đã thống nhất. Cuối cùng, nhóm thỏa hiệp: bắt đầu bằng sách được tặng và giữ một phần tiền cho dụng cụ dùng chung. Họ hẹn ngày xem lại mức sử dụng thực tế.",
      },
      {
        title: "Chọn cách học trong câu lạc bộ",
        text: "An English club must **allocate** its limited meeting time between conversation and exam practice. Members **weigh up** the options, knowing that a single format will not suit everyone. A separate session every day is not **feasible**, because the volunteer tutor is available only twice a week. They **reach a compromise** by alternating the focus and sharing optional tasks between meetings. The group believes that a schedule people can maintain will help more **in the long run** than an ambitious plan they soon abandon. After a month, they will ask members what they used and what they skipped, then adjust the schedule using those observations.",
        vi: "Câu lạc bộ tiếng Anh cần phân bổ thời gian giữa hội thoại và luyện thi. Mọi người cân nhắc vì một kiểu học không hợp tất cả. Học riêng mỗi ngày không khả thi do giáo viên tình nguyện chỉ rảnh hai buổi một tuần. Nhóm thỏa hiệp bằng cách luân phiên trọng tâm và chia bài tùy chọn giữa các buổi. Họ chọn lịch có thể duy trì lâu dài, rồi sau một tháng hỏi thành viên đã dùng hoặc bỏ qua phần nào để điều chỉnh.",
      },
    ],
    dialogue: [
      ["Ari", "Should we spend the whole budget on equipment?"],
      ["Kim", "Let’s weigh up the ongoing costs first."],
      ["Ari", "Storage might be a problem. Is the library more feasible?"],
      ["Kim", "Only if someone can organise the returns."],
      [
        "Ari",
        "Could we start with donated books and keep some money for equipment?",
      ],
      ["Kim", "That sounds like a compromise we can review in a month."],
    ],
    question: {
      prompt: "Nhóm dựa vào đâu để ra quyết định?",
      options: [
        "Ý kiến nói to nhất",
        "Giá mua ban đầu duy nhất",
        "Chi phí, nhân lực và lợi ích lâu dài",
      ],
      answer: 2,
      explanation:
        "Họ so sánh nhiều tiêu chí và còn đặt lịch xem lại sau khi thực hiện.",
    },
    recall: {
      prompt: "Điền cụm cân nhắc: Let’s ____ the options.",
      answer: "weigh up",
      explanation:
        "Weigh up the options = cân nhắc các lựa chọn trước quyết định.",
    },
  },
  {
    id: "reading-b2-interview-example-v1",
    topic: "Phỏng vấn",
    title: "Kể một việc mình thực sự đã làm",
    level: "B2",
    photo: "interview",
    source,
    goal: "Trả lời phỏng vấn bằng một ví dụ rõ vai trò, hành động và kết quả.",
    context:
      "Ứng viên muốn nói về kỹ năng làm việc nhóm mà không chỉ liệt kê tính từ.",
    terms: [
      [
        "take responsibility",
        "nhận trách nhiệm",
        "Take responsibility for + danh từ/V-ing.",
        "I took responsibility for checking the final report.",
      ],
      [
        "carry out",
        "thực hiện",
        "Carry out a task/check; carry it out.",
        "We carried out a short survey.",
      ],
      [
        "setback",
        "trở ngại làm chậm tiến độ",
        "A setback không nhất thiết là thất bại hoàn toàn.",
        "The delay was a setback, but we adjusted the plan.",
      ],
      [
        "contribution",
        "sự đóng góp",
        "Make a contribution to something.",
        "Her contribution helped the team finish on time.",
      ],
      [
        "follow through",
        "làm đến nơi đến chốn",
        "Follow through on a promise or plan.",
        "I try to follow through on my commitments.",
      ],
    ],
    readings: [
      {
        title: "Từ tính từ đến bằng chứng",
        text: "During an interview, Lin is asked whether she works well in a team. Instead of simply saying that she is responsible, she describes a student event. Her role was to **take responsibility** for checking registrations. When a shared file stopped working, the team faced a **setback**. Lin helped **carry out** a manual check and wrote clear instructions for the next shift. She explains her own **contribution** without claiming that she organised the whole event alone. Finally, she describes how she continued to **follow through** on the remaining checks after the event opened. The example gives the interviewer something specific to discuss, including what Lin might do differently next time.",
        vi: "Trong phỏng vấn, Lin được hỏi về làm việc nhóm. Thay vì chỉ nói có trách nhiệm, cô kể sự kiện thời sinh viên: phụ trách kiểm tra đăng ký. Tệp chung bị lỗi là trở ngại. Lin giúp kiểm tra thủ công và viết hướng dẫn ca sau. Cô nêu đóng góp của mình, không nhận công tổ chức toàn bộ sự kiện. Cô kể cả việc tiếp tục kiểm tra sau giờ mở cửa. Ví dụ cụ thể tạo cơ sở để trao đổi điều có thể làm khác lần tới.",
      },
      {
        title: "Nhìn lại một việc tình nguyện",
        text: "Before her next interview, Lin reviews another experience from a volunteer project. She remembers a **setback** involving a late delivery, but she initially struggles to explain her **contribution** clearly. She writes down who made each decision and what she personally did. Her job was to **carry out** a stock check, not to negotiate with the supplier. She did **take responsibility** for reporting missing items and made sure to **follow through** when replacements arrived. By separating the team’s result from her individual actions, Lin can give an accurate account. She also prepares to discuss what she learned, rather than treating the story as proof that she never makes mistakes.",
        vi: "Trước lần phỏng vấn tiếp, Lin xem lại dự án tình nguyện có giao hàng trễ. Cô ghi ai quyết định gì và bản thân đã làm gì. Nhiệm vụ của cô là kiểm kê chứ không thương lượng với nhà cung cấp. Cô nhận trách nhiệm báo đồ thiếu và theo dõi đến khi hàng thay thế đến. Tách kết quả chung khỏi hành động cá nhân giúp kể chính xác. Cô chuẩn bị nói cả bài học rút ra, không coi câu chuyện là bằng chứng mình không mắc lỗi.",
      },
    ],
    dialogue: [
      [
        "Interviewer",
        "Can you give an example of working through a problem with a team?",
      ],
      ["Lin", "At a student event, our registration file stopped working."],
      ["Interviewer", "What was your role?"],
      [
        "Lin",
        "I carried out a manual check and wrote instructions for the next shift.",
      ],
      ["Interviewer", "What would you change next time?"],
      [
        "Lin",
        "I would prepare a backup process before the event rather than wait for a setback.",
      ],
    ],
    question: {
      prompt:
        "Vì sao ví dụ của Lin có sức thuyết phục hơn một danh sách tính từ?",
      options: [
        "Nêu rõ hành động và vai trò thực tế",
        "Khẳng định cô làm mọi việc một mình",
        "Bỏ qua mọi khó khăn",
      ],
      answer: 0,
      explanation:
        "Cô đưa ví dụ cụ thể, phân biệt đóng góp cá nhân và công việc của cả nhóm.",
    },
    recall: {
      prompt: "Điền cụm thực hiện: We need to ____ a stock check.",
      answer: "carry out",
      explanation:
        "Carry out a check/task = thực hiện một cuộc kiểm tra/nhiệm vụ.",
    },
  },
];
