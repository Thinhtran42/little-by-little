import React, { useState } from "react";
import { ArrowRight, RotateCcw } from "lucide-react";
import { FieldScene } from "../FieldScene.jsx";
import { mastery } from "../../progress.js";
import { sceneFor } from "./studio-data.js";
import { PhraseCard } from "./StudioLibrary.jsx";
export function StudioReview({ c }) {
  const [limit, setLimit] = useState(8),
    pool = c.due.length ? c.due : c.phrases.filter((p) => c.data.learned[p.id]);
  return (
    <>
      <section className="studio-review-lead">
        <div>
          <span className="studio-kicker">YOUR MEMORY, ONE STEP STRONGER</span>
          <h2>
            {c.due.length
              ? `${c.due.length} câu đang chờ bạn.`
              : "Hôm nay chưa có câu đến hạn."}
          </h2>
          <p>
            {pool.length
              ? "Một lượt ngắn để gọi lại điều đã học."
              : "Bắt đầu một chủ đề để tạo lịch ôn của riêng bạn."}
          </p>
          <button
            className="studio-button"
            onClick={() =>
              pool.length
                ? c.start(pool.slice(0, 10), "review")
                : c.nav("topics")
            }
          >
            {pool.length ? "Ôn tập ngay" : "Khám phá câu mới"}
            <ArrowRight size={18} />
          </button>
          {pool.length > 10 && (
            <small>
              Mỗi lượt tối đa 10 câu. Các câu còn lại vẫn trong lịch ôn.
            </small>
          )}
        </div>
        <RotateCcw size={86} strokeWidth={1} />
      </section>
      {c.due.slice(0, limit).map((p) => (
        <PhraseCard key={p.id} p={p} c={c} />
      ))}
      {limit < c.due.length && (
        <button className="studio-more" onClick={() => setLimit((v) => v + 8)}>
          Xem thêm câu đến hạn
        </button>
      )}
    </>
  );
}

export function StudioPath({ c }) {
  const [selected, setSelected] = useState(c.topics[0]?.id);
  const topic = c.topics.find((t) => t.id === selected),
    pool = c.phrases.filter((p) => p.topic === selected);
  return (
    <>
      <label className="studio-path-select">
        Hành trình của bạn
        <select
          value={selected || ""}
          onChange={(e) => setSelected(e.target.value)}
        >
          {c.topics.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
      </label>
      <div className="studio-library-banner">
        <FieldScene scene={sceneFor(selected)} title={topic?.name} />
        <div>
          <span className="studio-kicker">
            {Math.ceil(pool.length / 5)} BUỔI HỌC · 5 CÂU MỖI BUỔI
          </span>
          <h2>{topic?.name}</h2>
          <p>Học theo thứ tự hoặc chọn một buổi bạn muốn luyện lại.</p>
        </div>
      </div>
      <div className="studio-path-list">
        {Array.from({ length: Math.ceil(pool.length / 5) }, (_, i) => {
          const items = pool.slice(i * 5, i * 5 + 5),
            count = items.filter(
              (p) => mastery(c.data.learned[p.id]) === "strong",
            ).length;
          return (
            <button key={i} onClick={() => c.start(items)}>
              <span className="studio-step">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <small>
                  BUỔI {i + 1} · {count}/{items.length} CÂU NHỚ VỮNG
                </small>
                <h3>{items[0].en}</h3>
                <p>{items[0].vi}</p>
              </div>
              <ArrowRight size={20} />
            </button>
          );
        })}
      </div>
    </>
  );
}
