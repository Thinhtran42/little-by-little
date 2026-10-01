import React from "react";
import {
  ArrowRight,
  BookOpen,
  Briefcase,
  Route,
  MessageCircle,
  Bookmark,
  Compass,
} from "lucide-react";
export const studySections = {
  learn: [
    [
      "work-course",
      Briefcase,
      "4 tuần công việc",
      "20 buổi có thứ tự, từ trao đổi hằng ngày đến xử lý vấn đề.",
      "Bắt đầu ở đây nếu bạn cần tiếng Anh khi đi làm.",
    ],
    [
      "courses",
      BookOpen,
      "Lộ trình B1/B2",
      "Học cấu trúc, từ vựng và đọc hiểu trong cùng một bài.",
      "Chọn trình độ và tình huống phù hợp.",
    ],
    [
      "path",
      Route,
      "Lộ trình",
      "Các chặng ngắn, mỗi buổi luyện 5 câu từ kho câu.",
      "Dành cho lúc bạn chỉ có vài phút.",
    ],
  ],
  library: [
    [
      "topics",
      Compass,
      "Khám phá chủ đề",
      "Tìm câu nói trong 16 chủ đề đời sống và công việc.",
      "Kho câu",
    ],
    [
      "reading",
      BookOpen,
      "Đọc & từ vựng",
      "Đọc đoạn văn song ngữ, khám phá từ và hội thoại.",
      "Đọc theo ngữ cảnh",
    ],
    [
      "phrasal",
      BookOpen,
      "Phrasal verbs",
      "18 tình huống với flashcard, tự nhớ và ghép câu.",
      "Cụm động từ",
    ],
    [
      "practice",
      MessageCircle,
      "Luyện tập",
      "Nhập vai hội thoại và luyện phản hồi trong tình huống.",
      "Thực hành",
    ],
    [
      "saved",
      Bookmark,
      "Câu đã lưu",
      "Quay lại những cách nói bạn đã đánh dấu.",
      "Bộ sưu tập của bạn",
    ],
  ],
};
export function studyParent(page) {
  return Object.keys(studySections).find((key) =>
    studySections[key].some(([id]) => id === page),
  );
}
export default function StudyHubs({ kind, nav }) {
  return (
    <section
      className="study-hub"
      aria-label={kind === "learn" ? "Các khóa học" : "Các mục thư viện"}
    >
      {studySections[kind].map(([id, Icon, title, description, note]) => (
        <button
          key={id}
          className="study-hub-card"
          aria-label={title}
          onClick={() => nav(id)}
        >
          <Icon size={25} aria-hidden="true" />
          <div>
            <small>{note}</small>
            <h2>{title}</h2>
            <p>{description}</p>
          </div>
          <ArrowRight size={20} aria-hidden="true" />
        </button>
      ))}
    </section>
  );
}
