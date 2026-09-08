import { eventKey } from "../services/eventKey.js";
import React, { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Check,
  Download,
  Upload,
  Target,
  BookOpen,
  RotateCcw,
  MessageCircle,
  TrendingUp,
  ShieldCheck,
  X,
  Volume2,
  Headphones,
  PenLine,
  Flame,
  Settings,
  Trash2,
  Lightbulb,
} from "lucide-react";
import { useCatalog } from "../state/CatalogContext.jsx";
import { useLearner } from "../state/LearnerContext.jsx";
import {
  dayKey,
  focusTopics,
  mastery,
  normalizeProgress,
  initialState,
  streak,
} from "../progress.js";

import { VoiceRecorder } from "./StudySession.jsx";
const focusLabels = {
  everyday: "Giao tiếp hằng ngày",
  work: "Công việc & sự nghiệp",
  travel: "Du lịch tự tin",
  connections: "Kết nối & trò chuyện",
};
export function Modal({ title, onClose, children }) {
  const ref = useRef(null);
  useEffect(() => {
    const prev = document.activeElement,
      overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    ref.current?.querySelector("button")?.focus();
    const handle = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab") {
        const buttons = [
            ...ref.current.querySelectorAll(
              "button,input,select,textarea,a[href]",
            ),
          ].filter((x) => !x.disabled),
          first = buttons[0],
          last = buttons.at(-1);
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener("keydown", handle);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", handle);
      prev?.focus();
    };
  }, []);
  return (
    <div className="modal-backdrop">
      <section
        ref={ref}
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <button
          className="modal-close icon-button"
          onClick={onClose}
          aria-label="Đóng"
        >
          <X />
        </button>
        {children}
      </section>
    </div>
  );
}
export function Onboarding({ data, setData, onClose }) {
  const [name, setName] = useState(data.profile.name),
    [focus, setFocus] = useState(data.profile.focus),
    [level, setLevel] = useState(data.profile.level),
    [goal, setGoal] = useState(data.goal);
  function finish() {
    setData((d) => ({
      ...d,
      goal,
      profile: { name: name.trim(), focus, level, onboarded: true },
    }));
    onClose();
  }
  return (
    <Modal title="Thiết kế nhịp học của bạn" onClose={onClose}>
      <span className="modal-emblem">
        <Target size={30} />
      </span>
      <div className="eyebrow">CHÀO MỪNG ĐẾN LITTLE BY LITTLE 2.0</div>
      <h2>
        Học để dùng được,
        <br />
        không chỉ để thấy quen.
      </h2>
      <p className="muted-copy">
        Một buổi học gồm nhớ lại câu cũ, học một nhóm nhỏ và thử dùng trong tình
        huống.
      </p>
      <label className="field-label" htmlFor="learner-name">
        Mình gọi bạn là gì? <span>(không bắt buộc)</span>
      </label>
      <input
        id="learner-name"
        className="text-field"
        maxLength={40}
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Tên của bạn"
      />
      <label className="field-label" htmlFor="study-focus">
        Bạn muốn dùng tiếng Anh ở đâu?
      </label>
      <select
        id="study-focus"
        className="text-field"
        value={focus}
        onChange={(e) => setFocus(e.target.value)}
      >
        {Object.entries(focusLabels).map(([id, label]) => (
          <option key={id} value={id}>
            {label}
          </option>
        ))}
      </select>
      <label className="field-label" htmlFor="study-level">
        Nhịp bắt đầu
      </label>
      <select
        id="study-level"
        className="text-field"
        value={level}
        onChange={(e) => setLevel(e.target.value)}
      >
        <option value="starter">Bắt đầu từ những câu ngắn, quen thuộc</option>
        <option value="returning">Đã có nền tảng, muốn luyện phản xạ</option>
      </select>
      <label className="field-label" htmlFor="daily-goal">
        Số câu mới tối đa mỗi ngày
      </label>
      <select
        id="daily-goal"
        className="text-field"
        value={goal}
        onChange={(e) => setGoal(Number(e.target.value))}
      >
        <option value={5}>5 câu · khoảng 10–15 phút, cộng thời gian ôn</option>
        <option value={10}>
          10 câu · khoảng 20–25 phút, cộng thời gian ôn
        </option>
        <option value={15}>
          15 câu · khoảng 30–35 phút, cộng thời gian ôn
        </option>
      </select>
      <button className="primary wide onboarding-finish" onClick={finish}>
        Tạo nhịp học của tôi <ArrowRight size={17} />
      </button>
    </Modal>
  );
}
export function PlanPanel({ data, plan, start, onPractice, onSetup }) {
  const mastered = Object.values(data.learned).filter(
    (p) => mastery(p) === "strong",
  ).length;
  return (
    <section className="today-plan">
      <div className="section-heading">
        <div>
          <h2>Lộ trình hôm nay</h2>
          <p>
            {focusLabels[data.profile.focus]} · {data.goal} câu mới tối đa
          </p>
        </div>
        <button className="text-button" onClick={onSetup}>
          <Settings size={14} />
          Điều chỉnh
        </button>
      </div>
      <div className="plan-steps">
        <button onClick={() => start(plan.due, "review")}>
          <span className="step-number">01</span>
          <div>
            <h3>Gọi lại trí nhớ</h3>
            <p>{plan.due.length} câu đến lịch ôn</p>
          </div>
          <RotateCcw size={19} />
        </button>
        <button onClick={() => start(plan.fresh, "learn")}>
          <span className="step-number">02</span>
          <div>
            <h3>Thêm điều mới</h3>
            <p>{plan.fresh.length} câu theo mục đích của bạn</p>
          </div>
          <BookOpen size={19} />
        </button>
        <button onClick={onPractice}>
          <span className="step-number">03</span>
          <div>
            <h3>Đem vào cuộc sống</h3>
            <p>Một hội thoại, ba lượt phản hồi</p>
          </div>
          <MessageCircle size={19} />
        </button>
      </div>
      <div className="mastery-note">
        <ShieldCheck size={16} />
        <span>
          <strong>{mastered} câu nhớ vững</strong> qua bài làm ở nhiều ngày.
          Tick thủ công chỉ ghi nhận đã xem.
        </span>
      </div>
    </section>
  );
}
export function PathPage({ data, start }) {
  const { topics, phrases } = useCatalog();
  const ordered = [
    ...focusTopics[data.profile.focus],
    ...topics
      .map((t) => t.id)
      .filter((id) => !focusTopics[data.profile.focus].includes(id)),
  ];
  return (
    <>
      <div className="library-intro">
        <Target size={25} />
        <span>
          <strong>Lộ trình: {focusLabels[data.profile.focus]}</strong>
          <br />
          128 bài nhỏ · 5 mục/bài. Bạn có thể chọn bất kỳ bài nào; không cần
          hoàn thành để mở khóa.
        </span>
      </div>
      <div className="path-list">
        {ordered.map((id, i) => {
          const t = topics.find((t) => t.id === id),
            pool = phrases.filter((p) => p.topic === id);
          return (
            <section className="path-topic" key={id}>
              <div className="section-heading">
                <div>
                  <span className="eyebrow">
                    CHẶNG {String(i + 1).padStart(2, "0")}
                  </span>
                  <h2>{t.name}</h2>
                  <p>{t.description}</p>
                </div>
                <span className="type-label">
                  {pool.filter((p) => data.learned[p.id]?.verified).length}/
                  {pool.length} đã tự nhớ
                </span>
              </div>
              <div className="lesson-grid">
                {Array.from({ length: 8 }, (_, n) => {
                  const items = pool.slice(n * 5, n * 5 + 5),
                    done = items.every((p) => data.learned[p.id]?.verified);
                  return (
                    <button
                      key={n}
                      className={done ? "lesson done" : "lesson"}
                      onClick={() => start(items, "learn")}
                    >
                      <span>
                        {done ? (
                          <Check size={17} />
                        ) : (
                          String(n + 1).padStart(2, "0")
                        )}
                      </span>
                      <strong>Bài {n + 1}</strong>
                      <small>{items[0].en}</small>
                      <ArrowRight size={14} />
                    </button>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </>
  );
}
export function PracticePage({ data, setData, start, speak, notify }) {
  const { topics, phrases, scenarios } = useCatalog();
  const { submitScenario } = useLearner();
  const answersRef = useRef([]),
    scenarioKey = useRef(eventKey());
  const [submitting, setSubmitting] = useState(false);
  const [active, setActive] = useState(null),
    [index, setIndex] = useState(0),
    [choice, setChoice] = useState(null),
    [score, setScore] = useState(0),
    [complete, setComplete] = useState(false);
  function launch(s) {
    answersRef.current = [];
    scenarioKey.current = eventKey();
    setActive(s);
    setIndex(0);
    setChoice(null);
    setScore(0);
    setComplete(false);
  }
  const pool = phrases.filter((p) => data.learned[p.id]);
  const recommended = (
    pool.length
      ? pool
      : phrases.filter((p) => focusTopics[data.profile.focus].includes(p.topic))
  ).slice(0, 10);
  async function advance() {
    if (submitting) return;
    if (index === active.steps.length - 1) {
      setSubmitting(true);
      try {
        const result = await submitScenario(
          active.id,
          answersRef.current,
          active,
          scenarioKey.current,
        );
        setScore(result.correct);
        setComplete(true);
      } catch (e) {
        notify(e.message);
      } finally {
        setSubmitting(false);
      }
    } else {
      setIndex(index + 1);
      setChoice(null);
    }
  }
  return (
    <>
      <div className="practice-modes">
        <button onClick={() => start(recommended, "recall")}>
          <PenLine />
          <h3>Viết từ trí nhớ</h3>
          <p>Nhìn nghĩa Việt, viết lại câu tiếng Anh.</p>
          <span>
            Luyện {recommended.length} câu <ArrowRight size={15} />
          </span>
        </button>
        <button onClick={() => start(recommended, "listen")}>
          <Headphones />
          <h3>Nghe & viết lại</h3>
          <p>Nghe câu mẫu trước khi thấy đáp án.</p>
          <span>
            Luyện {recommended.length} câu <ArrowRight size={15} />
          </span>
        </button>
        <button onClick={() => start(recommended, "choice")}>
          <BookOpen />
          <h3>Nhận diện ý nghĩa</h3>
          <p>Bước nhẹ hơn khi câu vẫn còn mới.</p>
          <span>
            Luyện {recommended.length} câu <ArrowRight size={15} />
          </span>
        </button>
      </div>
      <div className="section-heading practice-title">
        <div>
          <h2>Tiếng Anh trong một tình huống thật</h2>
          <p>Chọn lời đáp, hiểu vì sao, rồi nói lại bằng giọng của bạn.</p>
        </div>
        <span className="type-label">16 hội thoại có hướng dẫn</span>
      </div>
      <div className="scenario-grid">
        {scenarios.map((s, i) => (
          <button
            className="scenario-card"
            key={s.id}
            onClick={() => launch(s)}
          >
            <span className="scenario-number">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="type-label">
              {topics.find((t) => t.id === s.id)?.name}
            </span>
            <h3>{s.title}</h3>
            <p>{s.role}</p>
            <div>
              <span>
                {data.scenarios[s.id]
                  ? `Lần gần nhất: ${data.scenarios[s.id].correct}/3`
                  : "3 lượt phản hồi · 3–5 phút"}
              </span>
              <ArrowRight size={18} />
            </div>
          </button>
        ))}
      </div>
      {active && (
        <Modal title={active.title} onClose={() => setActive(null)}>
          {complete ? (
            <div className="session-complete">
              <span className="modal-emblem">
                <MessageCircle size={30} />
              </span>
              <h2>Cuộc trò chuyện đã hoàn thành.</h2>
              <p>
                Bạn chọn đúng {score}/{active.steps.length} lời đáp.
                <br />
                Đây là luyện hội thoại theo kịch bản, chưa phải đánh giá khả
                năng giao tiếp tự do.
              </p>
              <button className="primary wide" onClick={() => setActive(null)}>
                Quay lại luyện tập <Check size={17} />
              </button>
            </div>
          ) : (
            <>
              <div className="eyebrow">
                HỘI THOẠI CÓ HƯỚNG DẪN · {index + 1}/{active.steps.length}
              </div>
              <h2>{active.title}</h2>
              <p className="muted-copy">{active.role}</p>
              <div className="dialogue-line">
                <MessageCircle size={20} />
                <p>{active.steps[index].line}</p>
                <button
                  className="icon-button"
                  aria-label="Nghe lời đối thoại"
                  onClick={() => speak(active.steps[index].line)}
                >
                  <Volume2 size={18} />
                </button>
              </div>
              <p className="scenario-prompt">{active.steps[index].prompt}</p>
              <div className="answer-choices">
                {[
                  ...active.steps[index].options.slice((index + 1) % 3),
                  ...active.steps[index].options.slice(0, (index + 1) % 3),
                ].map((o) => (
                  <button
                    key={o}
                    disabled={choice !== null}
                    className={
                      choice !== null && o === active.steps[index].answer
                        ? "correct-option"
                        : choice === o
                          ? "wrong-option"
                          : ""
                    }
                    onClick={() => {
                      setChoice(o);
                      answersRef.current[index] = o;
                      if (o === active.steps[index].answer)
                        setScore((s) => s + 1);
                    }}
                  >
                    {o}
                  </button>
                ))}
              </div>
              {choice !== null && (
                <>
                  <div
                    className={`answer-feedback ${choice === active.steps[index].answer ? "pass" : "retry"}`}
                  >
                    <h3>
                      {choice === active.steps[index].answer
                        ? "Lời đáp phù hợp!"
                        : "Cùng thử một cách đáp tự nhiên hơn."}
                    </h3>
                    <p>{active.steps[index].answer}</p>
                    <p>{active.steps[index].why}</p>
                    <button
                      className="listen-button"
                      onClick={() => speak(active.steps[index].answer)}
                    >
                      <Volume2 size={16} />
                      Nghe lời đáp mẫu
                    </button>
                  </div>
                  <details className="personalize">
                    <summary>Đọc lại lời đáp & tự nghe</summary>
                    <VoiceRecorder key={index} />
                  </details>
                  <button
                    className="primary wide"
                    onClick={advance}
                    disabled={submitting}
                  >
                    {index === 2 ? "Xem kết quả" : "Tiếp tục hội thoại"}
                    <ArrowRight size={17} />
                  </button>
                </>
              )}
            </>
          )}
        </Modal>
      )}
    </>
  );
}
export function InsightsPage({ data, start }) {
  const { topics, phrases } = useCatalog();
  const attempts = data.attempts,
    correct = attempts.filter((a) => a.correct).length,
    strong = phrases.filter((p) => mastery(data.learned[p.id]) === "strong"),
    weak = phrases
      .filter(
        (p) =>
          (data.learned[p.id]?.wrong || 0) > 0 &&
          mastery(data.learned[p.id]) !== "strong",
      )
      .sort(
        (a, b) =>
          (data.learned[b.id]?.wrong || 0) - (data.learned[a.id]?.wrong || 0),
      );
  const days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - 13 + i);
    const key = dayKey(d),
      count = attempts.filter((a) => a.day === key).length;
    return { key, label: `${d.getDate()}/${d.getMonth() + 1}`, count };
  });
  const max = Math.max(...days.map((d) => d.count), 1);
  return (
    <>
      <div className="insight-stats">
        <article>
          <TrendingUp />
          <strong>
            {attempts.length
              ? `${Math.round((correct / attempts.length) * 100)}%`
              : "—"}
          </strong>
          <span>Đúng không dùng gợi ý</span>
          <small>Trong {attempts.length} lượt luyện gần nhất</small>
        </article>
        <article>
          <ShieldCheck />
          <strong>{strong.length}</strong>
          <span>Câu nhớ vững</span>
          <small>Đã vượt qua nhiều ngày ôn</small>
        </article>
        <article>
          <Flame />
          <strong>{streak(data.history)}</strong>
          <span>Ngày duy trì</span>
          <small>Học hoặc ôn ít nhất một câu</small>
        </article>
      </div>
      <section className="chart-card">
        <h2>14 ngày, từng bước nhỏ</h2>
        <p>Số lượt làm bài mỗi ngày. Không tính việc chỉ mở một câu.</p>
        <div
          className="activity-chart"
          role="img"
          aria-label={days.map((d) => `${d.label}: ${d.count} lượt`).join("; ")}
        >
          {days.map((d) => (
            <div key={d.key}>
              <span>{d.count || ""}</span>
              <i
                style={{ height: `${Math.max(3, (d.count / max) * 105)}px` }}
              />
              <small>{d.label}</small>
            </div>
          ))}
        </div>
      </section>
      <section className="mistakes">
        <div className="section-heading">
          <div>
            <h2>
              Sổ câu cần củng cố <span>{weak.length}</span>
            </h2>
            <p>
              Các câu từng trả lời sai hoặc cần gợi ý, chưa đạt mức nhớ vững.
            </p>
          </div>
          <button
            className="primary"
            disabled={!weak.length}
            onClick={() => start(weak.slice(0, 10), "review")}
          >
            <RotateCcw size={16} />
            Luyện câu khó
          </button>
        </div>
        {weak.length ? (
          <div className="mistake-list">
            {weak.slice(0, 20).map((p) => (
              <article key={p.id}>
                <div>
                  <h3>{p.en}</h3>
                  <p>{p.vi}</p>
                </div>
                <span>{data.learned[p.id].wrong} lần cần ôn</span>
              </article>
            ))}
          </div>
        ) : (
          <div className="small-empty">
            <Lightbulb size={25} />
            <p>
              Khi bạn bắt đầu làm bài, những câu cần luyện thêm sẽ xuất hiện ở
              đây.
            </p>
          </div>
        )}
      </section>
      <section className="chart-card">
        <h2>Tiến bộ theo chủ đề</h2>
        <p>
          Đã xem → Đang nhớ → Nhớ vững. Số liệu phản ánh bài luyện trong ứng
          dụng, không phải chứng chỉ trình độ.
        </p>
        <div className="topic-mastery">
          {topics.map((t) => {
            const pool = phrases.filter((p) => p.topic === t.id),
              seen = pool.filter(
                (p) => mastery(data.learned[p.id]) === "seen",
              ).length,
              growing = pool.filter(
                (p) => mastery(data.learned[p.id]) === "growing",
              ).length,
              strong = pool.filter(
                (p) => mastery(data.learned[p.id]) === "strong",
              ).length;
            return (
              <div key={t.id}>
                <span>{t.name}</span>
                <div className="stacked-bar">
                  <i
                    className="strong"
                    style={{ width: `${(strong / 40) * 100}%` }}
                  />
                  <i
                    className="growing"
                    style={{ width: `${(growing / 40) * 100}%` }}
                  />
                  <i
                    className="seen"
                    style={{ width: `${(seen / 40) * 100}%` }}
                  />
                </div>
                <small>{strong}/40 nhớ vững</small>
              </div>
            );
          })}
        </div>
        <div className="chart-legend">
          <span>● Nhớ vững</span>
          <span>● Đang nhớ</span>
          <span>● Đã xem</span>
        </div>
      </section>
    </>
  );
}
export function AccountPage({ data, setData, notify, onSetup, speak }) {
  const { user, status, importProgress, resetProgress } = useLearner();
  const file = useRef(null),
    [pending, setPending] = useState(null),
    [reset, setReset] = useState(false),
    [confirm, setConfirm] = useState("");
  const [recovery, setRecovery] = useState(() => {
    try {
      return localStorage.getItem("little-progress-recovery");
    } catch {
      return null;
    }
  });
  function download() {
    const blob = new Blob(
        [
          JSON.stringify(
            {
              app: "little-by-little",
              exportedAt: new Date().toISOString(),
              progress: data,
            },
            null,
            2,
          ),
        ],
        { type: "application/json" },
      ),
      url = URL.createObjectURL(blob),
      a = document.createElement("a");
    a.href = url;
    a.download = `little-by-little-${dayKey()}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    notify(
      "Đã xuất bản sao lưu. Giữ tệp này để chuyển tiến độ sang thiết bị khác.",
    );
  }
  async function upload(e) {
    const f = e.target.files[0];
    e.target.value = "";
    if (!f) return;
    if (f.size > 5 * 1024 * 1024) {
      notify("Tệp quá lớn. Bản sao lưu cần nhỏ hơn 5 MB.");
      return;
    }
    try {
      const raw = JSON.parse(await f.text());
      if (raw.app !== "little-by-little")
        throw new Error("Không phải bản sao lưu của ứng dụng.");
      setPending(normalizeProgress(raw.progress));
    } catch (err) {
      notify(
        err instanceof SyntaxError
          ? "Tệp JSON không hợp lệ. Dữ liệu hiện tại vẫn được giữ."
          : err.message,
      );
    }
  }
  return (
    <div className="account-grid">
      <section className="account-card">
        <span className="modal-emblem">
          <Target size={25} />
        </span>
        <h2>{data.profile.name || "Người học bền bỉ"}</h2>
        <p>
          {focusLabels[data.profile.focus]} · {data.goal} câu mới/ngày
        </p>
        <button className="primary" onClick={onSetup}>
          Chỉnh nhịp học <Settings size={16} />
        </button>
        <label className="field-label" htmlFor="voice-accent">
          Giọng đọc ưu tiên
        </label>
        <select
          id="voice-accent"
          className="text-field"
          value={data.audio.accent}
          onChange={(e) =>
            setData((d) => ({
              ...d,
              audio: { ...d.audio, accent: e.target.value },
            }))
          }
        >
          <option value="en-US">Anh Mỹ</option>
          <option value="en-GB">Anh Anh</option>
        </select>
        <label className="field-label" htmlFor="voice-speed">
          Tốc độ đọc
        </label>
        <select
          id="voice-speed"
          className="text-field"
          value={data.audio.rate}
          onChange={(e) =>
            setData((d) => ({
              ...d,
              audio: { ...d.audio, rate: Number(e.target.value) },
            }))
          }
        >
          <option value={0.7}>Chậm · 0.7×</option>
          <option value={0.85}>Vừa · 0.85×</option>
          <option value={1}>Tự nhiên · 1×</option>
        </select>
        <button
          className="listen-button"
          onClick={() => speak("A little progress, every day.")}
        >
          <Volume2 size={17} />
          Thử giọng đọc
        </button>
        <small>Giọng và khả năng nghe ngoại tuyến phụ thuộc thiết bị.</small>
      </section>
      <section className="account-card">
        <span className="modal-emblem">
          <ShieldCheck size={25} />
        </span>
        <h2>Dữ liệu của bạn, bạn giữ.</h2>
        <p>
          {user
            ? "Tiến độ tài khoản được lưu trên máy chủ. Đăng nhập cùng tài khoản trên thiết bị khác để tiếp tục. Bản sao lưu giúp bạn giữ thêm một bản riêng."
            : "Bạn đang dùng thử trên thiết bị. Đăng ký hoặc đăng nhập phía trên để lưu tiến độ trên máy chủ; bạn có thể chuyển tiến độ dùng thử sau khi đăng nhập."}
        </p>
        <div className="backup-actions">
          <button className="primary" onClick={download}>
            <Download size={17} />
            Xuất bản sao lưu
          </button>
          <button
            className="subtle-button"
            onClick={() => file.current.click()}
          >
            <Upload size={17} />
            Nhập bản sao lưu
          </button>
          <input
            type="file"
            hidden
            ref={file}
            accept=".json,application/json"
            onChange={upload}
          />
        </div>
        <div className="privacy-summary">
          <h3>Quyền riêng tư</h3>
          <ul>
            <li>
              Khi đăng nhập, câu trả lời, lịch học và ghi chú được lưu trong tài
              khoản trên máy chủ. Bản ghi âm vẫn chỉ ở thiết bị.
            </li>
            <li>
              Micro chỉ được dùng khi bạn bấm ghi âm. Bản ghi được giải phóng
              khi rời bài.
            </li>
            <li>Không quảng cáo, không bộ theo dõi người dùng.</li>
            <li>
              Chế độ dùng thử có thể học ngoại tuyến. Tài khoản cần kết nối để
              chấm và lưu bài làm; giọng đọc có thể cần mạng.
            </li>
          </ul>
        </div>
        {recovery && (
          <div className="hint-box">
            <strong>Có dữ liệu cũ chưa đọc được.</strong>
            <p>
              Ứng dụng đã giữ nguyên bản gốc để bạn có thể kiểm tra hoặc nhờ
              khôi phục.
            </p>
            <button
              className="subtle-button"
              onClick={() => {
                const url = URL.createObjectURL(
                    new Blob([recovery], { type: "application/json" }),
                  ),
                  a = document.createElement("a");
                a.href = url;
                a.download = "little-progress-original-recovery.json";
                a.click();
                setTimeout(() => URL.revokeObjectURL(url), 1000);
              }}
            >
              Tải bản gốc cần khôi phục
            </button>
          </div>
        )}
        <button
          className="danger-button"
          onClick={() => {
            setReset(true);
            setConfirm("");
          }}
        >
          <Trash2 size={16} />
          {user ? "Xóa tiến độ tài khoản" : "Xóa tiến độ trên thiết bị"}
        </button>
      </section>
      <section className="account-card method-card">
        <h2>Vì sao cách học này khác?</h2>
        <div className="method-grid">
          <div>
            <strong>01 · Tự gọi lại kiến thức</strong>
            <p>
              Bạn viết câu trước khi nhìn đáp án. Bài luyện không coi tick “đã
              xem” là bằng chứng đã nhớ.
            </p>
          </div>
          <div>
            <strong>02 · Ôn theo bài làm</strong>
            <p>
              Câu sai được thử lại cuối buổi và hẹn ôn sớm. Câu nhớ được qua
              nhiều ngày mới tăng khoảng cách ôn.
            </p>
          </div>
          <div>
            <strong>03 · Đặt vào tình huống</strong>
            <p>
              Hội thoại có giải thích cách đáp. Bạn có thể viết ví dụ riêng và
              tự nghe lại giọng của mình.
            </p>
          </div>
        </div>
        <p className="method-source">
          Phương pháp tham khảo:{" "}
          <a
            href="https://doi.org/10.1038/s44159-022-00089-1"
            target="_blank"
            rel="noreferrer"
          >
            Carpenter, Pan & Butler (2022), spacing & retrieval practice
          </a>
          . Hiệu quả của sản phẩm này chưa được đo bằng nghiên cứu riêng; không
          cam kết lưu loát sau một số ngày cố định.
        </p>
      </section>
      {pending && (
        <Modal title="Khôi phục bản sao lưu" onClose={() => setPending(null)}>
          <h2>Khôi phục tiến độ?</h2>
          <p className="muted-copy">
            Bản sao lưu có {Object.keys(pending.learned).length} câu đã xem và{" "}
            {pending.attempts.length} lượt luyện. Thao tác này thay thế tiến độ
            hiện tại. Với tài khoản, dữ liệu nhập được coi là đã xem và sẽ kiểm
            tra lại mức nhớ.
          </p>
          <button className="subtle-button" onClick={download}>
            Sao lưu dữ liệu hiện tại trước
          </button>
          <div className="study-buttons">
            <button className="subtle-button" onClick={() => setPending(null)}>
              Hủy
            </button>
            <button
              className="primary"
              disabled={status === "saving"}
              onClick={async () => {
                try {
                  await importProgress(pending);
                  setPending(null);
                  notify("Đã khôi phục tiến độ.");
                } catch (e) {
                  notify(e.message);
                }
              }}
            >
              Khôi phục
            </button>
          </div>
        </Modal>
      )}
      {reset && (
        <Modal title="Xóa tiến độ" onClose={() => setReset(false)}>
          <h2>Xóa toàn bộ tiến độ?</h2>
          <p className="muted-copy">
            Gõ XÓA để xác nhận. Câu đã lưu, lịch sử, ghi chú và kết quả sẽ bị
            xóa{" "}
            {user ? "khỏi tài khoản trên mọi thiết bị" : "trên thiết bị này"}.
          </p>
          <input
            aria-label="Gõ XÓA để xác nhận"
            className="text-field"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
          <div className="study-buttons">
            <button className="subtle-button" onClick={() => setReset(false)}>
              Hủy
            </button>
            <button
              className="danger-button"
              disabled={confirm !== "XÓA" || status === "saving"}
              onClick={async () => {
                try {
                  await resetProgress();
                } catch (e) {
                  notify(e.message);
                  return;
                }
                try {
                  localStorage.removeItem("little-progress-recovery");
                  setRecovery(null);
                } catch {}
                setReset(false);
                notify("Đã xóa tiến độ.");
              }}
            >
              Xóa vĩnh viễn
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
