export const stationLesson = {
  id: "station-pickup",
  version: 1,
  title: "Đón bạn ở ga",
  goal: "Hẹn chỗ đón, báo lúc khởi hành và nói thời gian cần quay về.",
  dialogue: [
    [
      "Linh",
      "My train arrives at five. Could you pick me up outside the station?",
    ],
    ["Mai", "Of course. I’ll set off in ten minutes."],
    ["Linh", "Thanks! I’ll wait near the main entrance with my suitcase."],
    ["Mai", "Is there anything else I should know?"],
    ["Linh", "I need to get back before seven. My sister is coming over."],
    ["Mai", "No problem. We should have plenty of time."],
  ],
  targets: [
    {
      en: "pick someone up",
      vi: "đón ai bằng xe",
      note: "Đại từ đứng giữa: pick me up. Không nói pick up me.",
    },
    {
      en: "set off",
      vi: "khởi hành",
      note: "Trong bài này là bắt đầu chuyến đi: set off in ten minutes.",
    },
    {
      en: "get back",
      vi: "quay về",
      note: "Nói về việc trở lại: get back before seven.",
    },
  ],
  questions: [
    {
      id: "pickup",
      prompt: "Bạn nhờ Mai đón mình: “Could you ___ outside the station?”",
      answer: "pick me up",
      alternatives: [],
      explanation: "Me là đại từ nên nằm giữa pick và up.",
      sense: "pickup-person",
    },
    {
      id: "depart",
      prompt: "Mai sẽ khởi hành sau 10 phút: “I’ll ___ in ten minutes.”",
      answer: "set off",
      alternatives: [],
      explanation: "Set off diễn tả bắt đầu chuyến đi.",
      sense: "depart",
    },
    {
      id: "return",
      prompt: "Bạn cần quay về trước 7 giờ: “I need to ___ before seven.”",
      answer: "get back",
      alternatives: [],
      explanation: "Get back là quay về nơi bạn đã rời đi.",
      sense: "return",
    },
    {
      id: "transfer",
      prompt:
        "Đổi tình huống: nhờ bạn đón em gái ở trường. “Could you ___ outside her school?” (dùng her)",
      answer: "pick her up",
      alternatives: [],
      explanation: "Đổi me thành her và vẫn đặt đại từ giữa pick và up.",
      sense: "pickup-person",
    },
  ],
};
