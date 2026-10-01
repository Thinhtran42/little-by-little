// Original comprehension prompts; practice only, separate from scored checkpoints.
const rows = [
  [
    "introduce",
    "Who handles customer reports?",
    ["Linh on the support team", "Alex on the sales team", "A new customer"],
    0,
    "Linh nói “I’m in charge of checking customer reports.” In charge of chỉ trách nhiệm.",
  ],
  [
    "clarify",
    "What should the writer confirm before starting?",
    ["Only the font size", "The length and deadline", "Who will print it"],
    1,
    "“Short” và “soon” đều chưa rõ. Đoạn đọc chốt một trang và hạn thứ Năm.",
  ],
  [
    "schedule",
    "Why mention the meeting topic when confirming?",
    ["To cancel the draft", "To extend the meeting", "To help Sam prepare"],
    2,
    "Người viết nói trước nội dung thảo luận để Sam chuẩn bị cho cuộc hẹn 15 phút.",
  ],
  [
    "reschedule",
    "What makes the rescheduling request useful?",
    [
      "Offering two possible times",
      "Sending no explanation",
      "Asking the team to cancel everything",
    ],
    0,
    "Đưa hai giờ thay thế giúp người nhận chọn, thay vì phải tự giải quyết toàn bộ xung đột lịch.",
  ],
  [
    "review-one",
    "Which details are still missing?",
    [
      "The colleague’s home address",
      "The month and file format",
      "The date of a holiday",
    ],
    1,
    "Cần hỏi tháng của số liệu bán hàng và định dạng mong muốn trước khi cam kết.",
  ],
  [
    "update",
    "What is happening now?",
    [
      "The final report is already approved",
      "The survey is being written",
      "The findings are being put into a chart",
    ],
    2,
    "Khảo sát đã được kiểm tra xong; hiện người viết đang đưa kết quả chính vào biểu đồ.",
  ],
  [
    "request-help",
    "What does Noor need to do?",
    [
      "Check one figure against the source",
      "Rewrite the entire report",
      "Wait until every section is finished",
    ],
    0,
    "Lời nhờ hỗ trợ có phạm vi cụ thể: kiểm tra một số liệu không khớp với file nguồn.",
  ],
  [
    "followup",
    "Why is a reply needed?",
    [
      "The file must be deleted",
      "Approval is needed before ordering",
      "The meeting has been cancelled",
    ],
    1,
    "Cần phê duyệt ngân sách trước khi đặt hàng, nên lời nhắc nêu lý do và hạn phản hồi.",
  ],
  [
    "priorities",
    "What does the manager agree to change?",
    [
      "Cancel both tasks",
      "Finish both tasks today",
      "Move the internal notes to Friday",
    ],
    2,
    "Ưu tiên bản tóm tắt cho khách hàng; ghi chú nội bộ chuyển sang thứ Sáu.",
  ],
  [
    "review-two",
    "When can the report be sent on Friday?",
    [
      "If approval arrives tomorrow",
      "Even if nobody approves it",
      "Only after a new survey",
    ],
    0,
    "Đây là cam kết có điều kiện: gửi thứ Sáu nếu ngày mai nhận được phê duyệt.",
  ],
  [
    "phone",
    "What should happen if the customer is busy?",
    [
      "Speak faster without asking",
      "Offer to call back",
      "Skip the introduction",
    ],
    1,
    "Hỏi xem có tiện nói chuyện không và đề nghị gọi lại nếu khách đang bận.",
  ],
  [
    "connection",
    "Why request the reference number in a message?",
    [
      "To avoid contacting the customer",
      "To change the delivery date",
      "To keep a written record",
    ],
    2,
    "Tin nhắn tạo bản ghi bằng chữ khi đường truyền khiến việc nghe số dễ sai.",
  ],
  [
    "problem",
    "What is the temporary workaround?",
    [
      "Send a PDF copy",
      "Blame the two colleagues",
      "Delete the original report",
    ],
    0,
    "File PDF là cách tạm thời để tiếp tục công việc trong khi đội hỗ trợ kiểm tra quyền truy cập.",
  ],
  [
    "delay",
    "What should the writer avoid promising?",
    ["A further update", "An unapproved discount", "An available alternative"],
    1,
    "Không cam kết giảm giá ngoài thẩm quyền. Có thể giải thích chậm trễ và hẹn cập nhật.",
  ],
  [
    "review-three",
    "What is safe to say about a replacement?",
    [
      "It is definitely available",
      "It has already been sent",
      "I will check and get back to you",
    ],
    2,
    "Chưa biết có hàng thay thế hay không; cần kiểm tra rồi phản hồi, không tự đoán.",
  ],
  [
    "suggest",
    "What is the proposed trial?",
    [
      "Send updates before meetings for two weeks",
      "Stop all meetings permanently",
      "Make every meeting longer",
    ],
    0,
    "Thử gửi cập nhật bằng văn bản trước buổi họp trong hai tuần để dành thời gian họp cho quyết định.",
  ],
  [
    "disagree",
    "Which alternative protects reliability?",
    [
      "Remove the final test",
      "Reduce scope but keep the test",
      "Ignore the launch date entirely",
    ],
    1,
    "Người nói thừa nhận áp lực thời gian, nhưng đề nghị giảm phạm vi thay vì bỏ kiểm thử cuối.",
  ],
  [
    "scope",
    "What trade-off should the client choose?",
    [
      "The team’s lunch time",
      "The colour of the report",
      "Keep the date or include the new feature later",
    ],
    2,
    "Có thể giữ hạn với tính năng đã thống nhất, hoặc dời hạn để thêm và kiểm thử tính năng mới.",
  ],
  [
    "handover",
    "What should the colleague confirm?",
    [
      "They can access the current files",
      "They will never need approval",
      "Every open issue has disappeared",
    ],
    0,
    "Bàn giao cần kiểm tra quyền truy cập, không chỉ gửi một danh sách đường dẫn.",
  ],
  [
    "review-four",
    "Why offer two options before handing over?",
    [
      "To hide the testing delay",
      "To let the client choose scope versus timing",
      "To promise every feature immediately",
    ],
    1,
    "Tính năng email cần thêm ba ngày kiểm thử; lựa chọn của khách quyết định việc người tiếp quản cần làm.",
  ],
];
export const workComprehension = Object.fromEntries(
  rows.map(([id, prompt, options, answer, explanation]) => [
    `work-${id}`,
    { prompt, options, answer, explanation },
  ]),
);

export function normalizeDictation(value) {
  return value
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[‘’]/g, "'")
    .replace(/[^\p{L}\p{N}\s']/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}
export function matchesDictation(input, target) {
  return normalizeDictation(input) === normalizeDictation(target);
}
