import React, { useState, useEffect } from "react";
import { ArrowRight, Bookmark, Volume2, Check } from "lucide-react";
import { FieldScene } from "../FieldScene.jsx";
import { mastery } from "../../progress.js";
import { sceneFor, typeNames } from "./studio-data.js";
export function TopicTile({ topic: t, c }) {
  const pool = c.phrases.filter((p) => p.topic === t.id),
    seen = pool.filter((p) => c.data.learned[p.id]).length;
  return (
    <button
      className="studio-topic"
      onClick={() => {
        c.nav("topics");
        c.setTopic(t.id);
      }}
    >
      <div className="studio-topic-art">
        <FieldScene scene={sceneFor(t.id)} title={t.name} />
        <span>{pool.length} câu</span>
      </div>
      <div className="studio-topic-body">
        <span className="studio-kicker">{t.en}</span>
        <h3>
          {t.name}
          <ArrowRight size={19} />
        </h3>
        <div className="studio-progress">
          <i
            style={{
              width: `${pool.length ? (seen / pool.length) * 100 : 0}%`,
            }}
          />
        </div>
        <small>
          {seen}/{pool.length} câu đã xem
        </small>
      </div>
    </button>
  );
}

export function PhraseCard({ p, c }) {
  const level = mastery(c.data.learned[p.id]);
  return (
    <article className="studio-phrase">
      <div>
        <span className="studio-kicker">
          {typeNames[p.type]} ·{" "}
          {{
            new: "Chưa học",
            seen: "Đã xem",
            growing: "Đang củng cố",
            strong: "Nhớ vững",
          }[level] || "Chưa học"}
        </span>
        <h3>{p.en}</h3>
        <p>{p.vi}</p>
        <details>
          <summary>Ngữ cảnh & ghi chú</summary>
          <p>{p.note}</p>
          {c.data.notes?.[p.id] && <p>Ví dụ của bạn: {c.data.notes[p.id]}</p>}
        </details>
      </div>
      <div className="studio-phrase-actions">
        <button
          className="studio-icon"
          aria-label={`Nghe ${p.en}`}
          onClick={() => c.speak(p.type === "phrasal" ? p.note : p.en)}
        >
          <Volume2 size={19} />
        </button>
        <button
          className="studio-icon"
          aria-label={`Lưu ${p.en}`}
          aria-pressed={c.data.saved.includes(p.id)}
          onClick={() => c.save(p.id)}
        >
          <Bookmark
            size={19}
            fill={c.data.saved.includes(p.id) ? "currentColor" : "none"}
          />
        </button>
        <button
          className="studio-icon"
          aria-label={`${c.data.learned[p.id] ? "Đã xem" : "Chưa xem"} ${p.en}`}
          aria-pressed={!!c.data.learned[p.id]}
          onClick={() => c.toggle(p.id)}
        >
          <Check size={19} />
        </button>
        <button
          className="studio-button"
          aria-label={`Luyện ${p.en}`}
          onClick={() => c.start([p], "learn")}
        >
          Luyện câu này <ArrowRight size={17} />
        </button>
      </div>
    </article>
  );
}

export function StudioLibrary({ c }) {
  const [limit, setLimit] = useState(12);
  useEffect(() => setLimit(12), [c.query, c.filter, c.status]);
  if (c.page === "topics" && !c.topic)
    return (
      <div className="studio-topic-grid">
        {c.topics.map((t) => (
          <TopicTile key={t.id} topic={t} c={c} />
        ))}
      </div>
    );
  return (
    <>
      {c.selected && (
        <div className="studio-library-banner">
          <FieldScene scene={sceneFor(c.selected.id)} title={c.selected.name} />
          <div>
            <button className="studio-link" onClick={() => c.setTopic(null)}>
              ← Các chủ đề
            </button>
            <h2>{c.selected.name}</h2>
            <p>{c.selected.en}</p>
            <button
              className="studio-button"
              disabled={!c.visible.length}
              onClick={() => c.start(c.visible.slice(0, c.data.goal || 5))}
            >
              Học chủ đề này <ArrowRight size={17} />
            </button>
          </div>
        </div>
      )}
      <div className="studio-filters">
        <label>
          Tìm câu
          <input
            aria-label="Tìm câu tiếng Anh hoặc nghĩa tiếng Việt"
            placeholder="Tìm tiếng Anh hoặc nghĩa tiếng Việt…"
            value={c.query}
            onChange={(e) => c.setQuery(e.target.value)}
          />
        </label>
        <label>
          Loại câu
          <select
            value={c.filter}
            onChange={(e) => c.setFilter(e.target.value)}
          >
            <option value="all">Tất cả cách nói</option>
            {Object.entries(typeNames).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
        </label>
        <label>
          Tiến độ
          <select
            aria-label="Lọc tiến độ"
            value={c.status}
            onChange={(e) => c.setStatus(e.target.value)}
          >
            <option value="all">Tất cả tiến độ</option>
            <option value="new">Chưa xem</option>
            <option value="learned">Đã xem</option>
          </select>
        </label>
      </div>
      <p className="studio-result-count" aria-live="polite">
        {c.visible.length} câu phù hợp
      </p>
      {c.visible.slice(0, limit).map((p) => (
        <PhraseCard key={p.id} p={p} c={c} />
      ))}
      {!c.visible.length && (
        <div className="studio-empty">
          <Bookmark />
          <h2>
            {c.page === "saved" && !c.query
              ? "Chưa có câu nào được lưu."
              : "Chưa tìm thấy câu phù hợp."}
          </h2>
          <p>Thử chủ đề khác hoặc bỏ bớt bộ lọc.</p>
          <button className="studio-button" onClick={() => c.nav("topics")}>
            Khám phá chủ đề
          </button>
        </div>
      )}
      {limit < c.visible.length && (
        <button className="studio-more" onClick={() => setLimit((v) => v + 12)}>
          Xem thêm 12 câu ({c.visible.length - limit} câu còn lại)
        </button>
      )}
    </>
  );
}
