import React from "react";
import { ArrowRight } from "lucide-react";
import { FieldScene } from "../FieldScene.jsx";
import { sceneFor } from "./studio-data.js";
import ActionScene from "../ActionScene.jsx";
import { TopicTile } from "./StudioLibrary.jsx";
export function StudioHome({ c, motion }) {
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
      <section className="studio-home-next">
        <div>
          <span className="studio-kicker">LEARN IT IN A MOMENT</span>
          <h2>
            Nhìn hành động. <br />
            Nhớ cách nói.
          </h2>
          <p>
            Một cụm từ dễ hiểu hơn khi bạn nhìn thấy nó xảy ra. Thử với “pick it
            up”.
          </p>
          <button className="studio-link" onClick={() => c.nav("phrasal")}>
            Khám phá các tình huống <ArrowRight size={18} />
          </button>
        </div>
        <ActionScene kind="cafe" motion={motion} />
      </section>
      <section>
        <div className="studio-section-title">
          <h2>Bạn muốn bắt đầu ở đâu?</h2>
          <button className="studio-link" onClick={() => c.nav("topics")}>
            Tất cả chủ đề <ArrowRight size={17} />
          </button>
        </div>
        <div className="studio-topic-grid">
          {c.topics.slice(0, 3).map((t) => (
            <TopicTile key={t.id} topic={t} c={c} />
          ))}
        </div>
      </section>
    </>
  );
}
