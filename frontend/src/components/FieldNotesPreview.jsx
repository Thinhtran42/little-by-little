import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Volume2,
  RotateCcw,
  Check,
  BookOpen,
  Search,
  X,
  Bookmark,
} from "lucide-react";
import { fieldNotes } from "../../../shared/field-notes.js";
import { checkAnswer } from "../../../shared/learning.js";
import "./field-notes.css";
import ActionScene from "./ActionScene.jsx";
import { FieldScene } from "./FieldScene.jsx";

const STORAGE = "lbl-field-notes-preview-v1";
const labels = { word: "Từ vựng", phrasal: "Phrasal verb", pattern: "Mẫu câu" };
function readSaved() {
  try {
    const value = JSON.parse(localStorage.getItem(STORAGE));
    return value && typeof value === "object" && !Array.isArray(value)
      ? value
      : {};
  } catch {
    return {};
  }
}
// Shared original artwork; demo progress remains isolated in this preview.
function Highlight({ text, items }) {
  const terms = items.map((i) => i.en).sort((a, b) => b.length - a.length);
  const escaped = terms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const re = new RegExp(`(${escaped.join("|")})`, "gi");
  return text
    .split(re)
    .map((part, i) =>
      terms.some((t) => t.toLowerCase() === part.toLowerCase()) ? (
        <mark key={i}>{part}</mark>
      ) : (
        part
      ),
    );
}
export default function FieldNotesPreview() {
  const [selected, select] = useState(null),
    [mode, setMode] = useState("story"),
    [filter, setFilter] = useState("all");
  const [query, setQuery] = useState(""),
    [index, setIndex] = useState(0),
    [flipped, flip] = useState(false);
  const [answer, setAnswer] = useState(""),
    [result, setResult] = useState(null),
    [hint, setHint] = useState(false);
  const [saved, save] = useState(readSaved),
    [storageError, setStorageError] = useState(""),
    [audioError, setAudioError] = useState("");
  const [translation, showTranslation] = useState(false);
  const [look, setLook] = useState("studio");
  const [motion, setMotion] = useState(true);
  const [sceneFocus, setSceneFocus] = useState(0);
  const sceneCues = [
    {
      en: "at the counter",
      vi: "ở quầy phục vụ",
      detail: "Your drink is waiting at the counter.",
      x: "71%",
      y: "65%",
    },
    {
      en: "pick it up",
      vi: "lấy món đã chuẩn bị",
      detail: "You can pick it up over here.",
      x: "60%",
      y: "55%",
    },
    {
      en: "to go",
      vi: "mang đi",
      detail: "Could I get that to go?",
      x: "38%",
      y: "63%",
    },
  ];
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE, JSON.stringify(saved));
    } catch {
      setStorageError(
        "Trình duyệt không cho lưu. Kết quả chỉ giữ trong lần mở này.",
      );
    }
  }, [saved]);
  useEffect(() => {
    window.scrollTo(0, 0);
    return () => window.speechSynthesis?.cancel();
  }, [selected]);
  const lesson = fieldNotes.find((l) => l.id === selected);
  const items =
    lesson?.items.filter((i) => filter === "all" || i.kind === filter) || [];
  const item = items[index % Math.max(items.length, 1)];
  const total = Object.keys(saved).filter(
    (id) => saved[id]?.attempts > 0,
  ).length;
  const due = fieldNotes
    .flatMap((l) => l.items)
    .filter((i) => saved[i.id]?.due && saved[i.id].due <= Date.now());
  const visible = fieldNotes.filter((l) =>
    `${l.title} ${l.place} ${l.items.map((i) => `${i.en} ${i.vi}`).join(" ")}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );
  function resetQuestion() {
    flip(false);
    setAnswer("");
    setResult(null);
    setHint(false);
  }
  function open(id) {
    select(id);
    setMode("story");
    setFilter("all");
    setIndex(0);
    showTranslation(false);
    resetQuestion();
  }
  function changeMode(value) {
    setMode(value);
    setIndex(0);
    resetQuestion();
  }
  function speak(text) {
    setAudioError("");
    if (!window.speechSynthesis) {
      setAudioError("Trình duyệt này không hỗ trợ đọc văn bản.");
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.9;
    utterance.onerror = (e) => {
      if (!["canceled", "interrupted"].includes(e.error))
        setAudioError("Không phát được âm thanh trên thiết bị này.");
    };
    window.speechSynthesis.speak(utterance);
  }
  function submit(e) {
    e.preventDefault();
    if (result || !answer.trim()) return;
    const correct = checkAnswer(answer, item.en);
    const previous = saved[item.id] || {};
    const delay = correct && !hint ? 86400000 : 600000;
    save({
      ...saved,
      [item.id]: {
        ...previous,
        attempts: (Number(previous.attempts) || 0) + 1,
        correct,
        hinted: hint,
        due: Date.now() + delay,
      },
    });
    setResult({ correct });
  }
  const speaker = (text) => (
    <button
      className="fn-speaker"
      aria-label={`Phát âm: ${text}`}
      title="Giọng của thiết bị; audio tự nhiên chưa được tích hợp"
      onClick={() => speak(text)}
    >
      <Volume2 size={20} />
    </button>
  );
  return (
    <div className={`fn-app fn-look-${look} ${motion ? "" : "fn-still"}`}>
      <div className="fn-preview">
        <span>Bản thử • Tiến độ riêng trên máy này</span>
        <a href="/">
          Về giao diện hiện tại <X size={14} />
        </a>
      </div>
      <header className="fn-header">
        <button className="fn-brand" onClick={() => select(null)}>
          <span className="fn-brand-icon">ll.</span>
          <span>
            little by little<small>ENGLISH FIELD NOTES</small>
          </span>
        </button>
        <nav aria-label="Điều hướng bản thử">
          <button
            onClick={() => select(null)}
            aria-current={!lesson ? "page" : undefined}
          >
            Sổ tay
          </button>
          <button
            onClick={() => {
              if (due.length) {
                const l = fieldNotes.find((l) =>
                  l.items.some((i) => i.id === due[0].id),
                );
                open(l.id);
                setMode("recall");
                setIndex(l.items.findIndex((i) => i.id === due[0].id));
              } else {
                select(null);
                document
                  .getElementById("fn-library")
                  ?.scrollIntoView({ behavior: "smooth" });
              }
            }}
          >
            Ôn lại <span>{due.length}</span>
          </button>
        </nav>
        <span className="fn-header-note">
          A little practice. A real conversation.
        </span>
      </header>
      <div className="fn-design-controls" aria-label="Tùy chọn giao diện thử">
        <div role="group" aria-label="Phong cách">
          <button
            aria-pressed={look === "studio"}
            onClick={() => setLook("studio")}
          >
            Studio
          </button>
          <button
            aria-pressed={look === "paper"}
            onClick={() => setLook("paper")}
          >
            Sổ tay
          </button>
        </div>
        <button aria-pressed={!motion} onClick={() => setMotion(!motion)}>
          {motion ? "Giảm chuyển động" : "Bật chuyển động"}
        </button>
      </div>
      {storageError && (
        <p className="fn-notice" role="alert">
          {storageError}
        </p>
      )}
      {audioError && (
        <p className="fn-notice" role="alert">
          {audioError}
        </p>
      )}
      {!lesson ? (
        <main className="fn-main">
          <section className="fn-hero">
            <div className="fn-hero-copy">
              <p className="fn-kicker">SỔ TAY SỐ 01 / TIẾNG ANH NGOÀI ĐỜI</p>
              <h1>
                Những câu nhỏ.
                <br />
                <em>Những cuộc gặp lớn.</em>
              </h1>
              <p>
                Gọi một ly cà phê. Hỏi lại một deadline.
                <br />
                Học tiếng Anh từ những việc bạn thật sự muốn nói.
              </p>
              <button className="fn-primary" onClick={() => open("cafe")}>
                Bắt đầu ở quán cà phê <ArrowRight size={19} />
              </button>
              <span className="fn-meta">
                6 cụm trong một câu chuyện · khoảng 8–12 phút
              </span>
            </div>
            <div className="fn-stage">
              <div className="fn-stage-label">
                <span>SCENE 01</span>
                <span>THE CORNER CAFÉ ↗</span>
              </div>
              {sceneFocus === 1 ? (
                <ActionScene kind="cafe" motion={motion} compact />
              ) : (
                <div className="fn-feature">
                  <div className="fn-interactive-scene">
                    <FieldScene
                      scene="cafe"
                      title="Khách gọi cà phê mang đi, barista đứng sau quầy, trời mưa ngoài cửa sổ"
                    />
                    <span
                      className="fn-scene-pin"
                      style={{
                        left: sceneCues[sceneFocus].x,
                        top: sceneCues[sceneFocus].y,
                      }}
                      aria-hidden="true"
                    >
                      <span />
                    </span>
                  </div>
                  <span className="fn-caption">
                    <i>01</i>
                    <span>
                      {sceneCues[sceneFocus].en}
                      <small>{sceneCues[sceneFocus].vi}</small>
                    </span>
                    {speaker(sceneCues[sceneFocus].detail)}
                  </span>
                  <span className="fn-stamp">
                    REAL LIFE
                    <br />
                    ENGLISH
                  </span>
                </div>
              )}
              <div
                className="fn-scene-cues"
                role="group"
                aria-label="Khám phá cụm từ trong hình"
              >
                {sceneCues.map((cue, i) => (
                  <button
                    key={cue.en}
                    aria-label={cue.en}
                    aria-pressed={sceneFocus === i}
                    onClick={() => setSceneFocus(i)}
                  >
                    <span>0{i + 1}</span>
                    {cue.en}
                  </button>
                ))}
              </div>
              <p className="fn-stage-note" aria-live="polite" key={sceneFocus}>
                {sceneCues[sceneFocus].detail}
              </p>
            </div>
          </section>
          <div className="fn-progress-strip">
            <BookOpen size={21} />
            <p>
              {total
                ? `Bạn đã thử nhớ ${total}/36 cụm.`
                : "Không cần học hết hôm nay."}{" "}
              <span>
                {due.length
                  ? `${due.length} cụm đã đến lúc ôn lại.`
                  : "Một tình huống nhỏ là đủ để bắt đầu."}
              </span>
            </p>
            <span>ĐỌC → KHÁM PHÁ → TỰ NHỚ</span>
          </div>
          <section id="fn-library">
            <div className="fn-section-head">
              <div>
                <p className="fn-kicker">CHỌN MỘT CHUYỆN GẦN VỚI BẠN</p>
                <h2>Hôm nay, bạn muốn nói gì?</h2>
              </div>
              <label className="fn-search">
                <Search size={18} />
                <input
                  aria-label="Tìm tình huống hoặc từ"
                  placeholder="Cà phê, deadline, catch up…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </label>
            </div>
            <div className="fn-grid">
              {visible.map((l, i) => (
                <button
                  className="fn-lesson-card"
                  key={l.id}
                  onClick={() => open(l.id)}
                  style={{ "--scene-color": l.color, "--delay": `${i * 60}ms` }}
                >
                  <div className="fn-card-art">
                    <FieldScene scene={l.scene} title={l.goal} />
                    <span>{l.level}</span>
                  </div>
                  <div className="fn-card-copy">
                    <p className="fn-kicker">{l.place}</p>
                    <h3>{l.title}</h3>
                    <p>{l.goal}</p>
                    <footer>
                      <span>2 từ · 2 phrasal verbs · 2 mẫu câu</span>
                      <ArrowRight size={19} />
                    </footer>
                  </div>
                </button>
              ))}
            </div>
            {!visible.length && (
              <p className="fn-empty">
                Chưa có tình huống phù hợp. Thử “work”, “cà phê” hoặc “get off”.
              </p>
            )}
          </section>
          <footer className="fn-footer">
            <span>Little by little. Out in the world.</span>
            <p>
              36 mục theo nghĩa cụ thể · 6 đoạn đọc · 6 hội thoại tự biên soạn
            </p>
          </footer>
        </main>
      ) : (
        <main className="fn-main fn-detail" key={lesson.id}>
          <button className="fn-back" onClick={() => select(null)}>
            <ArrowLeft size={17} /> Tất cả tình huống
          </button>
          <div className="fn-lesson-heading">
            <div>
              <p className="fn-kicker">
                {lesson.place} / {lesson.level}
              </p>
              <h1>{lesson.title}</h1>
              <p>{lesson.goal}</p>
            </div>
            <span className="fn-lesson-number">
              0{fieldNotes.indexOf(lesson) + 1}
            </span>
          </div>
          <div className="fn-tabs" role="group" aria-label="Hoạt động học">
            {[
              ["story", "01", "Vào câu chuyện"],
              ["cards", "02", "Lật thẻ khám phá"],
              ["recall", "03", "Tự nhớ lại"],
            ].map(([key, n, label]) => (
              <button
                key={key}
                aria-pressed={mode === key}
                onClick={() => changeMode(key)}
              >
                <span>{n}</span>
                {label}
              </button>
            ))}
          </div>
          {mode === "story" ? (
            <div className="fn-story-layout">
              <aside>
                {["cafe", "bus"].includes(lesson.scene) ? (
                  <ActionScene
                    key={lesson.scene}
                    kind={lesson.scene}
                    motion={motion}
                  />
                ) : (
                  <FieldScene scene={lesson.scene} title={lesson.goal} />
                )}
                <p className="fn-handnote">{lesson.en}</p>
                <div className="fn-objective">
                  <span>CHUYỆN BẠN SẼ LÀM ĐƯỢC</span>
                  <p>{lesson.goal}</p>
                  <button
                    className="fn-text-link"
                    onClick={() => changeMode("cards")}
                  >
                    Khám phá 6 cụm trong bài <ArrowRight size={16} />
                  </button>
                </div>
              </aside>
              <article className="fn-reading">
                <p className="fn-kicker">THE SCENE</p>
                <p className="fn-story-text">
                  <Highlight text={lesson.story} items={lesson.items} />
                </p>
                <div className="fn-reading-actions">
                  {speaker(lesson.story)}
                  <button
                    onClick={() => showTranslation(!translation)}
                    aria-expanded={translation}
                  >
                    {translation ? "Ẩn bản dịch" : "Xem bản dịch"}
                  </button>
                </div>
                {translation && (
                  <p className="fn-translation">{lesson.translation}</p>
                )}
                <h2>Và cuộc trò chuyện bắt đầu…</h2>
                <div className="fn-dialogue">
                  {lesson.dialogue.map(([person, line], i) => (
                    <div key={i} className={i % 2 ? "fn-reply" : ""}>
                      <span>{person}</span>
                      <p>
                        <Highlight text={line} items={lesson.items} />
                      </p>
                      {speaker(line)}
                    </div>
                  ))}
                </div>
                <button
                  className="fn-primary"
                  onClick={() => changeMode("cards")}
                >
                  Thử lật thẻ <ArrowRight size={18} />
                </button>
              </article>
            </div>
          ) : (
            <section className="fn-practice">
              <div
                className="fn-filters"
                role="group"
                aria-label="Loại nội dung"
              >
                {[["all", "Tất cả"], ...Object.entries(labels)].map(
                  ([key, label]) => (
                    <button
                      key={key}
                      aria-pressed={filter === key}
                      onClick={() => {
                        setFilter(key);
                        setIndex(0);
                        resetQuestion();
                      }}
                    >
                      {label}
                    </button>
                  ),
                )}
              </div>
              <div className="fn-card-top">
                <span>
                  {labels[item.kind]} / {index + 1} trên {items.length}
                </span>
                <button
                  aria-label={
                    saved[item.id]?.bookmarked ? "Bỏ lưu cụm" : "Lưu cụm"
                  }
                  aria-pressed={!!saved[item.id]?.bookmarked}
                  onClick={() =>
                    save({
                      ...saved,
                      [item.id]: {
                        ...saved[item.id],
                        bookmarked: !saved[item.id]?.bookmarked,
                      },
                    })
                  }
                >
                  <Bookmark
                    size={19}
                    fill={saved[item.id]?.bookmarked ? "currentColor" : "none"}
                  />
                </button>
              </div>
              {mode === "cards" ? (
                <>
                  <button
                    className={`fn-flashcard ${flipped ? "is-flipped" : ""}`}
                    onClick={() => flip(!flipped)}
                    aria-label={flipped ? "Ẩn đáp án" : "Lật thẻ xem cách nói"}
                  >
                    <span className="fn-kicker">
                      {flipped ? "CÁCH NÓI TRONG TÌNH HUỐNG NÀY" : lesson.place}
                    </span>
                    <h2>{flipped ? item.en : item.vi}</h2>
                    <p>
                      {flipped
                        ? item.example
                        : "Bạn sẽ nói thế nào? Thử nhớ trước khi lật."}
                    </p>
                    <span className="fn-flip-label">
                      <RotateCcw size={15} />{" "}
                      {flipped ? "Lật lại" : "Chạm để khám phá"}
                    </span>
                  </button>
                  {flipped && (
                    <div className="fn-usage">
                      <div>
                        {speaker(item.example)}
                        <strong>Dùng cho đúng</strong>
                      </div>
                      <p>{item.note}</p>
                    </div>
                  )}
                </>
              ) : (
                <form className="fn-recall" onSubmit={submit}>
                  <p className="fn-kicker">NHỚ CỤM MỤC TIÊU · {lesson.place}</p>
                  <h2>{item.vi}</h2>
                  <p>Điền đúng cụm đã học vào câu sau:</p>
                  <p className="fn-gap">
                    {item.example.replace(
                      new RegExp(
                        item.en.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
                        "i",
                      ),
                      "________",
                    )}
                  </p>
                  <label htmlFor="fn-answer">Cụm tiếng Anh</label>
                  <input
                    id="fn-answer"
                    autoComplete="off"
                    spellCheck="false"
                    value={answer}
                    disabled={!!result}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Thử nhớ mà chưa mở gợi ý…"
                  />
                  <div className="fn-form-actions">
                    <button
                      type="button"
                      onClick={() => setHint(true)}
                      disabled={!!result || hint}
                    >
                      Cho mình một gợi ý
                    </button>
                    <button
                      className="fn-primary"
                      disabled={!answer.trim() || !!result}
                    >
                      Kiểm tra <Check size={17} />
                    </button>
                  </div>
                  {hint && (
                    <p className="fn-hint">
                      Bắt đầu bằng “{item.en.slice(0, 2)}…” ·{" "}
                      {item.en.split(" ").length} từ. {item.note}
                    </p>
                  )}
                  {result && (
                    <div
                      className={`fn-feedback ${result.correct ? "is-correct" : ""}`}
                      role="status"
                    >
                      <strong>
                        {result.correct
                          ? hint
                            ? "Đúng rồi, có hỗ trợ."
                            : "Bạn đã tự nhớ đúng!"
                          : "Chưa khớp cụm mục tiêu."}
                      </strong>
                      <p>
                        {item.en} — {item.vi}
                      </p>
                      <p>{item.note}</p>
                      <small>
                        {result.correct && !hint
                          ? "Ôn lại sau 1 ngày để kiểm tra trí nhớ."
                          : "Thử lại sau 10 phút. Một lần sai cũng giúp biết cần ôn gì."}{" "}
                        Kết quả này chưa có nghĩa là đã thuộc lâu dài.
                      </small>
                    </div>
                  )}
                </form>
              )}
              <div className="fn-pagination">
                <button
                  disabled={index === 0}
                  onClick={() => {
                    setIndex(index - 1);
                    resetQuestion();
                  }}
                >
                  <ArrowLeft size={17} /> Trước
                </button>
                <span>
                  {index + 1} / {items.length}
                </span>
                {index < items.length - 1 ? (
                  <button
                    onClick={() => {
                      setIndex(index + 1);
                      resetQuestion();
                    }}
                  >
                    Tiếp <ArrowRight size={17} />
                  </button>
                ) : (
                  <button
                    onClick={() =>
                      mode === "cards" ? changeMode("recall") : select(null)
                    }
                  >
                    {mode === "cards" ? "Thử tự nhớ" : "Về sổ tay"}{" "}
                    <ArrowRight size={17} />
                  </button>
                )}
              </div>
              <p className="fn-local-note">
                Bản thử lưu trên trình duyệt này, tách khỏi tài khoản thật. Bài
                điền kiểm tra cụm mục tiêu, chưa chấm mọi cách diễn đạt tương
                đương.
              </p>
            </section>
          )}
        </main>
      )}
    </div>
  );
}
