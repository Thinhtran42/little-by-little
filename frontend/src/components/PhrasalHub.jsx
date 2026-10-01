import React, { useEffect, useRef, useState } from "react";
import {
  Volume2,
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  Check,
  BookOpen,
} from "lucide-react";
import {
  phrasalLessons,
  phrasalGroups,
} from "../../../shared/phrasal-lessons.js";
import { checkAnswer } from "../../../shared/learning.js";
import {
  phrasalQueue,
  searchPhrasal,
} from "../../../shared/phrasal-practice.js";
import { useLearner } from "../state/LearnerContext.jsx";
import { api } from "../services/api.js";
import { eventKey } from "../services/eventKey.js";
import { RealPhoto, PhotoCredit } from "./RealPhoto.jsx";
import StationLesson from "./StationLesson.jsx";
import "./phrasal-lab.css";

function Audio({ text, speak, label = "Phát âm thanh" }) {
  return (
    <button
      type="button"
      className="pv-audio"
      aria-label={label}
      title={label}
      onClick={() => speak(text)}
    >
      <Volume2 size={19} aria-hidden="true" />
    </button>
  );
}
function RichText({ text, onTerm }) {
  return text.split(/\*\*(.*?)\*\*/g).map((part, i) =>
    i % 2 ? (
      <button className="pv-highlight" key={i} onClick={() => onTerm(part)}>
        {part}
      </button>
    ) : (
      part
    ),
  );
}
export default function PhrasalHub({ speak }) {
  const { user } = useLearner();
  return (
    <PhrasalWorkspace key={user?.id || "guest"} user={user} speak={speak} />
  );
}
function PhrasalWorkspace({ user, speak }) {
  const [selected, setSelected] = useState(null),
    [group, setGroup] = useState("all"),
    [query, setQuery] = useState(""),
    [limit, setLimit] = useState(6),
    [dueOnly, setDueOnly] = useState(false),
    [summary, setSummary] = useState(null),
    [error, setError] = useState(""),
    [refresh, setRefresh] = useState(0);
  const title = useRef(null);
  useEffect(() => setLimit(6), [group, query, dueOnly]);
  useEffect(() => {
    if (!user) return;
    const ac = new AbortController();
    api("/me/phrasal", { signal: ac.signal })
      .then(setSummary)
      .catch((e) => {
        if (!ac.signal.aborted) setError(e.message);
      });
    return () => ac.abort();
  }, [user, refresh]);
  useEffect(() => {
    title.current?.focus();
    window.speechSynthesis?.cancel();
    return () => window.speechSynthesis?.cancel();
  }, [selected]);
  const back = () => {
    setSelected(null);
    setError("");
    setRefresh((n) => n + 1);
  };
  if (selected === "station")
    return (
      <section className="pv-lab">
        <button className="pv-back" onClick={back}>
          <ArrowLeft size={17} /> Thư viện phrasal verb
        </button>
        <div className="studio-learning">
          <StationLesson speak={speak} />
        </div>
      </section>
    );
  if (selected)
    return (
      <Lesson
        key={selected.id}
        lesson={selected}
        user={user}
        speak={speak}
        onBack={back}
      />
    );
  const visible = phrasalLessons.filter(
    (l) =>
      (group === "all" || l.group === group) &&
      searchPhrasal(l, query) &&
      (!dueOnly ||
        summary?.attempts.some(
          (a) => a.lesson_id === l.id && a.due_day <= summary.today,
        )),
  );
  return (
    <section className="pv-lab" aria-label="Thư viện phrasal verb">
      <header className="pv-intro">
        <div>
          <span className="pv-eyebrow">WORDS IN REAL LIFE · 01</span>
          <h2 ref={title} tabIndex={-1}>
            Nhớ một cảnh.
            <br />
            Dùng được một cụm.
          </h2>
          <p>
            Đừng học một danh sách dài. Chọn một việc bạn sắp làm, rồi thử nói
            bằng tiếng Anh.
          </p>
        </div>
        <aside>
          <BookOpen size={26} aria-hidden="true" />
          <strong>4 cụm. Một tình huống.</strong>
          <span>Đọc → hiểu cách dùng → tự nhớ</span>
          <small>{phrasalLessons.length} bài · Khoảng 8–12 phút / bài</small>
        </aside>
      </header>
      {user ? (
        error ? (
          <div role="alert">
            Chưa tải được tiến độ: {error}{" "}
            <button
              onClick={() => {
                setError("");
                setRefresh((n) => n + 1);
              }}
            >
              Thử lại
            </button>
          </div>
        ) : summary ? (
          <p className="pv-account">
            <strong>{summary.stats.due} câu đến hạn</strong> ·{" "}
            {summary.stats.independent}/{summary.stats.practiced} câu đúng không
            gợi ý ở lượt gần nhất. Kết quả lưu theo tài khoản.
          </p>
        ) : (
          <p role="status">Đang tải tiến độ…</p>
        )
      ) : (
        <p className="pv-account">
          Bạn đang học thử. Đăng nhập để lưu kết quả và lịch ôn; lượt khách chỉ
          giữ trong bài đang mở.
        </p>
      )}
      <nav className="pv-filters" aria-label="Chủ đề phrasal verb">
        {phrasalGroups.map((g) => (
          <button
            key={g.id}
            aria-pressed={group === g.id}
            onClick={() => setGroup(g.id)}
          >
            {g.label}
          </button>
        ))}
      </nav>
      <div className="pv-search">
        <label>
          Tìm cụm từ hoặc tình huống
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ví dụ: take off, cất đồ…"
          />
        </label>
        {user && summary && !error && (
          <label className="pv-due-filter">
            <input
              type="checkbox"
              checked={dueOnly}
              onChange={(e) => setDueOnly(e.target.checked)}
            />{" "}
            Chỉ bài đến hạn
          </label>
        )}
      </div>
      {!visible.length && (
        <div className="pv-empty" role="status">
          <h3>Chưa có bài phù hợp.</h3>
          <p>
            {dueOnly
              ? "Không có bài đến hạn trong bộ lọc này. Bạn vẫn có thể khám phá bài khác."
              : "Thử một cụm ngắn hơn hoặc tìm theo nghĩa tiếng Việt."}
          </p>
          <button
            onClick={() => {
              setQuery("");
              setGroup("all");
              setDueOnly(false);
            }}
          >
            Xem tất cả bài học
          </button>
        </div>
      )}
      <div className="pv-grid">
        {visible.slice(0, limit).map((l) => {
          const attempts =
            summary?.attempts.filter((a) => a.lesson_id === l.id) || [];
          const due = attempts.filter((a) => a.due_day <= summary.today).length;
          return (
            <button
              className="pv-card"
              key={l.id}
              onClick={() => setSelected(l)}
            >
              <div className="pv-card-photo">
                <RealPhoto scene={l.scene} />
              </div>
              <div className="pv-card-copy">
                <span className="pv-eyebrow">
                  {l.level} · 4 CỤM {due > 0 && `· ${due} CÂU ĐẾN HẠN`}
                </span>
                <h3>{l.title}</h3>
                <p>{l.subtitle}</p>
                <div className="pv-word-preview">
                  {l.terms.map((t) => (
                    <span key={t.en}>{t.en}</span>
                  ))}
                </div>
                <span className="pv-card-foot">
                  {attempts.length
                    ? `${attempts.filter((a) => a.correct && !a.hinted).length}/5 câu đúng gần nhất`
                    : "Khám phá tình huống"}{" "}
                  <ArrowRight size={20} aria-hidden="true" />
                </span>
              </div>
            </button>
          );
        })}
      </div>
      {visible.length > 0 && (
        <div className="pv-load-more">
          <p>
            Đang xem {Math.min(limit, visible.length)} / {visible.length} bài
            phù hợp
          </p>
          {limit < visible.length && (
            <button
              className="pv-primary"
              onClick={() => setLimit((n) => n + 6)}
            >
              Xem thêm {Math.min(6, visible.length - limit)} bài
            </button>
          )}
        </div>
      )}
      <details className="pv-legacy">
        <summary>Bài luyện đã có: Đón bạn ở ga</summary>
        <p>Bài và kết quả cũ được giữ nguyên.</p>
        <button onClick={() => setSelected("station")}>
          Tiếp tục bài ở ga →
        </button>
      </details>
    </section>
  );
}
function Lesson({ lesson: l, user, speak, onBack }) {
  const [step, setStep] = useState(0),
    [term, setTerm] = useState(0),
    [flipped, setFlipped] = useState(false),
    [turn, setTurn] = useState(2);
  const title = useRef(null),
    active = l.terms[term];
  useEffect(() => title.current?.focus(), []);
  const go = (n) => {
    setStep(n);
    window.speechSynthesis?.cancel();
  };
  return (
    <section className="pv-lab pv-lesson">
      <button className="pv-back" onClick={onBack}>
        <ArrowLeft size={17} /> Thư viện phrasal verb
      </button>
      <header className="pv-lesson-heading">
        <span className="pv-eyebrow">{l.level} · 4 CỤM TRONG NGỮ CẢNH</span>
        <h2 ref={title} tabIndex={-1}>
          {l.title}
        </h2>
        <p>{l.goal}</p>
      </header>
      <nav className="pv-steps" aria-label="Các bước bài học">
        {["Vào tình huống", "Hiểu & nhớ", "Tự thử sức"].map((name, i) => (
          <button key={name} aria-pressed={step === i} onClick={() => go(i)}>
            <span>{i + 1}</span>
            {name}
          </button>
        ))}
      </nav>
      {step === 0 && (
        <div className="pv-context">
          <figure>
            <div className="pv-context-photo">
              <RealPhoto scene={l.scene} priority />
            </div>
            <figcaption>{l.caption}</figcaption>
            <PhotoCredit scene={l.scene} />
          </figure>
          <div className="pv-story">
            <div className="pv-section-title">
              <h3>Một chuyện rất thường ngày</h3>
              <Audio
                speak={speak}
                text={l.story.replaceAll("**", "")}
                label="Đọc đoạn văn"
              />
            </div>
            <p className="pv-reading">
              <RichText
                text={l.story}
                onTerm={(en) => {
                  setTerm(l.terms.findIndex((t) => t.en === en));
                  setFlipped(true);
                  go(1);
                }}
              />
            </p>
            <small>Chạm vào cụm in đậm để xem nghĩa và cách dùng.</small>
            <details>
              <summary>Xem nghĩa tiếng Việt</summary>
              <p>{l.translation}</p>
            </details>
          </div>
          <section className="pv-dialogue">
            <span className="pv-eyebrow">YOUR TURN TO TALK</span>
            <h3>Nếu bạn có mặt ở đó…</h3>
            <p>Thử nói lời đáp trước khi mở lượt tiếp theo.</p>
            <ol>
              {l.dialogue.slice(0, turn).map(([who, line], i) => (
                <li key={i} className={i % 2 ? "pv-reply" : ""}>
                  <strong>{who}</strong>
                  <p>{line}</p>
                  <Audio
                    text={line}
                    speak={speak}
                    label={`Đọc lời ${who}, lượt ${i + 1}`}
                  />
                </li>
              ))}
            </ol>
            {turn < l.dialogue.length ? (
              <button
                className="pv-primary"
                onClick={() => setTurn((n) => n + 1)}
              >
                Mở lượt tiếp theo <ArrowRight size={17} />
              </button>
            ) : (
              <button className="pv-back" onClick={() => setTurn(2)}>
                <RotateCcw size={16} /> Nhập vai lại
              </button>
            )}
          </section>
          <button className="pv-primary pv-next" onClick={() => go(1)}>
            Khám phá 4 cụm <ArrowRight size={18} />
          </button>
        </div>
      )}
      {step === 1 && (
        <section className="pv-vocabulary">
          <div className="pv-term-list" aria-label="Chọn cụm từ">
            {l.terms.map((t, i) => (
              <button
                key={t.en}
                aria-pressed={i === term}
                onClick={() => {
                  setTerm(i);
                  setFlipped(false);
                }}
              >
                <span>0{i + 1}</span>
                {t.en}
              </button>
            ))}
          </div>
          <div className="pv-flashcard">
            <span className="pv-eyebrow">
              THẺ {term + 1} / 4 · NGHĨ TRƯỚC KHI MỞ
            </span>
            <div className="pv-section-title">
              <h3>{active.en}</h3>
              <Audio
                speak={speak}
                text={active.en}
                label={`Phát âm ${active.en}`}
              />
            </div>
            <p className="pv-example">“{active.example}”</p>
            <button
              className="pv-primary"
              aria-expanded={flipped}
              onClick={() => setFlipped(!flipped)}
            >
              {flipped ? "Ẩn nghĩa và cách dùng" : "Mở nghĩa và cách dùng"}
            </button>
            {flipped && (
              <div className="pv-card-answer">
                <h4>{active.vi}</h4>
                <p>
                  <strong>Mẫu dùng:</strong> {active.pattern}
                </p>
                <p>
                  <strong>Đừng nhầm:</strong> {active.mistake}
                </p>
              </div>
            )}
            <div className="pv-flash-nav">
              <button
                disabled={term === 0}
                onClick={() => {
                  setTerm((n) => n - 1);
                  setFlipped(false);
                }}
              >
                ← Thẻ trước
              </button>
              <button
                disabled={term === 3}
                onClick={() => {
                  setTerm((n) => n + 1);
                  setFlipped(false);
                }}
              >
                Thẻ tiếp →
              </button>
            </div>
            <small>
              Lật thẻ giúp làm quen; bài tự nhớ ở bước 3 mới ghi kết quả.
            </small>
          </div>
          <button className="pv-primary pv-next" onClick={() => go(2)}>
            Thử trong câu mới <ArrowRight size={18} />
          </button>
        </section>
      )}
      <div hidden={step !== 2}>
        <Quiz lesson={l} user={user} speak={speak} />
      </div>
    </section>
  );
}
function Quiz({ lesson: l, user, speak }) {
  const [progress, setProgress] = useState(null),
    [loadError, setLoadError] = useState(""),
    [reload, setReload] = useState(0),
    [index, setIndex] = useState(0),
    [queue, setQueue] = useState(() => l.questions.map((_, i) => i)),
    [responses, setResponses] = useState({}),
    [firstResponses, setFirstResponses] = useState({}),
    [answer, setAnswer] = useState(""),
    [tokens, setTokens] = useState([]),
    [hinted, setHinted] = useState(false),
    [result, setResult] = useState(null),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [done, setDone] = useState(false);
  const pending = useRef(null),
    lock = useRef(false),
    field = useRef(null);
  useEffect(() => {
    if (!user) return;
    const ac = new AbortController();
    api(`/me/phrasal/${l.id}`, { signal: ac.signal })
      .then((p) => {
        setProgress(p);
        setQueue(phrasalQueue(l.questions, p.attempts, p.today));
        setIndex(0);
      })
      .catch((e) => {
        if (!ac.signal.aborted) setLoadError(e.message);
      });
    return () => ac.abort();
  }, [l.id, user, reload]);
  const questionIndex = queue[index] ?? 0;
  const q = l.questions[questionIndex],
    isOrder = q.id === "word-order";
  const bank = l.order.map((word, id) => ({ word, id })).reverse();
  const current = isOrder ? tokens.map((id) => l.order[id]).join(" ") : answer;
  async function submit(e) {
    e.preventDefault();
    if (lock.current || result || !current.trim()) return;
    lock.current = true;
    setBusy(true);
    setError("");
    const body = {
      version: l.version,
      questionId: q.id,
      answer: current,
      hinted,
    };
    const signature = JSON.stringify(body);
    if (pending.current?.signature !== signature)
      pending.current = { signature, key: eventKey() };
    try {
      let feedback;
      if (user) {
        const p = await api(`/me/phrasal/${l.id}/attempts`, {
          method: "POST",
          body: { ...body, key: pending.current.key },
        });
        setProgress(p);
        feedback = p.result;
      } else
        feedback = {
          correct: checkAnswer(current, q.answer),
          expected: q.answer,
          explanation: q.explanation,
        };
      setResult(feedback);
      const record = { ...feedback, hinted, answer: current };
      setResponses((prev) => ({ ...prev, [questionIndex]: record }));
      setFirstResponses((prev) =>
        questionIndex in prev ? prev : { ...prev, [questionIndex]: record },
      );
    } catch (e) {
      setError("Chưa lưu kết quả. " + e.message);
    } finally {
      lock.current = false;
      setBusy(false);
    }
  }
  function next() {
    if (index === queue.length - 1) {
      setDone(true);
      return;
    }
    setIndex((n) => n + 1);
    setAnswer("");
    setTokens([]);
    setHinted(false);
    setResult(null);
    setError("");
    pending.current = null;
    field.current?.focus();
  }
  function startRound(indices, fresh = false) {
    setQueue(indices);
    setIndex(0);
    setDone(false);
    setAnswer("");
    setTokens([]);
    setHinted(false);
    setResult(null);
    setError("");
    pending.current = null;
    if (fresh) {
      setResponses({});
      setFirstResponses({});
    }
  }
  const missed = Object.keys(responses)
    .map(Number)
    .filter((i) => !responses[i].correct || responses[i].hinted);
  if (user && !progress)
    return (
      <div className="pv-quiz">
        {loadError ? (
          <div role="alert">
            <p>Chưa tải được bài đã làm: {loadError}</p>
            <button
              onClick={() => {
                setLoadError("");
                setReload((n) => n + 1);
              }}
            >
              Thử tải lại
            </button>
          </div>
        ) : (
          <p role="status">Đang tải bài đã làm…</p>
        )}
      </div>
    );
  if (!queue.length)
    return (
      <section className="pv-quiz">
        <Check size={32} aria-hidden="true" />
        <h3>Hôm nay bài này chưa cần ôn.</h3>
        <p>
          Kết quả đã lưu. Bạn có thể quay lại theo ngày ôn hoặc luyện thêm nếu
          muốn.
        </p>
        <ul>
          {progress?.attempts.map((a) => (
            <li key={a.question_id}>
              {l.questions.find((q) => q.id === a.question_id)?.answer} · ngày
              ôn {a.due_day}
            </li>
          ))}
        </ul>
        <button
          className="pv-primary"
          onClick={() =>
            startRound(
              l.questions.map((_, i) => i),
              true,
            )
          }
        >
          Luyện thêm cả bài
        </button>
      </section>
    );
  if (done)
    return (
      <section className="pv-quiz">
        <Check size={32} aria-hidden="true" />
        <h3>Đã đi hết lượt luyện này.</h3>
        <p className="pv-result-score">
          <strong>
            {
              Object.values(firstResponses).filter(
                (a) => a.correct && !a.hinted,
              ).length
            }
            /{Object.keys(firstResponses).length}
          </strong>{" "}
          câu đúng không gợi ý ở lần trả lời đầu của lượt này.
        </p>
        <ul className="pv-result-list">
          {Object.keys(responses)
            .map(Number)
            .map((i) => (
              <li key={i}>
                <strong>{l.questions[i].answer}</strong>
                <span>
                  {!responses[i].correct
                    ? "Cần thử lại"
                    : responses[i].hinted
                      ? "Đúng với gợi ý"
                      : "Đúng không gợi ý"}
                  {i === 4 ? " · ghép từ có sẵn" : ""}
                </span>
              </li>
            ))}
        </ul>
        <p>
          {user
            ? "Kết quả từng câu đã lưu. Câu sai hoặc dùng gợi ý cần thử lại; đúng một lần chưa có nghĩa là nhớ lâu."
            : "Đây là lượt học thử, chưa lưu vào tài khoản."}
        </p>
        {user && (
          <p>
            {progress.attempts.filter((a) => a.correct && !a.hinted).length}/5
            câu đúng không gợi ý ở lượt gần nhất.
          </p>
        )}
        {missed.length > 0 && (
          <button className="pv-primary" onClick={() => startRound(missed)}>
            Luyện lại {missed.length} câu cần nhớ
          </button>
        )}
        <button
          className="pv-primary"
          onClick={() =>
            startRound(
              l.questions.map((_, i) => i),
              true,
            )
          }
        >
          Luyện lại từ đầu
        </button>
        <p>
          Lịch ôn tự nhớ: 1–3–7–14–30 ngày qua các ngày đến hạn; luyện lặp trong
          ngày không tăng mức.
        </p>
      </section>
    );
  return (
    <form className="pv-quiz" onSubmit={submit}>
      <span className="pv-eyebrow">
        {isOrder ? "GHÉP CÂU" : "TỰ NHỚ TRONG CÂU MỚI"} · {index + 1} /{" "}
        {queue.length}
      </span>
      <progress
        max={queue.length}
        value={index}
        aria-label="Vị trí trong lượt luyện"
      />
      <h3>{q.prompt}</h3>
      {isOrder ? (
        <>
          <p>Chọn từ theo thứ tự. Bấm từ đã chọn để bỏ ra.</p>
          <div className="pv-token-answer" aria-label="Câu đang ghép">
            {tokens.length ? (
              tokens.map((id, i) => (
                <button
                  type="button"
                  key={id}
                  disabled={busy || !!result}
                  onClick={() => setTokens(tokens.filter((_, n) => n !== i))}
                >
                  {l.order[id]} ×
                </button>
              ))
            ) : (
              <span>Câu của bạn sẽ xuất hiện ở đây…</span>
            )}
          </div>
          <div className="pv-token-bank">
            {bank.map(({ word, id }) => (
              <button
                type="button"
                key={id}
                disabled={tokens.includes(id) || busy || !!result}
                onClick={() => setTokens([...tokens, id])}
              >
                {word}
              </button>
            ))}
          </div>
        </>
      ) : (
        <label>
          Cụm từ của bạn
          <input
            ref={field}
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            disabled={busy || !!result}
            autoComplete="off"
            autoCapitalize="none"
            spellCheck={false}
            maxLength={500}
          />
        </label>
      )}
      {!result && (
        <div className="pv-quiz-actions">
          <button type="button" disabled={busy} onClick={() => setHinted(true)}>
            Cần gợi ý
          </button>
          <button className="pv-primary" disabled={busy || !current.trim()}>
            {busy ? "Đang lưu…" : "Kiểm tra câu trả lời"}
          </button>
        </div>
      )}
      {hinted && !result && (
        <p className="pv-hint">
          Gợi ý:{" "}
          {isOrder ? l.order.slice(0, 3).join(" ") : q.answer.split(" ")[0]}…
          Lượt này sẽ được ghi nhận là có gợi ý.
        </p>
      )}
      {error && (
        <p role="alert">
          {error} Giữ nguyên câu trả lời và bấm kiểm tra để thử gửi lại.
        </p>
      )}
      {result && (
        <div className="pv-feedback" role="status">
          <h4>
            {result.correct
              ? hinted
                ? "Đúng với gợi ý."
                : "Đúng rồi!"
              : "Thử nhớ cách nói này."}
          </h4>
          <p>
            <strong>{result.expected}</strong>{" "}
            <Audio speak={speak} text={result.expected} label="Đọc đáp án" />
          </p>
          <p>{result.explanation}</p>
          <small>
            {user
              ? `Đã lưu · ngày ôn ${result.due}`
              : "Học thử · chưa lưu tài khoản"}
          </small>
          <button type="button" className="pv-primary" onClick={next}>
            {index === queue.length - 1 ? "Xem kết quả" : "Câu tiếp theo"}{" "}
            <ArrowRight size={17} />
          </button>
        </div>
      )}
    </form>
  );
}
