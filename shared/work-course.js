// Original workplace course. Stable assessment IDs; increase version if answers change.
export const workWeeks = [
  {
    title: "Bắt đầu trao đổi",
    goal: "Giới thiệu vai trò, hỏi rõ yêu cầu và hẹn thời gian.",
    photo: "work",
  },
  {
    title: "Phối hợp mỗi ngày",
    goal: "Báo tiến độ, nhờ hỗ trợ và xác nhận việc cần làm.",
    photo: "plans",
  },
  {
    title: "Xử lý khi có vấn đề",
    goal: "Trao đổi qua cuộc gọi, giải thích sự cố và đề xuất cách xử lý.",
    photo: "phone",
  },
  {
    title: "Nói rõ quan điểm",
    goal: "Thương lượng phạm vi, đưa lý do và bàn giao công việc.",
    photo: "work",
  },
];
const q = (prompt, answer, explanation, alternatives = []) => ({
  mode: "recall",
  prompt: prompt.replace(/^Điền (?!giới từ|dạng)[a-z]+: /, "Hoàn thành câu: "),
  answer,
  explanation,
  alternatives,
});
const units = [
  [
    "introduce",
    "Giới thiệu mà không kể lan man",
    "Bạn mới vào nhóm dự án. Nói vai trò của mình và hỏi ai phụ trách phần còn lại.",
    "Hi, I’m Linh. I work on the support team. I’m in charge of checking customer reports. This week, I’m helping with the new booking system. Who should I contact about technical questions?",
    [
      "I’m in charge of checking the reports.",
      "Who should I contact about this?",
      "It’s good to meet you.",
    ],
    [
      "Hi, I’m Linh. I’m joining the support team.",
      "Welcome! I’m Alex, the project coordinator.",
      "Who should I contact about the booking system?",
      "Mina can help with technical questions.",
    ],
    [
      q(
        "Điền giới từ: I’m in charge ___ checking the reports.",
        "of",
        "In charge of + danh từ hoặc V-ing.",
      ),
      q(
        "Điền contact: Who should I ___ about the schedule?",
        "contact",
        "Contact someone about something.",
      ),
      q("Điền meet: It’s good to ___ you.", "meet", "To + động từ nguyên mẫu."),
    ],
    "Giới thiệu bản thân trong 3 câu: vai trò, việc đang làm và một câu hỏi cho đồng nghiệp.",
  ],
  [
    "clarify",
    "Hỏi lại trước khi làm",
    "Yêu cầu “gửi sớm” chưa có thời hạn rõ. Hỏi cụ thể thay vì tự đoán.",
    "My manager asks for a short report soon. Before I start, I check what “short” means and when the report is needed. A one-page summary by Thursday is more useful than a long document on Friday. I repeat the agreement to make sure we understand each other.",
    [
      "Could you clarify what you mean by “soon”?",
      "Do you mean a one-page summary?",
      "Just to confirm, you need it by Thursday.",
    ],
    [
      "Could you clarify the deadline?",
      "I need the summary by Thursday afternoon.",
      "Do you mean a one-page document?",
      "Yes, just the main findings.",
    ],
    [
      q(
        "Điền clarify: Could you ___ the deadline?",
        "clarify",
        "Clarify là làm rõ thông tin.",
      ),
      q(
        "Điền mean: Do you ___ a one-page summary?",
        "mean",
        "Do you mean…? kiểm tra cách hiểu.",
      ),
      q(
        "Điền giới từ hạn chót: Please send it ___ Thursday.",
        "by",
        "By Thursday là chậm nhất vào thứ Năm.",
      ),
    ],
    "Viết 2 câu hỏi để làm rõ một yêu cầu chưa có thời hạn và định dạng.",
  ],
  [
    "schedule",
    "Hẹn một cuộc trao đổi ngắn",
    "Bạn cần hỏi đồng nghiệp trong 15 phút, nhưng chưa biết lúc nào họ rảnh.",
    "I need fifteen minutes with Sam to check the draft. Instead of sending a calendar invitation immediately, I ask whether Tuesday morning works for him. He suggests ten thirty. I confirm the time and mention what we will discuss so he can prepare.",
    [
      "Would Tuesday morning work for you?",
      "Are you available at ten thirty?",
      "Let’s set up a fifteen-minute call.",
    ],
    [
      "Would Tuesday morning work for you?",
      "Yes, but not before ten.",
      "Are you available at ten thirty?",
      "That works. Please send me the draft first.",
    ],
    [
      q(
        "Điền work: Would Friday afternoon ___ for you?",
        "work",
        "Work for someone: phù hợp với ai.",
      ),
      q(
        "Điền available: Are you ___ at two?",
        "available",
        "Available: rảnh hoặc sẵn sàng.",
      ),
      q(
        "Điền cụm sắp xếp: Let’s ___ a short call.",
        "set up",
        "Set up a call: thu xếp cuộc gọi.",
      ),
    ],
    "Đề xuất một giờ họp, nêu thời lượng và mục đích trong 3 câu.",
  ],
  [
    "reschedule",
    "Đổi lịch có phương án thay thế",
    "Một việc gấp khiến bạn không dự được cuộc hẹn đã đặt.",
    "A client call now overlaps with our team meeting. I explain the conflict briefly and ask to move our meeting. I suggest two possible times rather than leaving the other person to solve the problem. Once we agree, I update the invitation and thank them for being flexible.",
    [
      "Could we move our meeting to Thursday?",
      "I’m sorry for the short notice.",
      "Would either of these times work?",
    ],
    [
      "I’m sorry for the short notice. Could we move our meeting?",
      "Sure. What time do you suggest?",
      "Would Thursday at two or Friday at ten work?",
      "Thursday at two is fine.",
    ],
    [
      q(
        "Điền giới từ: Could we move the call ___ Friday?",
        "to",
        "Move something to + thời điểm mới.",
      ),
      q(
        "Điền notice: Sorry for the short ___.",
        "notice",
        "Short notice: báo trước ít thời gian.",
      ),
      q(
        "Điền either: Would ___ of these two times work?",
        "either",
        "Either of these two times: một trong hai giờ.",
      ),
    ],
    "Soạn tin nhắn đổi lịch có lời xin lỗi và hai thời gian thay thế.",
  ],
  [
    "review-one",
    "Thử sức: phối hợp với đồng nghiệp mới",
    "Một đồng nghiệp mới nhờ bạn gửi “một số số liệu sớm”. Bạn cần chốt yêu cầu và hẹn trao đổi.",
    "You are helping a colleague from another team. They need sales figures but have not said which month or format they want. You are available on Wednesday afternoon. Ask for the missing details, propose a short call, and confirm the agreed deadline without promising more than you can deliver.",
    [
      "Could you clarify which month you need?",
      "Would Wednesday afternoon work for you?",
      "Just to confirm, I’ll send the file by Friday.",
    ],
    [
      "Could you clarify which figures you need?",
      "The May sales figures, in a spreadsheet.",
      "Would Wednesday afternoon work for a short call?",
      "Yes. We can confirm the details then.",
    ],
    [
      q(
        "Tình huống mới: Could you ___ which month you need? (làm rõ)",
        "clarify",
        "Hỏi rõ phạm vi trước khi bắt đầu.",
      ),
      q(
        "Would Wednesday ___ for you? (phù hợp)",
        "work",
        "Work for you: thuận tiện với bạn.",
      ),
      q(
        "I will send the file ___ Friday. (chậm nhất)",
        "by",
        "By cho hạn chót; on cho một ngày cụ thể.",
      ),
    ],
    "Viết tin nhắn 4 câu: hỏi tháng cần lấy số liệu, hỏi định dạng, đề xuất giờ gọi và xác nhận hạn gửi.",
  ],
  [
    "update",
    "Báo tiến độ trong ba câu",
    "Bạn đang làm báo cáo. Đồng nghiệp cần biết phần xong, phần đang làm và bước tiếp theo.",
    "I have finished checking the survey responses. I’m now putting the main findings into a chart. The report is on track for Thursday. I’ll send the first draft tomorrow morning so the team has time to comment before I prepare the final version.",
    [
      "I’ve finished checking the responses.",
      "I’m currently working on the chart.",
      "We’re on track for Thursday.",
    ],
    [
      "How is the report going?",
      "I’ve finished checking the data.",
      "What are you working on now?",
      "The chart. I’ll send a draft tomorrow.",
    ],
    [
      q(
        "Điền finished: I’ve ___ checking the data.",
        "finished",
        "Have finished + V-ing.",
      ),
      q(
        "Điền giới từ: I’m working ___ the chart.",
        "on",
        "Work on a task: đang làm việc gì.",
      ),
      q(
        "Điền track: We’re on ___ for Thursday.",
        "track",
        "On track: đang theo đúng kế hoạch.",
      ),
    ],
    "Báo tiến độ một việc thật bằng 3 câu: xong gì, đang làm gì, tiếp theo là gì.",
  ],
  [
    "request-help",
    "Nhờ giúp mà vẫn rõ trách nhiệm",
    "Bạn bị vướng một mục trong báo cáo và cần người khác kiểm tra.",
    "I can complete most of the report myself, but one figure does not match the source file. I ask Noor to check that figure rather than asking her to redo the whole report. I explain where the source is and when I need her reply. Meanwhile, I continue working on the other sections.",
    [
      "Could you help me check this figure?",
      "The source file is in the shared folder.",
      "Could you get back to me by three?",
    ],
    [
      "Could you help me check one figure?",
      "Sure. Where is the source file?",
      "It’s in the shared folder. Could you get back to me by three?",
      "Yes. I’ll check it after lunch.",
    ],
    [
      q(
        "Điền check: Could you help me ___ this figure?",
        "check",
        "Help someone check / help someone to check.",
      ),
      q(
        "Điền shared: The file is in the ___ folder.",
        "shared",
        "Shared folder: thư mục dùng chung.",
      ),
      q(
        "Điền cụm phản hồi: Could you ___ me by three?",
        "get back to",
        "Get back to someone: phản hồi cho ai.",
      ),
    ],
    "Nhờ kiểm tra một việc cụ thể, cho biết tài liệu ở đâu và hạn cần phản hồi.",
  ],
  [
    "followup",
    "Nhắc lại một việc đang chờ",
    "Bạn chưa nhận được câu trả lời cho email gửi đầu tuần.",
    "I sent the updated budget on Monday and have not heard back yet. I send a short follow-up message with the original file attached. I explain that we need approval before placing the order. I ask whether the recipient needs any further information and give a clear date for the reply.",
    [
      "I’m following up on the budget email.",
      "Could you confirm whether it is approved?",
      "Please let me know if you need more information.",
    ],
    [
      "I’m following up on Monday’s email.",
      "Thanks. I haven’t reviewed the budget yet.",
      "Could you let me know by tomorrow afternoon?",
      "Yes. I’ll review it this evening.",
    ],
    [
      q(
        "Điền giới từ: I’m following up ___ the budget email.",
        "on",
        "Follow up on something: tiếp tục hỏi về việc đó.",
      ),
      q(
        "Điền confirm: Could you ___ whether it is approved?",
        "confirm",
        "Confirm: xác nhận.",
      ),
      q(
        "Điền know: Please let me ___ if you need more details.",
        "know",
        "Let me know: cho tôi biết.",
      ),
    ],
    "Viết email nhắc việc gồm nội dung đang chờ, lý do cần phản hồi và hạn trả lời.",
  ],
  [
    "priorities",
    "Chốt việc nào làm trước",
    "Hai yêu cầu cùng đến. Bạn cần quản lý xác nhận ưu tiên.",
    "Two tasks are due tomorrow, but both will take most of the day. I tell my manager what I can realistically finish and ask which task should come first. We agree to prioritise the client summary and move the internal notes to Friday. I confirm the change in writing so neither task is forgotten.",
    [
      "Which task should I prioritise?",
      "I can finish the summary today.",
      "The notes will need to wait until Friday.",
    ],
    [
      "Which task should I prioritise?",
      "The client summary is more urgent.",
      "Then the internal notes will need to wait until Friday.",
      "Agreed. Please update the task list.",
    ],
    [
      q(
        "Điền prioritise: Which task should I ___?",
        "prioritise",
        "Prioritise/prioritize: ưu tiên.",
        ["prioritize"],
      ),
      q(
        "Điền urgent: The client summary is more ___.",
        "urgent",
        "Urgent: gấp, cần làm sớm.",
      ),
      q(
        "Điền until: The notes can wait ___ Friday.",
        "until",
        "Wait until + thời điểm.",
      ),
    ],
    "Nêu hai việc cạnh tranh thời gian, hỏi ưu tiên và xác nhận hạn mới.",
  ],
  [
    "review-two",
    "Thử sức: dự án chưa xong",
    "Bạn đã kiểm tra dữ liệu nhưng thiếu phê duyệt để hoàn tất báo cáo.",
    "The data review is complete, but the final report still needs approval from another team. Your manager asks for an update. Explain what is finished, identify the missing approval, and ask who can help. If approval arrives tomorrow, you can send the report on Friday. Make that condition clear.",
    [
      "The data review is complete.",
      "We’re waiting for approval.",
      "If we receive it tomorrow, we can send the report on Friday.",
    ],
    [
      "What is the current status?",
      "The data review is complete. We’re waiting for approval.",
      "Who can help us get it?",
      "Noor. I’ll follow up with her today.",
    ],
    [
      q(
        "Điền giới từ: We’re waiting ___ approval.",
        "for",
        "Wait for something: chờ điều gì.",
      ),
      q(
        "Điền finished: I’ve ___ checking the data.",
        "finished",
        "Nêu rõ phần đã hoàn tất.",
      ),
      q(
        "If approval arrives tomorrow, we ___ send the report on Friday. (có thể)",
        "can",
        "Điều kiện rõ ràng, không hứa chắc khi còn phụ thuộc.",
      ),
    ],
    "Viết cập nhật 4 câu có phần đã xong, trở ngại, đề nghị hỗ trợ và mốc hoàn thành có điều kiện.",
  ],
  [
    "phone",
    "Mở đầu một cuộc gọi",
    "Bạn gọi cho khách để xác nhận thông tin đơn hàng.",
    "Before calling, I write down the order number and the two details I need to confirm. When the customer answers, I introduce myself and explain why I am calling. I ask whether it is a good time to talk. If they are busy, I offer to call back rather than rushing through the information.",
    [
      "I’m calling about your order.",
      "Is now a good time to talk?",
      "I can call you back this afternoon.",
    ],
    [
      "Hello, I’m calling about order 42. Is now a good time?",
      "I only have a minute.",
      "Would you prefer me to call back this afternoon?",
      "Yes, please call after three.",
    ],
    [
      q(
        "Điền about: I’m calling ___ your order.",
        "about",
        "Call about something: gọi về việc gì.",
      ),
      q(
        "Điền time: Is now a good ___ to talk?",
        "time",
        "Hỏi người nghe có tiện trao đổi không.",
      ),
      q(
        "Điền cụm gọi lại: I can ___ this afternoon. (gọi lại cho bạn)",
        "call you back",
        "Đại từ you đứng giữa call và back.",
      ),
    ],
    "Nói lời mở đầu cuộc gọi có tên, mục đích và câu hỏi người nghe có tiện không.",
  ],
  [
    "connection",
    "Khi nghe không rõ",
    "Cuộc gọi có tiếng nhiễu và một con số quan trọng chưa nghe chắc.",
    "The connection becomes unclear just as the customer gives a delivery date. I say that the line is breaking up and ask them to repeat the date. I read it back slowly to check that I heard correctly. For the reference number, I ask them to send a message as well so we have a written record.",
    [
      "The line is breaking up.",
      "Could you repeat the date, please?",
      "Let me read that back to you.",
    ],
    [
      "Sorry, the line is breaking up. Could you repeat the date?",
      "The twenty-third of May.",
      "Let me read that back: the twenty-third of May?",
      "That’s right.",
    ],
    [
      q(
        "Điền breaking: The line is ___ up.",
        "breaking",
        "Breaking up: tín hiệu bị ngắt quãng.",
      ),
      q(
        "Điền repeat: Could you ___ the number?",
        "repeat",
        "Repeat: nhắc lại.",
      ),
      q(
        "Điền back: Let me read that ___ to you.",
        "back",
        "Read back: đọc lại để kiểm tra.",
      ),
    ],
    "Xin nhắc lại một con số và đọc lại để xác nhận, không giả vờ đã hiểu.",
  ],
  [
    "problem",
    "Báo lỗi không đổ trách nhiệm",
    "Một tệp báo cáo không mở được. Bạn cần mô tả vấn đề đủ cụ thể.",
    "The report opens on my laptop, but two colleagues cannot access it. Instead of assuming they have made a mistake, I describe what we know. I share the link, the error message, and the time the problem started. I ask the support team to look into the issue and offer a PDF copy as a temporary workaround.",
    [
      "Two colleagues cannot access the file.",
      "Could you look into the issue?",
      "Here is a temporary workaround.",
    ],
    [
      "Two colleagues cannot access the report.",
      "What error message do they see?",
      "It says “access denied”. Could you look into it?",
      "Yes. Please send me the link.",
    ],
    [
      q(
        "Điền access: I cannot ___ the file.",
        "access",
        "Access là động từ trực tiếp, không cần to ở đây.",
      ),
      q(
        "Điền cụm điều tra: Could you ___ the issue?",
        "look into",
        "Look into it, không look it into.",
      ),
      q(
        "Điền temporary: Here is a ___ workaround.",
        "temporary",
        "Temporary workaround: cách xử lý tạm thời.",
      ),
    ],
    "Báo sự cố bằng dữ kiện: ai gặp, lỗi gì, lúc nào; sau đó đề nghị bước tiếp theo.",
  ],
  [
    "delay",
    "Thông báo trễ có trách nhiệm",
    "Một đầu việc bị chậm. Bạn cần cập nhật trước khi người khác phải hỏi.",
    "The supplier has delayed a component, so our delivery will be two days late. I tell the customer as soon as the new date is confirmed. I explain the impact, apologise, and offer an available alternative. I avoid promising a discount that I do not have authority to approve. I also say when I will send the next update.",
    [
      "I’m sorry for the delay.",
      "The revised delivery date is Friday.",
      "I’ll send another update tomorrow.",
    ],
    [
      "I’m sorry for the delay. The delivery will arrive on Friday.",
      "That affects our installation date.",
      "We can offer a temporary replacement if that helps.",
      "Please send the details in writing.",
    ],
    [
      q(
        "Điền for: I’m sorry ___ the delay.",
        "for",
        "Sorry for + danh từ/V-ing.",
      ),
      q(
        "Điền revised: The ___ delivery date is Friday.",
        "revised",
        "Revised: đã được điều chỉnh.",
      ),
      q(
        "Điền update: I’ll send another ___ tomorrow.",
        "update",
        "Hẹn thời điểm cập nhật tiếp theo.",
      ),
    ],
    "Thông báo trễ: xin lỗi, ngày mới, ảnh hưởng hoặc phương án và lần cập nhật tiếp theo.",
  ],
  [
    "review-three",
    "Thử sức: xác nhận lại qua điện thoại",
    "Khách nghe không rõ ngày giao mới và yêu cầu xác nhận bằng văn bản.",
    "A customer calls about a delayed delivery. The line is poor. You need to repeat the revised date, check that the customer has understood it, and offer a written confirmation. You do not yet know whether a replacement is available. Promise to check and respond, rather than inventing an answer.",
    [
      "Let me repeat the revised date.",
      "I’ll confirm that in an email.",
      "I’ll check and get back to you.",
    ],
    [
      "Could you repeat the new delivery date?",
      "Friday, the sixth of June. I’ll confirm that in an email.",
      "Can you provide a replacement?",
      "I’ll check and get back to you this afternoon.",
    ],
    [
      q(
        "Điền repeat: Let me ___ the revised date.",
        "repeat",
        "Lặp lại thông tin bị nghe thiếu.",
      ),
      q(
        "Điền confirm: I’ll ___ that in an email.",
        "confirm",
        "Xác nhận bằng văn bản.",
      ),
      q(
        "I’ll check and ___ you. (phản hồi lại)",
        "get back to",
        "Không cam kết khi chưa kiểm tra.",
      ),
    ],
    "Viết hoặc nói 4 lượt thoại xử lý cuộc gọi: nhắc ngày mới, xác nhận bằng email và hẹn phản hồi điều chưa biết.",
  ],
  [
    "suggest",
    "Đề xuất có lý do",
    "Bạn có cách cải thiện buổi họp hằng tuần.",
    "Our weekly meeting often runs over time. I suggest sending written updates beforehand so the meeting can focus on decisions. I explain the benefit and propose trying the change for two weeks. I invite the team to raise concerns rather than presenting my idea as the only sensible option.",
    [
      "I suggest sending updates beforehand.",
      "This would give us more time for decisions.",
      "Could we try it for two weeks?",
    ],
    [
      "I suggest sending updates before the meeting.",
      "How would that help?",
      "It would give us more time for decisions.",
      "Let’s try it for two weeks.",
    ],
    [
      q(
        "Điền dạng send: I suggest ___ an update.",
        "sending",
        "Suggest + V-ing, không suggest to send.",
      ),
      q(
        "Điền would: This ___ give us more time.",
        "would",
        "Would nói về lợi ích giả định của đề xuất.",
      ),
      q(
        "Điền try: Could we ___ it for two weeks?",
        "try",
        "Thử có thời hạn giúp đánh giá kết quả.",
      ),
    ],
    "Đưa một đề xuất, giải thích lợi ích và đề nghị thời gian thử.",
  ],
  [
    "disagree",
    "Không đồng ý nhưng vẫn hợp tác",
    "Một ý tưởng có lợi nhưng bạn lo về rủi ro.",
    "A colleague suggests removing the final test to meet the launch date. I acknowledge the time pressure, then explain my concern about reliability. I point out a previous issue without blaming anyone. Instead of simply saying no, I suggest reducing the scope while keeping the test. The team can compare both options.",
    [
      "I see your point, but I’m concerned about reliability.",
      "Could we consider a smaller release?",
      "That would let us keep the final test.",
    ],
    [
      "Could we skip the final test?",
      "I see your point, but I’m concerned about reliability.",
      "What would you suggest?",
      "Could we consider a smaller release instead?",
    ],
    [
      q(
        "Điền point: I see your ___, but I have a concern.",
        "point",
        "I see your point: tôi hiểu ý bạn.",
      ),
      q(
        "Điền about: I’m concerned ___ reliability.",
        "about",
        "Concerned about + vấn đề.",
      ),
      q(
        "Điền consider: Could we ___ another option?",
        "consider",
        "Consider + danh từ/V-ing.",
      ),
    ],
    "Phản hồi một đề xuất: ghi nhận ý, nêu lo ngại và đưa lựa chọn thay thế.",
  ],
  [
    "scope",
    "Thương lượng phạm vi và thời hạn",
    "Khách muốn thêm chức năng nhưng giữ nguyên ngày bàn giao.",
    "The client requests another feature two days before delivery. We explain that adding it would require more testing. We can keep the original date if we deliver the agreed features first, or move the date to include the new feature. We ask which option matters more to the client and confirm the decision in writing.",
    [
      "We can keep the date if we reduce the scope.",
      "Adding this feature would require more testing.",
      "Which option would you prefer?",
    ],
    [
      "Can you include the extra feature by Friday?",
      "We would need more testing time.",
      "What are our options?",
      "Keep Friday for the original scope, or move the date for the extra feature.",
    ],
    [
      q(
        "Điền if: We can keep the date ___ we reduce the scope.",
        "if",
        "If nêu điều kiện của cam kết.",
      ),
      q(
        "Điền require: Adding this would ___ more testing.",
        "require",
        "Require: cần hoặc đòi hỏi.",
      ),
      q(
        "Điền prefer: Which option would you ___?",
        "prefer",
        "Hỏi lựa chọn ưu tiên.",
      ),
    ],
    "Đưa hai phương án rõ đánh đổi giữa phạm vi và thời hạn; hỏi khách ưu tiên điều gì.",
  ],
  [
    "handover",
    "Bàn giao để người khác tiếp tục được",
    "Bạn sắp nghỉ phép và cần bàn giao một đầu việc.",
    "Before taking leave, I prepare a short handover note. It lists completed work, open issues, and the next deadline. I link to the current files and identify the person who can approve changes. I ask my colleague to confirm that they can access everything. A brief call helps us catch any missing details before I leave.",
    [
      "Here is the current status.",
      "The next step is to confirm the delivery date.",
      "Please let me know if anything is unclear.",
    ],
    [
      "Here is the handover note. Can you access the files?",
      "Yes. What is the next step?",
      "Confirm the delivery date with Noor by Thursday.",
      "Understood. I’ll contact her tomorrow.",
    ],
    [
      q(
        "Điền current: Here is the ___ status.",
        "current",
        "Current status: tình trạng hiện tại.",
      ),
      q(
        "Điền step: The next ___ is to confirm the date.",
        "step",
        "Next step: bước tiếp theo.",
      ),
      q(
        "Điền unclear: Let me know if anything is ___.",
        "unclear",
        "Unclear: chưa rõ; mời người nhận hỏi lại.",
      ),
    ],
    "Viết bàn giao 4 câu: tình trạng, việc còn lại, người liên hệ và hạn kế tiếp.",
  ],
  [
    "review-four",
    "Thử sức cuối khóa: chốt một dự án",
    "Kết hợp cập nhật, thương lượng và bàn giao trong một tình huống mới.",
    "Your team has completed the core booking feature. A client wants an additional reminder email before launch. Testing the new feature would take three more days. You will be away next week, so a colleague must continue the work. Write a clear update, offer two realistic options, and explain what the colleague should do once the client chooses.",
    [
      "The core feature is complete.",
      "We can keep the launch date if we deliver the original scope.",
      "The next step is to confirm the client’s choice.",
    ],
    [
      "Can we add reminder emails before launch?",
      "That would require three more days of testing.",
      "Could we launch the core feature first?",
      "Yes. I’ll confirm the scope and hand over the next steps to Noor.",
    ],
    [
      q(
        "Điền complete: The core feature is ___. (hoàn tất)",
        "complete",
        "Phân biệt phần đã xong với yêu cầu mới.",
        ["completed"],
      ),
      q(
        "We can keep the date ___ we deliver only the original scope.",
        "if",
        "Cam kết có điều kiện rõ.",
      ),
      q(
        "The next ___ is to confirm the client’s choice.",
        "step",
        "Nêu hành động cụ thể sau quyết định.",
      ),
    ],
    "Viết email 6–8 câu: trạng thái, yêu cầu thêm, ảnh hưởng thời gian, hai lựa chọn, người tiếp quản và việc cần xác nhận.",
  ],
];
export const workLessons = units.map((u, i) => ({
  id: "work-" + u[0],
  version: 1,
  week: Math.floor(i / 5),
  day: (i % 5) + 1,
  title: u[1],
  context: u[2],
  reading: u[3],
  phrases: u[4],
  dialogue: u[5],
  questions: u[6].map((question, n) => ({
    ...question,
    id: "recall-" + (n + 1),
  })),
  task: u[7],
  review: i % 5 === 4,
  photo: workWeeks[Math.floor(i / 5)].photo,
}));
export function workStatus(unit, attempts, today) {
  const rows = attempts.filter(
    (a) => a.lesson_id === unit.id && a.version === unit.version,
  );
  return {
    answered: rows.length,
    correct: rows.filter((a) => a.correct && !a.hinted).length,
    due: rows.filter((a) => a.due_day <= today).length,
  };
}
