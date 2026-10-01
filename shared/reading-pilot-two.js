// Original learning situations; photo attribution lives in photo-sources.js.
const source = {
  kind: "original",
  title: "Little by Little — nội dung biên soạn mới",
  author: "Little by Little",
  checkedAt: "2026-09-12",
};
export const readingPilotTwo = [
  {
    id: "reading-clinic-appointment-v1",
    topic: "Sức khỏe",
    title: "Chuẩn bị cho buổi khám",
    level: "A2–B1",
    photo: "health",
    source,
    goal: "Đặt lịch, mô tả điều đang gặp và hỏi lại thông tin chưa rõ.",
    context:
      "Lan đặt lịch tại phòng khám và chuẩn bị những điều cần nói. Bài luyện giao tiếp, không đưa ra chẩn đoán hay hướng điều trị.",
    terms: [
      [
        "appointment",
        "lịch hẹn",
        "Make an appointment with someone; at a clinic.",
        "I have an appointment at ten.",
      ],
      [
        "symptoms",
        "các triệu chứng",
        "Describe your symptoms: mô tả điều bạn cảm nhận, không tự kết luận bệnh.",
        "She wrote down her symptoms before the visit.",
      ],
      [
        "fill out",
        "điền thông tin",
        "Fill out a form; với đại từ: fill it out. Fill in cũng thường được dùng.",
        "Please fill out this form.",
      ],
      [
        "come back",
        "quay lại",
        "Không có tân ngữ trực tiếp; come back to a place.",
        "Can I come back tomorrow?",
      ],
      [
        "Could you repeat that?",
        "Bạn có thể nhắc lại không?",
        "Lịch sự khi chưa nghe rõ; có thể thêm please.",
        "Sorry, could you repeat that, please?",
      ],
    ],
    readings: [
      {
        title: "Một tờ ghi chú nhỏ",
        text: "Lan has an **appointment** at a local clinic on Tuesday. Before leaving home, she writes down her **symptoms** and when they started. At reception, she is asked to **fill out** a form. She checks the questions instead of guessing what unfamiliar words mean. During the visit, the doctor speaks quickly. Lan says, “**Could you repeat that?**” She also asks whether she needs to **come back**. Before leaving, she repeats the next steps in her own words so the doctor can check her understanding.",
        vi: "Lan có lịch khám vào thứ Ba. Trước khi đi, cô ghi lại các triệu chứng và thời điểm bắt đầu. Lễ tân yêu cầu cô điền biểu mẫu. Cô hỏi những từ chưa hiểu thay vì đoán. Khi bác sĩ nói nhanh, cô xin nhắc lại và hỏi có cần quay lại không. Trước khi về, cô nói lại các bước tiếp theo bằng lời của mình để bác sĩ kiểm tra cô đã hiểu đúng.",
      },
      {
        title: "Xác nhận qua điện thoại",
        text: "Minh calls the clinic to change an **appointment** because his work schedule has changed. The receptionist offers Thursday morning, but the line is noisy. “**Could you repeat that?**” he asks. He writes down the time and confirms it aloud. The receptionist reminds him to bring the form and **fill out** any empty sections. Minh keeps his notes about his **symptoms** with the form. He knows when to **come back**, and he will not need to remember every detail without help.",
        vi: "Minh gọi đổi lịch khám vì lịch làm việc thay đổi. Lễ tân đề xuất sáng thứ Năm nhưng đường truyền ồn nên anh xin nhắc lại. Anh ghi giờ và đọc lại để xác nhận. Lễ tân nhắc mang biểu mẫu và điền những phần còn trống. Minh để ghi chú triệu chứng cùng biểu mẫu. Anh biết lúc nào quay lại mà không phải tự nhớ mọi chi tiết.",
      },
    ],
    dialogue: [
      ["Lan", "I have an appointment with Dr Lee at ten."],
      ["Receptionist", "Please fill out this form and take a seat."],
      ["Lan", "Could you explain this question, please?"],
      ["Receptionist", "It asks when your symptoms started."],
      ["Lan", "Thank you. Where should I return the form?"],
      ["Receptionist", "You can bring it back to this desk."],
    ],
    question: {
      prompt: "Lan nói lại các bước tiếp theo để làm gì?",
      options: [
        "Để kiểm tra mình đã hiểu đúng",
        "Để tự chọn thuốc",
        "Để hủy lịch khám",
      ],
      answer: 0,
      explanation:
        "Lan nhắc lại thông tin để bác sĩ có thể xác nhận hoặc sửa điều cô hiểu chưa đúng.",
    },
    recall: {
      prompt: "Điền cụm chỉ việc điền biểu mẫu: Please ____ this form.",
      answer: "fill out",
      explanation: "Fill out a form = điền thông tin vào biểu mẫu.",
    },
  },
  {
    id: "reading-hotel-arrival-v1",
    topic: "Du lịch & lưu trú",
    title: "Đến sớm hơn giờ nhận phòng",
    level: "A2",
    photo: "hotel",
    source,
    goal: "Xác nhận đặt phòng, hỏi giờ nhận phòng và nơi gửi hành lý.",
    context: "Bạn đến khách sạn buổi sáng nhưng phòng chưa sẵn sàng.",
    terms: [
      [
        "reservation",
        "đặt chỗ trước",
        "Have a reservation under + tên người đặt.",
        "I have a reservation under Nguyen.",
      ],
      [
        "check in",
        "làm thủ tục nhận phòng",
        "Động từ hai từ; danh từ/tính từ thường viết check-in.",
        "Can we check in now?",
      ],
      [
        "luggage",
        "hành lý",
        "Danh từ không đếm được: some luggage, không dùng luggages.",
        "Can I leave my luggage here?",
      ],
      [
        "available",
        "còn trống / có thể sử dụng",
        "Trong bài nói về phòng; cũng dùng cho thời gian rảnh.",
        "Is a quiet room available?",
      ],
      [
        "check out",
        "làm thủ tục trả phòng",
        "Check out of a hotel; nghĩa khác với xem thử một thứ.",
        "We need to check out before eleven.",
      ],
    ],
    readings: [
      {
        title: "Chiếc vali ở quầy lễ tân",
        text: "After an early train journey, Hoa reaches her hotel at nine. She has a **reservation**, but she cannot **check in** until two. No clean room is **available** yet. Instead of waiting in the lobby all morning, she asks whether she can leave her **luggage** at reception. The receptionist gives her a numbered ticket and suggests a nearby café. Hoa also asks when she must **check out** on Sunday. With those details clear, she can enjoy the morning without carrying her suitcase around town.",
        vi: "Sau chuyến tàu sớm, Hoa đến khách sạn lúc chín giờ. Cô đã đặt phòng nhưng phải chờ đến hai giờ mới được nhận phòng vì chưa có phòng đã dọn xong. Thay vì ngồi chờ cả sáng, cô hỏi gửi hành lý. Lễ tân đưa thẻ có số và gợi ý quán cà phê gần đó. Hoa cũng hỏi giờ trả phòng Chủ nhật. Biết rõ thông tin, cô có thể đi chơi mà không phải kéo vali khắp phố.",
      },
      {
        title: "Chuyến công tác kết thúc muộn",
        text: "David has a meeting on his last morning at the hotel. His **reservation** ends that day, and he needs to **check out** before eleven. He asks if a later departure is **available** and whether there is an extra charge. The hotel cannot offer it because other guests will **check in** that afternoon. David decides to leave his **luggage** at reception after returning his key. He collects his bag after the meeting and checks the label before taking it to the station.",
        vi: "David có cuộc họp vào sáng cuối cùng ở khách sạn. Đặt phòng kết thúc hôm đó và anh cần trả phòng trước mười một giờ. Anh hỏi có thể trả muộn không và có mất thêm phí không. Khách sạn không thể đáp ứng vì có khách nhận phòng chiều đó. David gửi hành lý tại lễ tân sau khi trả chìa khóa. Sau cuộc họp, anh lấy túi và kiểm tra nhãn trước khi ra ga.",
      },
    ],
    dialogue: [
      ["Hoa", "Hello, I have a reservation under Tran."],
      ["Receptionist", "Welcome. Your room will be ready at two."],
      ["Hoa", "Could I leave my luggage here until then?"],
      ["Receptionist", "Of course. Please keep this ticket."],
      ["Hoa", "Thank you. What time is check-out on Sunday?"],
      ["Receptionist", "Please return your key by eleven."],
    ],
    question: {
      prompt: "Hoa làm gì khi chưa thể nhận phòng?",
      options: [
        "Đổi sang khách sạn khác",
        "Gửi hành lý rồi ra ngoài",
        "Mang vali vào phòng chưa dọn",
      ],
      answer: 1,
      explanation:
        "Cô gửi hành lý ở lễ tân để có thể đi chơi trong lúc chờ phòng.",
    },
    recall: {
      prompt: "Điền cụm nhận phòng: Can we ____ now?",
      answer: "check in",
      explanation:
        "Check in là làm thủ tục nhận phòng; check out là trả phòng.",
    },
  },
  {
    id: "reading-library-study-v1",
    topic: "Học tập",
    title: "Buổi học nhóm trong thư viện",
    level: "A2–B1",
    photo: "learning",
    source,
    goal: "Hỏi mượn tài liệu, tra từ có chọn lọc và diễn đạt lại điều đã đọc.",
    context:
      "Hai bạn chuẩn bị bài trình bày, nhưng một người đang cố dịch từng từ.",
    terms: [
      [
        "borrow",
        "mượn",
        "Borrow something from someone; lend là cho mượn.",
        "Can I borrow this book from the library?",
      ],
      [
        "look up",
        "tra cứu",
        "Look a word up / look up a word; với đại từ: look it up.",
        "I need to look up this word.",
      ],
      [
        "take notes",
        "ghi chép",
        "Ghi ý chính; không nhất thiết chép nguyên văn.",
        "I take notes while I read.",
      ],
      [
        "in your own words",
        "bằng lời của bạn",
        "Explain something in your own words.",
        "Tell me the main idea in your own words.",
      ],
      [
        "hand in",
        "nộp",
        "Hand in an assignment; với đại từ: hand it in.",
        "We must hand in our report on Friday.",
      ],
    ],
    readings: [
      {
        title: "Không cần dịch mọi từ",
        text: "An and Leo meet in the library to prepare a short presentation. They **borrow** a book about city gardens. An wants to **look up** every unfamiliar word, but that leaves little time to understand the main idea. Leo suggests reading one section first. They **take notes** about the problem and one possible solution. “Can you explain it **in your own words**?” he asks. An tries, then checks the book again. They agree to **hand in** a short outline before writing the full presentation.",
        vi: "An và Leo gặp ở thư viện để chuẩn bị bài trình bày ngắn. Họ mượn sách về vườn trong thành phố. An muốn tra mọi từ lạ nhưng như vậy còn ít thời gian hiểu ý chính. Leo đề xuất đọc hết một phần trước. Họ ghi lại vấn đề và một giải pháp. Leo nhờ An giải thích bằng lời của mình. An thử rồi kiểm tra sách lại. Họ thống nhất nộp dàn ý ngắn trước khi viết toàn bộ bài.",
      },
      {
        title: "Giải thích cho người chưa đọc",
        text: "The following week, An helps a classmate who missed a lesson. They **borrow** the class notes and read them together. Her classmate stops at a difficult sentence, so An suggests they **look up** only the word that blocks the meaning. Then she says, “Try explaining the example **in your own words**.” They **take notes** on a separate sheet rather than copying the whole page. Before they leave, they check when to **hand in** the homework and put the date in their calendars.",
        vi: "Tuần sau, An giúp một bạn bỏ lỡ buổi học. Họ mượn vở ghi và cùng đọc. Bạn dừng ở câu khó nên An đề xuất chỉ tra từ cản trở việc hiểu ý. Sau đó cô đề nghị bạn giải thích ví dụ bằng lời của mình. Họ ghi ý ra tờ riêng thay vì chép cả trang. Trước khi về, họ kiểm tra hạn nộp bài và ghi ngày vào lịch.",
      },
    ],
    dialogue: [
      ["An", "Can I borrow this book for our project?"],
      ["Leo", "Yes. Let’s start with the section on small gardens."],
      ["An", "There are several words I don’t know."],
      ["Leo", "Which one stops you from understanding the main idea?"],
      ["An", "This one. I’ll look it up and take notes."],
      ["Leo", "Great. Then tell me what the section means in your own words."],
    ],
    question: {
      prompt: "Leo đề xuất thay đổi cách đọc như thế nào?",
      options: [
        "Chép nguyên cả chương",
        "Bỏ hẳn những phần khó",
        "Đọc một phần rồi ghi ý chính",
      ],
      answer: 2,
      explanation:
        "Leo giúp An chuyển từ tra từng từ sang hiểu ý chính và tự giải thích lại.",
    },
    recall: {
      prompt: "Điền cụm tra cứu: I need to ____ this word.",
      answer: "look up",
      explanation: "Look up a word = tra một từ; có thể nói look the word up.",
    },
  },
  {
    id: "reading-repair-laptop-v1",
    topic: "Công nghệ & dịch vụ",
    title: "Mang máy tính đi kiểm tra",
    level: "B1",
    photo: "tech",
    source,
    goal: "Mô tả sự cố, hỏi chi phí và xác nhận trước khi sửa.",
    context:
      "Máy tính không bật lên. Bạn trao đổi với nhân viên cửa hàng sửa chữa.",
    terms: [
      [
        "turn on",
        "bật thiết bị",
        "Turn the laptop on; với đại từ: turn it on.",
        "My laptop will not turn on.",
      ],
      [
        "plug in",
        "cắm điện / kết nối bằng dây",
        "Plug in the charger; plug it in.",
        "Please plug in the charger.",
      ],
      [
        "back up",
        "sao lưu",
        "Động từ back up; danh từ backup.",
        "I back up my files every week.",
      ],
      [
        "estimate",
        "chi phí hoặc thời gian ước tính",
        "An estimate chưa phải mức phí cuối cùng đã cam kết.",
        "Could you send me a written estimate?",
      ],
      [
        "pick up",
        "đến lấy",
        "Pick up the laptop; pick it up. Nghĩa ở đây là đến nhận đồ.",
        "I can pick up the laptop after work.",
      ],
    ],
    readings: [
      {
        title: "Chưa sửa khi chưa rõ giá",
        text: "Sam takes his laptop to a repair shop because it will not **turn on**. The technician asks him to **plug in** the charger so she can check the connection. Sam explains that he usually remembers to **back up** his files, but his latest document may only be on this machine. He asks for an **estimate** before agreeing to any repair. The technician will call after checking the fault. Sam also asks when he might **pick up** the laptop, because he needs it for work next week.",
        vi: "Sam mang máy tính đến cửa hàng vì máy không bật lên. Kỹ thuật viên nhờ anh cắm sạc để kiểm tra kết nối. Sam nói thường có sao lưu nhưng tài liệu mới nhất có thể chỉ nằm trên máy này. Anh yêu cầu báo chi phí ước tính trước khi đồng ý sửa. Kỹ thuật viên sẽ gọi sau khi kiểm tra lỗi. Sam cũng hỏi khi nào có thể đến lấy vì cần máy cho công việc tuần sau.",
      },
      {
        title: "Cuộc gọi xác nhận",
        text: "The next afternoon, the shop calls Sam with an **estimate**. He asks what the price includes and requests an email before making a decision. The technician says she has found a charging problem, but she does not promise that every file can be recovered. Sam agrees to the stated repair. When he comes to **pick up** the laptop, he asks to **plug in** the charger and **turn on** the machine at the counter. At home, he checks his documents and plans to **back up** the important ones.",
        vi: "Chiều hôm sau, cửa hàng gọi báo chi phí ước tính. Sam hỏi giá gồm những gì và xin email trước khi quyết định. Kỹ thuật viên đã tìm ra vấn đề sạc nhưng không hứa sẽ khôi phục được mọi tệp. Sam đồng ý sửa theo nội dung đã nêu. Lúc đến lấy, anh xin cắm sạc và bật máy tại quầy. Về nhà, anh kiểm tra tài liệu và lên kế hoạch sao lưu các tệp quan trọng.",
      },
    ],
    dialogue: [
      ["Sam", "My laptop won’t turn on. Could you check it?"],
      ["Technician", "Did you bring the charger?"],
      ["Sam", "Yes. Could you give me an estimate before repairing it?"],
      ["Technician", "Certainly. We’ll call after checking the problem."],
      ["Sam", "Please email the details as well. When might it be ready?"],
      ["Technician", "We’ll confirm the collection time in that email."],
    ],
    question: {
      prompt: "Sam muốn nhận gì trước khi đồng ý sửa?",
      options: [
        "Một máy tính mới miễn phí",
        "Chi phí ước tính",
        "Mật khẩu của kỹ thuật viên",
      ],
      answer: 1,
      explanation:
        "Anh yêu cầu estimate để biết chi phí dự kiến trước khi cho phép sửa.",
    },
    recall: {
      prompt: "Điền cụm sao lưu: Remember to ____ your files.",
      answer: "back up",
      explanation:
        "Back up là động từ sao lưu; backup là danh từ hoặc tính từ.",
    },
  },
  {
    id: "reading-games-newcomer-v1",
    topic: "Sở thích & giải trí",
    title: "Lần đầu đến buổi chơi nhóm",
    level: "A2–B1",
    photo: "entertainment",
    source,
    goal: "Xin tham gia, hỏi luật và giúp người mới cảm thấy thoải mái.",
    context: "Một người mới đến buổi chơi board game nhưng chưa biết luật.",
    terms: [
      [
        "join in",
        "tham gia hoạt động đang diễn ra",
        "Join in a game; join a club thường không có in.",
        "Can I join in?",
      ],
      [
        "take turns",
        "lần lượt thay phiên",
        "Take turns doing something.",
        "We take turns drawing a card.",
      ],
      [
        "rules",
        "luật chơi",
        "Explain the rules; không phải mọi luật đều dùng law.",
        "Could you explain the rules?",
      ],
      [
        "give it a go",
        "thử làm xem sao",
        "Cách nói thân mật, phổ biến trong tiếng Anh Anh.",
        "I have never played, but I’ll give it a go.",
      ],
      [
        "keep score",
        "ghi / theo dõi điểm",
        "Keep score trong trò chơi; score cũng là động từ ghi điểm.",
        "Who will keep score tonight?",
      ],
    ],
    readings: [
      {
        title: "Một lượt chơi thử",
        text: "Nina arrives at a board game evening where everyone seems to know each other. She asks if she can **join in**, but admits she does not know the **rules**. A player offers to show her a practice round. They **take turns** choosing a card and explaining what happens next. Nina decides to **give it a go** instead of watching all evening. Another player will **keep score**, so she can focus on learning. By the second round, Nina is asking questions and laughing with the group.",
        vi: "Nina đến buổi chơi board game, nơi mọi người dường như đã quen nhau. Cô xin tham gia nhưng nói chưa biết luật. Một người đề nghị hướng dẫn qua lượt thử. Họ lần lượt chọn thẻ và giải thích bước tiếp theo. Nina quyết định thử thay vì ngồi xem cả tối. Một người khác ghi điểm để cô tập trung học cách chơi. Đến lượt thứ hai, cô đã hỏi han và cười cùng nhóm.",
      },
      {
        title: "Đến lượt mình giúp người mới",
        text: "A week later, Nina brings her cousin to the group. He asks about the **rules** before deciding whether to **join in**. Nina remembers feeling nervous herself and suggests a short practice game. They **take turns** showing him the actions on each card. Nobody needs to **keep score** during this round. Her cousin says he will **give it a go** after seeing one example. Nina has not become an expert, but she can make the first few minutes easier for someone else.",
        vi: "Một tuần sau, Nina đưa người anh em họ đến nhóm. Anh hỏi luật trước khi quyết định tham gia. Nhớ cảm giác lo lắng của mình, Nina đề xuất lượt chơi thử ngắn. Mọi người thay phiên chỉ các hành động trên thẻ. Lượt này không cần ghi điểm. Sau khi xem ví dụ, anh đồng ý thử. Nina chưa thành chuyên gia nhưng có thể giúp người mới bớt bỡ ngỡ.",
      },
    ],
    dialogue: [
      ["Nina", "Is there room for one more player?"],
      ["Host", "Of course. Have you played this before?"],
      ["Nina", "No. Could you explain the rules?"],
      ["Host", "Let’s try one round without keeping score."],
      ["Nina", "That sounds helpful. I’ll give it a go."],
      ["Host", "Great. We take turns choosing a card. You can watch me first."],
    ],
    question: {
      prompt: "Điều gì giúp Nina tập trung học cách chơi?",
      options: [
        "Người khác phụ trách ghi điểm",
        "Cô phải thuộc luật trước khi đến",
        "Nhóm không cho cô hỏi",
      ],
      answer: 0,
      explanation:
        "Một người khác giữ điểm để Nina có thể tập trung vào lượt chơi.",
    },
    recall: {
      prompt: "Điền cụm thay phiên: We ____ choosing a card.",
      answer: "take turns",
      explanation:
        "Take turns + V-ing nghĩa là lần lượt thay nhau làm việc gì.",
    },
  },
  {
    id: "reading-community-donations-v1",
    topic: "Cộng đồng & giúp đỡ",
    title: "Góp sức trong buổi quyên góp",
    level: "B1",
    photo: "help",
    source,
    goal: "Đề nghị giúp, hỏi nhiệm vụ cụ thể và bàn giao đồ rõ ràng.",
    context: "Bạn lần đầu đến điểm tiếp nhận đồ quyên góp của khu phố.",
    terms: [
      [
        "help out",
        "phụ giúp",
        "Help out with a task; giúp trong một tình huống cụ thể.",
        "Can I help out with the boxes?",
      ],
      [
        "sort out",
        "phân loại / sắp xếp",
        "Trong bài là phân loại đồ; còn có nghĩa giải quyết vấn đề.",
        "Let’s sort out these clothes by size.",
      ],
      [
        "drop off",
        "mang đến để lại / giao",
        "Drop off a box; với đại từ: drop it off.",
        "You can drop off donations before noon.",
      ],
      [
        "label",
        "nhãn / ghi nhãn",
        "Trong bài dùng như động từ; label each box.",
        "Please label the box with its contents.",
      ],
      [
        "run it by",
        "trình bày điều đó để xin ý kiến",
        "Run a plan by someone; với đại từ: run it by her.",
        "I’ll run the plan by the coordinator.",
      ],
    ],
    readings: [
      {
        title: "Hỏi trước khi bắt tay làm",
        text: "On Saturday, Bao visits a neighbourhood donation point to **help out**. The coordinator asks him to **sort out** clothes by size, while another volunteer checks the toys. People can **drop off** bags until noon. Bao notices that several boxes look the same, so he offers to **label** them with their contents. Before changing the system, he has a simple idea for colour labels and decides to **run it by** the coordinator. She suggests using large written labels as well, so everyone can identify the boxes easily.",
        vi: "Thứ Bảy, Bảo đến điểm quyên góp khu phố phụ giúp. Người điều phối nhờ anh phân loại quần áo theo cỡ, còn người khác kiểm tra đồ chơi. Mọi người có thể mang túi đến trước buổi trưa. Bảo thấy nhiều thùng giống nhau nên đề nghị ghi nhãn nội dung. Trước khi đổi cách sắp xếp, anh trình bày ý tưởng dùng nhãn màu với người điều phối. Cô đề nghị thêm chữ lớn để ai cũng nhận ra từng thùng.",
      },
      {
        title: "Bàn giao cho ca tiếp theo",
        text: "Before leaving, Bao writes a short note for the afternoon volunteers. There are still two bags to **sort out**, and a neighbour will **drop off** another box later. He asks a friend to **help out** with carrying the heavier items. They **label** the remaining bags clearly rather than leaving the next team to guess. Bao has an idea for a collection next month, but he wants to **run it by** the coordinator before choosing a date. He leaves her a message instead of announcing an unconfirmed event.",
        vi: "Trước khi về, Bảo để ghi chú cho nhóm buổi chiều. Vẫn còn hai túi cần phân loại và một hàng xóm sẽ mang thêm thùng đến. Anh nhờ bạn phụ chuyển đồ nặng. Họ ghi nhãn rõ các túi còn lại để nhóm sau không phải đoán. Bảo có ý tưởng tổ chức đợt nhận đồ tháng tới nhưng muốn hỏi người điều phối về vài ngày dự kiến trước. Anh nhắn cô thay vì công bố sự kiện chưa được xác nhận.",
      },
    ],
    dialogue: [
      ["Bao", "Hi, I’m here to help out. Where should I start?"],
      ["Coordinator", "Could you sort these clothes by size?"],
      ["Bao", "Sure. Should I label the boxes too?"],
      ["Coordinator", "Yes, please write the size clearly on each one."],
      ["Bao", "I have an idea for next month. Can I run it by you later?"],
      ["Coordinator", "Of course. Let’s talk after we finish this batch."],
    ],
    question: {
      prompt: "Vì sao người điều phối đề nghị thêm chữ lớn trên nhãn?",
      options: [
        "Để che màu của thùng",
        "Để ai cũng dễ nhận biết nội dung",
        "Để thay đổi ngày quyên góp",
      ],
      answer: 1,
      explanation: "Chữ rõ giúp nhận biết thùng mà không chỉ dựa vào màu sắc.",
    },
    recall: {
      prompt: "Điền cụm phụ giúp: Can I ____ with the boxes?",
      answer: "help out",
      explanation: "Help out with something là phụ giúp một việc cụ thể.",
    },
  },
];
