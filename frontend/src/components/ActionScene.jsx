import React, { useEffect, useState } from "react";
import { Play, RotateCcw, ArrowRight, Eye, Check } from "lucide-react";
import { checkAnswer } from "../../../shared/learning.js";
import "./action-scene.css";

const scenes = {
  cafe: {
    phrase: "pick it up",
    meaning: "nhấc / lấy món lên",
    before: "Cốc còn trên quầy.",
    after: "Cốc đã ở trong tay.",
    sentence: "Your coffee is ready. You can pick it up.",
    prompt: "Your coffee is ready. You can ________.",
    answers: ["pick it up"],
    note: "It thay cho cốc cà phê. Đại từ đứng giữa: pick it up, không phải pick up it.",
  },
  bus: {
    phrase: "get off",
    meaning: "xuống xe",
    before: "Hành khách còn ở trên xe.",
    after: "Hành khách đã xuống vỉa hè.",
    sentence: "We need to get off at the next stop.",
    prompt: "We need to ________ at the next stop.",
    answers: ["get off"],
    note: "Get off a bus/train. Với ô tô hoặc taxi, thường dùng get out of. Get on diễn tả chiều ngược lại: lên xe.",
  },
};

function Frame({ kind, phase, onEnd }) {
  return (
    <svg
      className={`action-art action-${kind} action-${phase}`}
      viewBox="0 0 520 330"
      role="img"
      aria-label={
        kind === "cafe"
          ? "Cảnh một người lấy cốc cà phê ở quầy"
          : "Cảnh một hành khách bước từ cửa xe buýt xuống vỉa hè"
      }
    >
      <rect width="520" height="330" rx="16" fill="#e9e6d8" />
      {kind === "cafe" ? (
        <>
          <path d="M28 25h160v147H28z" fill="#b7cdc8" />
          <path d="M108 25v147M28 100h160" stroke="#faf5e7" strokeWidth="7" />
          <path d="M342 36h139v97H342z" fill="#263b54" />
          <text
            x="362"
            y="79"
            fill="#f7e8b3"
            fontFamily="Georgia"
            fontSize="21"
          >
            COFFEE
          </text>
          <path d="M362 98h88" stroke="#8c9ba0" strokeWidth="3" />
          <path d="M0 278h520v52H0z" fill="#c8c5ae" />
          <path
            d="m176 235-5 69m39-69 9 69"
            stroke="#293f50"
            strokeWidth="15"
            strokeLinecap="round"
          />
          <path d="M168 153q25-20 55 0l7 87h-68z" fill="#315ace" />
          <circle cx="195" cy="123" r="23" fill="#e4af86" />
          <path d="M172 116q0-35 33-24l16 28-16-15-30 15" fill="#344139" />
          <path
            d="m208 162 37 28"
            stroke="#e4af86"
            strokeWidth="13"
            strokeLinecap="round"
          />
          <path d="M276 223h223v82H276z" fill="#ae805b" />
          <path d="M267 214h240v12H267z" fill="#705e48" />
          <g className="action-moving" onAnimationEnd={onEnd}>
            <path
              d="m245 190 51 15"
              stroke="#e4af86"
              strokeWidth="12"
              strokeLinecap="round"
            />
            <path
              d="m292 181 5 32h22l5-32z"
              fill="#fff9e9"
              stroke="#a68657"
              strokeWidth="2"
            />
            <path
              d="M290 180h36"
              stroke="#263b54"
              strokeWidth="5"
              strokeLinecap="round"
            />
            <path d="M297 191h24v10h-24z" fill="#e5bd62" />
            <path
              d="M300 202h-8"
              stroke="#e4af86"
              strokeWidth="8"
              strokeLinecap="round"
            />
          </g>
          <path
            d="M330 183q15-30-7-48m-1 0 1 13m-1-13 13 2"
            fill="none"
            stroke="#315ace"
            strokeWidth="3"
            strokeDasharray="5 4"
            opacity=".7"
          />
        </>
      ) : (
        <>
          <path d="M24 41h306q29 0 29 30v175H24z" fill="#668f93" />
          <path d="M24 164h220v58H24z" fill="#e9c974" />
          <path d="M43 66h78v83H43zm92 0h78v83h-78z" fill="#cee0db" />
          <path d="M237 67h99v179h-99z" fill="#263b54" />
          <path d="M241 228h91v10h-91zm0 13h106v10H241z" fill="#9eb3b4" />
          <circle cx="89" cy="245" r="27" fill="#2d4149" />
          <circle cx="89" cy="245" r="12" fill="#c1ceca" />
          <path d="M0 285h520v45H0z" fill="#b9b9a5" />
          <path d="M340 268h180v17H340z" fill="#d0c9b3" />
          <path d="M457 38v229" stroke="#50635b" strokeWidth="6" />
          <rect x="431" y="33" width="52" height="49" rx="7" fill="#315ace" />
          <text x="443" y="65" fontSize="23" fill="#fff">
            24
          </text>
          <g className="action-moving" onAnimationEnd={onEnd}>
            <path
              className="action-leg-one"
              d="m270 178-7 51"
              stroke="#263b54"
              strokeWidth="11"
              strokeLinecap="round"
            />
            <path
              className="action-leg-two"
              d="m288 178 7 51"
              stroke="#263b54"
              strokeWidth="11"
              strokeLinecap="round"
            />
            <path d="M260 124q18-13 37 0l4 61h-45z" fill="#ce7953" />
            <circle cx="278" cy="99" r="19" fill="#e4af86" />
            <path d="M259 94q1-29 27-20l12 24-13-13-25 13" fill="#344139" />
            <path
              d="m262 132-9 31m42-31 17 18"
              stroke="#e4af86"
              strokeWidth="9"
              strokeLinecap="round"
            />
            <rect
              x="238"
              y="161"
              width="24"
              height="35"
              rx="3"
              fill="#f4d680"
            />
          </g>
          <path
            d="M320 259q34 22 67 0m0 0-12-1m12 1-3 11"
            fill="none"
            stroke="#315ace"
            strokeWidth="3"
            strokeDasharray="5 4"
          />
        </>
      )}
    </svg>
  );
}

export default function ActionScene({
  kind = "cafe",
  motion = true,
  compact = false,
}) {
  const scene = scenes[kind];
  const [phase, setPhase] = useState("before"),
    [run, setRun] = useState(0),
    [quiz, setQuiz] = useState(false),
    [answer, setAnswer] = useState(""),
    [result, setResult] = useState(null);
  const [reduced, setReduced] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    if ((!motion || reduced) && phase === "playing") setPhase("after");
  }, [motion, reduced, phase]);
  function play() {
    setRun((n) => n + 1);
    setPhase(!motion || reduced ? "after" : "playing");
  }
  function toggleQuiz() {
    setQuiz(!quiz);
    setAnswer("");
    setResult(null);
  }
  return (
    <section
      className={`action-scene ${compact ? "action-compact" : ""}`}
      aria-label="Học cụm từ qua hành động"
    >
      <div className="action-heading">
        <span>WATCH THE MEANING</span>
        <span>{kind === "cafe" ? "01 / CAFÉ" : "02 / BUS STOP"}</span>
      </div>
      <Frame
        key={run}
        kind={kind}
        phase={phase}
        onEnd={(e) => {
          if (e.target === e.currentTarget) setPhase("after");
        }}
      />
      <div
        className="action-timeline"
        role="group"
        aria-label="Các bước hành động"
      >
        <button
          aria-pressed={phase === "before"}
          onClick={() => setPhase("before")}
        >
          1. Trước
        </button>
        <span />
        <button
          aria-pressed={phase === "after"}
          onClick={() => setPhase("after")}
        >
          2. Sau
        </button>
      </div>
      <div className="action-controls">
        <button
          className="action-play"
          disabled={phase === "playing"}
          onClick={play}
        >
          {phase === "before" ? <Play size={16} /> : <RotateCcw size={16} />}{" "}
          {phase === "playing"
            ? "Đang diễn ra…"
            : phase === "before"
              ? "Xem hành động"
              : "Phát lại"}
        </button>
        <p aria-live="polite">
          {phase === "before"
            ? scene.before
            : phase === "after"
              ? scene.after
              : "Quan sát vị trí thay đổi."}
        </p>
      </div>
      {(!motion || reduced) && (
        <p className="action-static-note">
          Đang giảm chuyển động. Chọn Trước / Sau để so sánh hai trạng thái.
        </p>
      )}
      {!quiz ? (
        <div className="action-explanation">
          <h3>
            {scene.phrase} <small>{scene.meaning}</small>
          </h3>
          <p>{scene.sentence}</p>
          <button className="action-quiz-toggle" onClick={toggleQuiz}>
            Giấu cụm, thử nhớ <ArrowRight size={15} />
          </button>
        </div>
      ) : (
        <form
          className="action-quiz"
          onSubmit={(e) => {
            e.preventDefault();
            if (answer.trim() && result === null)
              setResult(
                checkAnswer(answer, scene.answers[0], scene.answers.slice(1)),
              );
          }}
        >
          <label>
            {scene.prompt}
            <input
              aria-label="Cụm từ cho hành động"
              placeholder="Nhìn hành động và điền cụm…"
              value={answer}
              disabled={result !== null}
              onChange={(e) => setAnswer(e.target.value)}
              autoComplete="off"
              spellCheck="false"
            />
          </label>
          <div>
            <button type="button" onClick={toggleQuiz}>
              <Eye size={15} /> Xem giải thích
            </button>
            <button type="submit" disabled={!answer.trim() || result !== null}>
              <Check size={15} /> Kiểm tra cụm
            </button>
          </div>
          {result !== null && (
            <p
              role="status"
              className={result ? "action-correct" : "action-retry"}
            >
              {result ? "Đúng rồi!" : "Cụm cần điền là"}{" "}
              <strong>{scene.phrase}</strong>. {scene.note}
            </p>
          )}
          <small>Thử nhanh để hiểu nghĩa; chưa cộng vào tiến độ học.</small>
        </form>
      )}
    </section>
  );
}
