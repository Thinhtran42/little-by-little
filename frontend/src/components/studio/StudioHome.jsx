import React from "react";
import { ArrowRight } from "lucide-react";
import { RealPhoto as FieldScene } from "../RealPhoto.jsx";
import { sceneFor } from "./studio-data.js";

export function StudioHome({ c, motion, learningOverview }) {
  const recommended =
    c.topics.find((t) => t.id === c.daily[0]?.topic) || c.topics[0];
  return (
    <>
      <section className="studio-hero">
        <div className="studio-hero-copy">
          <span className="studio-kicker">MAKE ROOM FOR A LITTLE ENGLISH</span>
          <h2>
            Mở một câu.
            <br />
            Mở một cuộc trò chuyện.
          </h2>
          <p>
            {c.daily.length
              ? `${c.daily.length} câu trong kế hoạch hôm nay. Hình dung trước, tự nhớ sau.`
              : "Bạn đã hoàn thành kế hoạch hôm nay. Hẹn gặp lại vào ngày mai."}
          </p>
          <button
            className="studio-button"
            disabled={!c.daily.length}
            onClick={() => c.start(c.daily)}
          >
            {c.daily.length
              ? "Bắt đầu buổi học"
              : "Hoàn thành kế hoạch hôm nay"}
            <ArrowRight size={20} />
          </button>
          <button className="studio-hero-link" onClick={() => c.setSetup(true)}>
            {c.data.profile.onboarded ? "Chỉnh nhịp học" : "Bắt đầu thiết lập"}{" "}
            ↗
          </button>
          <button className="studio-hero-link" onClick={()=>c.nav('work-course')}>Khám phá khóa 4 tuần tiếng Anh công việc →</button>
        </div>
        <div className="studio-hero-art">
          <FieldScene
            scene={sceneFor(recommended?.id)}
            title={`Một khoảnh khắc: ${recommended?.name || "Cuộc sống hằng ngày"}`}
          />
          <span className="studio-art-caption">
            ENGLISH BELONGS IN YOUR EVERYDAY.
          </span>
          <span className="studio-sticker">
            Little steps,
            <br />
            <em>real conversations.</em>
          </span>
        </div>
      </section>
      <div className="studio-today">
        <span>NHỊP HÔM NAY</span>
        <p>
          <strong>{c.todayCount}</strong> câu đã học
        </p>
        <p>
          <strong>{c.due.length}</strong> câu đến hạn ôn
        </p>
        <button onClick={() => c.nav("review")}>
          Ghé góc ôn tập <ArrowRight size={17} />
        </button>
      </div>
      {learningOverview || <section className="studio-home-next">
        <div>
          <span className="studio-kicker">LEARN IT IN A MOMENT</span>
          <h2>
            Một câu chuyện. <br />
            Nhiều cách dùng.
          </h2>
          <p>
            Đọc tình huống qua ảnh thật, chạm vào từ mới và thử trả lời một cuộc
            trò chuyện.
          </p>
          <button className="studio-link" onClick={() => c.nav("reading")}>
            Mở bài đọc & từ vựng <ArrowRight size={18} />
          </button>
          <button className="studio-link" onClick={() => c.nav('courses')}>Học theo lộ trình B1/B2 <ArrowRight size={18}/></button>
        </div>
        <FieldScene scene="friends" />
      </section>}
      <div className="studio-home-links"><button className="studio-link" onClick={()=>c.nav('learn')}>Chọn khóa học →</button><button className="studio-link" onClick={()=>c.nav('library')}>Mở thư viện →</button></div>
    </>
  );
}
