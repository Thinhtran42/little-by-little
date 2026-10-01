import React, { useState, useEffect, useRef } from "react";
import { ArrowLeft, ArrowRight, Volume2 } from "lucide-react";
import { readingLessons } from "../../../shared/reading-lessons.js";
import { checkAnswer } from "../../../shared/learning.js";
import { RealPhoto, PhotoCredit } from "./RealPhoto.jsx";
import "./reading-library.css";

export default function ReadingLibrary({ speak, onCourse }) {
  const [selected, setSelected] = useState(null),
    [query, setQuery] = useState(""),
    [topic, setTopic] = useState("all");
  const lesson = readingLessons.find((l) => l.id === selected);
  const topics = [...new Set(readingLessons.map((l) => l.topic))];
  const visible = readingLessons.filter(
    (l) =>
      (topic === "all" || topic === l.topic) &&
      `${l.title} ${l.goal} ${l.terms.flat().join(" ")}`
        .toLocaleLowerCase("vi")
        .includes(query.toLocaleLowerCase("vi")),
  );
  useEffect(() => () => window.speechSynthesis?.cancel(), []);
  if (lesson)
    return (
      <>{onCourse&&<button className="studio-link" onClick={()=>onCourse(lesson.id)}>Mở bài này trong lộ trình B1/B2 →</button>}<ReadingLesson
        key={lesson.id}
        lesson={lesson}
        speak={speak}
        onBack={() => {
          setSelected(null);
          window.speechSynthesis?.cancel();
        }}
      /></>
    );
  return (
    <section className="reading-library">
      <div className="reading-intro">
        <strong>
          {readingLessons.length} tình huống ·{" "}
          {readingLessons.reduce((n, l) => n + l.readings.length, 0)} đoạn đọc ·{" "}
          {readingLessons.reduce((n, l) => n + l.terms.length, 0)} mục từ/cụm
        </strong>
        <p>
          Đọc một chuyện gần gũi, hiểu cách dùng rồi thử nói theo cách của bạn.
        </p>
      </div>
      <div className="studio-filters">
        <label>
          Tìm trong bài đọc
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ví dụ: đổi áo, get off, cuộc hẹn…"
          />
        </label>
        <label>
          Chủ đề bài đọc
          <select value={topic} onChange={(e) => setTopic(e.target.value)}>
            <option value="all">Tất cả chủ đề</option>
            {topics.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </label>
      </div>
      <p className="studio-result-count" role="status">
        {visible.length} bài phù hợp
      </p>
      <div className="reading-grid">
        {visible.map((l) => (
          <button
            className="reading-tile"
            key={l.id}
            onClick={() => setSelected(l.id)}
          >
            <RealPhoto scene={l.photo} />
            <div>
              <span className="studio-kicker">
                {l.topic} · {l.level}
              </span>
              <h2>{l.title}</h2>
              <p>{l.goal}</p>
              <small>
                {l.terms
                  .slice(0, 3)
                  .map((t) => t[0])
                  .join(" · ")}
              </small>
              <span className="reading-tile-action">
                Đọc tình huống <ArrowRight size={18} />
              </span>
            </div>
          </button>
        ))}
      </div>
      {!visible.length && (
        <div className="studio-empty">
          <p>Chưa có bài phù hợp. Thử từ khác hoặc bỏ bộ lọc.</p>
          <button
            className="studio-button"
            onClick={() => {
              setQuery("");
              setTopic("all");
            }}
          >
            Xem tất cả bài
          </button>
        </div>
      )}
    </section>
  );
}

export function ReadingLesson({ lesson: l, speak, onBack, backLabel = 'Các bài đọc' }) {
  const headingRef = useRef(null);
  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);
  const [chapter, setChapter] = useState(0),
    [term, setTerm] = useState(null),
    [answer, setAnswer] = useState(""),
    [checked, setChecked] = useState(false),
    [choice, setChoice] = useState(null),
    [tab, setTab] = useState("read");
  const passage = l.readings[chapter],
    chosen = l.terms.find((t) => t[0] === term),
    correct = checkAnswer(answer, l.recall.answer);
  const readText = passage.text.replaceAll("**", "");
  function changeTab(id) {
    setTab(id);
    window.speechSynthesis?.cancel();
  }
  return (
    <article className="reading-lesson">
      <button className="studio-link" onClick={onBack}>
        <ArrowLeft size={17} /> {backLabel}
      </button>
      <div className="reading-cover">
        <RealPhoto scene={l.photo} priority />
        <div>
          <span className="studio-kicker">
            {l.topic} · {l.level} · Bài tự luyện
          </span>
          <h2 ref={headingRef} tabIndex={-1}>{l.title}</h2>
          <p>{l.goal}</p>
        </div>
      </div>
      <p className="reading-context">{l.context}</p>
      <nav className="reading-tabs" aria-label="Phần bài học">
        {[
          ["read", "Đọc hiểu"],
          ["words", "Từ & cách dùng"],
          ["dialogue", "Hội thoại"],
          ["recall", "Thử nhớ"],
        ].map(([id, label]) => (
          <button
            key={id}
            aria-pressed={tab === id}
            onClick={() => changeTab(id)}
          >
            {label}
          </button>
        ))}
      </nav>
      {tab === "read" && (
        <section>
          <div className="reading-chapters">
            {l.readings.map((r, i) => (
              <button
                key={r.title}
                aria-pressed={chapter === i}
                onClick={() => {
                  setChapter(i);
                  setTerm(null);
                  window.speechSynthesis?.cancel();
                }}
              >
                {i + 1}. {r.title}
              </button>
            ))}
          </div>
          <div className="reading-copy">
            <div className="reading-copy-top">
              <span>Chạm vào cụm in đậm để xem cách dùng</span>
              <button
                className="studio-icon"
                aria-label="Nghe đoạn đọc"
                onClick={() => speak(readText)}
              >
                <Volume2 size={20} />
              </button>
            </div>
            <p className="reading-text" lang="en">
              {passage.text.split(/\*\*(.*?)\*\*/g).map((part, i) =>
                i % 2 ? (
                  <button
                    key={i}
                    aria-pressed={term === part}
                    onClick={() => setTerm(term === part ? null : part)}
                  >
                    <strong>{part}</strong>
                  </button>
                ) : (
                  part
                ),
              )}
            </p>
            {chosen && (
              <aside className="reading-definition" role="status">
                <strong>
                  {chosen[0]} — {chosen[1]}
                </strong>
                <p>{chosen[2]}</p>
                <p lang="en">{chosen[3]}</p>
                <button
                  className="studio-icon"
                  aria-label={`Nghe ${chosen[0]}`}
                  onClick={() => speak(chosen[3])}
                >
                  <Volume2 size={18} />
                </button>
              </aside>
            )}
            <details>
              <summary>Xem nghĩa tiếng Việt</summary>
              <p>{passage.vi}</p>
            </details>
          </div>
          {chapter === 0 && (
            <fieldset className="reading-question">
              <legend>{l.question.prompt}</legend>
              {l.question.options.map((o, i) => (
                <button
                  key={o}
                  aria-pressed={choice === i}
                  onClick={() => setChoice(i)}
                >
                  {o}
                </button>
              ))}
              {choice !== null && (
                <p role="status">
                  {choice === l.question.answer
                    ? "Đúng rồi."
                    : "Cùng đọc lại nhé."}{" "}
                  {l.question.explanation}
                </p>
              )}
            </fieldset>
          )}
        </section>
      )}
      {tab === "words" && (
        <div className="reading-word-list">
          {l.terms.map(([en, vi, note, example]) => (
            <section key={en}>
              <div>
                <h3>{en}</h3>
                <button
                  className="studio-icon"
                  aria-label={`Nghe ví dụ ${en}`}
                  onClick={() => speak(example)}
                >
                  <Volume2 size={19} />
                </button>
              </div>
              <strong>{vi}</strong>
              <p>{note}</p>
              <blockquote lang="en">{example}</blockquote>
            </section>
          ))}
        </div>
      )}
      {tab === "dialogue" && (
        <section className="reading-dialogue">
          <h3>Đổi vai, thử trả lời trước khi mở câu tiếp theo</h3>
          <p>
            Đọc vai đầu, tự nghĩ lời đáp rồi mở từng lượt. Các câu chuyện và
            nhân vật đều được biên soạn cho bài học.
          </p>
          {l.dialogue.map(([speaker, line], i) => (
            <details key={i} open={i === 0 ? true : undefined}>
              <summary>
                {String(i + 1).padStart(2, "0")} · {speaker}
              </summary>
              <div>
                <p lang="en">{line}</p>
                <button
                  className="studio-icon"
                  aria-label={`Nghe lời thoại ${i + 1}`}
                  onClick={() => speak(line)}
                >
                  <Volume2 size={18} />
                </button>
              </div>
            </details>
          ))}
        </section>
      )}
      {tab === "recall" && (
        <form
          className="reading-recall"
          onSubmit={(e) => {
            e.preventDefault();
            setChecked(true);
          }}
        >
          <h3>Thử khi không còn câu mẫu</h3>
          <label>
            {l.recall.prompt}
            <input
              aria-label="Câu trả lời bài đọc"
              value={answer}
              onChange={(e) => {
                setAnswer(e.target.value);
                setChecked(false);
              }}
              autoComplete="off"
              spellCheck="false"
            />
          </label>
          <button className="studio-button" disabled={!answer.trim()}>
            Kiểm tra câu trả lời
          </button>
          {checked && (
            <p role="status">
              {correct ? "Đúng rồi!" : "Chưa khớp."} {l.recall.explanation}
              {!correct && (
                <>
                  {" "}
                  Đáp án: <strong>{l.recall.answer}</strong>.
                </>
              )}
            </p>
          )}
          <small>
            Bài tự luyện; kết quả này chưa cộng vào tiến độ tài khoản.
          </small>
        </form>
      )}
      <details className="reading-sources">
        <summary>Nguồn bài & ảnh</summary>
        <p>
          {l.source.kind === "adapted"
            ? "Biên tập và mở rộng từ:"
            : "Nội dung: "}{" "}
          {l.source.url ? (
            <a href={l.source.url} target="_blank" rel="noreferrer">
              {l.source.title}
            </a>
          ) : (
            l.source.title
          )}{" "}
          · {l.source.author}.
        </p>
        {l.source.note && <p>{l.source.note}</p>}
        {l.source.licenseUrl && (
          <p>
            <a href={l.source.licenseUrl} target="_blank" rel="noreferrer">
              Điều kiện sử dụng nội dung nguồn
            </a>
          </p>
        )}
        <PhotoCredit scene={l.photo} />
        <p>
          Độ khó là ước lượng biên tập, không phải chứng nhận CEFR. Giọng nghe
          tùy thiết bị.
        </p>
      </details>
    </article>
  );
}
