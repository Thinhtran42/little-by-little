import { Volume2 as PlaybackIcon } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { stationLesson as lesson } from "../../../shared/station-lesson.js";
import { checkAnswer } from "../../../shared/learning.js";
import { useLearner } from "../state/LearnerContext.jsx";
import { api } from "../services/api.js";
import { eventKey } from "../services/eventKey.js";

export default function StationLesson({ speak }) {
  const { user } = useLearner();
  return <Lesson key={user?.id || "guest"} user={user} speak={speak} />;
}
export function StationScene() {
  return (
    <svg
      viewBox="0 0 700 260"
      role="img"
      aria-label="Linh cầm vali chờ ngoài cửa ga; Mai lái xe đến đón, hướng về phía Linh."
      className="story-scene"
    >
      <rect width="700" height="260" rx="24" fill="#e7eee8" />
      <rect x="420" y="30" width="250" height="170" rx="8" fill="#d3b997" />
      <path d="M450 200V100Q490 45 530 100V200" fill="#537e78" />
      <rect x="554" y="87" width="78" height="58" fill="#fff3d1" />
      <text x="545" y="61" textAnchor="middle" fill="#423f39" fontSize="18">
        STATION
      </text>
      <path d="M0 205H700" stroke="#b9c7bb" strokeWidth="8" />
      <rect x="85" y="150" width="210" height="58" rx="20" fill="#e3a369" />
      <path d="M125 151L145 112H235L268 151Z" fill="#729b9b" />
      <circle cx="130" cy="210" r="19" fill="#384943" />
      <circle cx="250" cy="210" r="19" fill="#384943" />
      <circle cx="212" cy="133" r="11" fill="#f0c1a0" />
      <circle cx="380" cy="113" r="20" fill="#d9a47e" />
      <path d="M354 175V148Q380 126 400 149V175" fill="#777dae" />
      <path d="M367 175V214M392 175V214" stroke="#485c58" strokeWidth="9" />
      <rect x="420" y="163" width="28" height="45" rx="6" fill="#ce8267" />
      <path
        d="M427 163V151H440V163"
        fill="none"
        stroke="#775e50"
        strokeWidth="3"
      />
      <path
        d="M302 192H339L331 183M339 192L331 201"
        stroke="#52765b"
        strokeWidth="4"
        fill="none"
      />
      <text x="110" y="241" fontSize="14" fill="#405d50">
        Mai đến đón →
      </text>
      <text x="355" y="241" fontSize="14" fill="#405d50">
        Linh chờ ở cửa ga
      </text>
    </svg>
  );
}
function Lesson({ user, speak }) {
  const [open, setOpen] = useState(false),
    [stage, setStage] = useState("story"),
    [progress, setProgress] = useState(null),
    [error, setError] = useState(""),
    [loading, setLoading] = useState(!!user),
    [index, setIndex] = useState(0),
    [answer, setAnswer] = useState(""),
    [hinted, setHinted] = useState(false),
    [result, setResult] = useState(null),
    [pending, setPending] = useState(false);
  const key = useRef(eventKey());
  useEffect(() => {
    let alive = true;
    if (user)
      api("/me/lessons/station")
        .then((p) => {
          if (alive) {
            setProgress(p);
            setError("");
          }
        })
        .catch((e) => {
          if (alive) setError(e.message);
        })
        .finally(() => {
          if (alive) setLoading(false);
        });
    return () => {
      alive = false;
    };
  }, [user]);
  const attempts = progress?.attempts || [],
    due = attempts.filter((a) => a.due_day <= progress.today).length;
  function begin() {
    const first = lesson.questions.findIndex(
      (q) => !attempts.some((a) => a.question_id === q.id),
    );
    setIndex(first < 0 ? 0 : first);
    setAnswer("");
    setResult(null);
    setHinted(false);
    key.current = eventKey();
    setStage("test");
  }
  const q = lesson.questions[index];
  async function submit(e) {
    e.preventDefault();
    if (pending || result) return;
    setPending(true);
    setError("");
    try {
      if (user) {
        const p = await api("/me/lessons/station/attempts", {
          method: "POST",
          body: {
            key: key.current,
            version: lesson.version,
            questionId: q.id,
            answer,
            hinted,
          },
        });
        setProgress(p);
        setResult(p.result);
      } else {
        const r = {
          correct: checkAnswer(answer, q.answer, q.alternatives),
          hinted,
          expected: q.answer,
          explanation: q.explanation,
        };
        setResult(r);
        setProgress((p) => ({
          attempts: [
            ...(p?.attempts || []).filter((a) => a.question_id !== q.id),
            { question_id: q.id, correct: r.correct, hinted },
          ],
        }));
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setPending(false);
    }
  }
  function next() {
    if (index === lesson.questions.length - 1) {
      setStage("done");
      return;
    }
    setIndex(index + 1);
    setAnswer("");
    setHinted(false);
    setResult(null);
    key.current = eventKey();
  }
  return (
    <section className="station-lesson phrasal-stories">
      <span className="eyebrow">BÀI MẪU · 3 CỤM · 1 VIỆC BẠN LÀM ĐƯỢC</span>
      <h2>{lesson.title}</h2>
      <p>{lesson.goal}</p>
      {!open ? (
        <>
          <StationScene />
          <p>
            {attempts.length
              ? `Đã luyện ${attempts.length}/4 câu hỏi. ${due ? `${due} câu đến ngày ôn.` : "Có thể tiếp tục hoặc luyện lại."}`
              : "Linh vừa đến ga. Bạn sẽ nhắn gì để thu xếp chuyến xe về nhà?"}
          </p>
          <button className="primary" onClick={() => setOpen(true)}>
            Vào tình huống →
          </button>
        </>
      ) : (
        <>
          <div className="practice-path">
            <span className={stage === "story" ? "current" : ""}>
              1 · Hiểu câu chuyện
            </span>
            <span className={stage === "test" ? "current" : ""}>
              2 · Thử trả lời
            </span>
            <span className={stage === "done" ? "current" : ""}>
              3 · Nhìn lại
            </span>
          </div>
          {stage === "story" && (
            <>
              <StationScene />
              <p>
                <b>Bối cảnh:</b> Linh nhờ Mai đón ở cửa ga. Linh cần về nhà
                trước bảy giờ để gặp em gái.
              </p>
              <div className="story-dialogue">
                {lesson.dialogue.map(([name, line], i) => (
                  <p key={i}>
                    <b>{name}:</b> {line}{" "}
                    <button
                      className="text-button"
                      onClick={() => speak(line)}
                      aria-label={`Nghe lượt ${i + 1} của ${name}`}
                     title="Phát âm thanh"><PlaybackIcon size={20} aria-hidden="true" /></button>
                  </p>
                ))}
              </div>
              {lesson.targets.map((t) => (
                <details key={t.en}>
                  <summary>
                    {t.en} — {t.vi}
                  </summary>
                  <p>{t.note}</p>
                  <button className="text-button" onClick={() => speak(t.en)} aria-label="Phát âm thanh" title="Phát âm thanh"><PlaybackIcon size={20} aria-hidden="true" /></button>
                </details>
              ))}
              <button
                className="primary"
                disabled={loading || !!error}
                onClick={begin}
              >
                {attempts.length
                  ? "Tiếp tục / ôn lại"
                  : "Ẩn câu chuyện · thử nhớ"}
              </button>
            </>
          )}
          {stage === "test" && (
            <>
              <p className="eyebrow">
                CÂU {index + 1}/4 ·{" "}
                {q.id === "transfer"
                  ? "THỬ VỚI TÌNH HUỐNG MỚI"
                  : "NHỚ CỤM TRONG CÂU"}
              </p>
              <h3>{q.prompt}</h3>
              <form onSubmit={submit}>
                <label htmlFor="station-answer">
                  Điền cụm tiếng Anh còn thiếu
                </label>
                <input
                  id="station-answer"
                  className="text-field"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  disabled={pending || !!result}
                  autoComplete="off"
                  spellCheck="false"
                />
                <div className="story-actions">
                  <button
                    className="subtle-button"
                    type="button"
                    disabled={pending || !!result}
                    onClick={() => setHinted(true)}
                  >
                    Xem gợi ý
                  </button>
                  <button
                    className="primary"
                    disabled={!answer.trim() || pending || !!result}
                  >
                    {pending ? "Đang lưu…" : "Kiểm tra"}
                  </button>
                </div>
              </form>
              {hinted && !result && (
                <p className="hint-box">
                  Bắt đầu bằng “{q.answer.split(" ")[0]}”. Lượt này có hỗ trợ.
                </p>
              )}
              {result && (
                <div className="hint-box" role="status">
                  <h3>
                    {result.correct
                      ? result.hinted
                        ? "Đúng rồi, có dùng gợi ý."
                        : "Đúng mẫu câu!"
                      : "Cùng sửa lại nhé."}
                  </h3>
                  <strong>{result.expected}</strong>
                  <p>{result.explanation}</p>
                  <button
                    className="text-button"
                    onClick={() => speak(result.expected)}
                   aria-label="Phát âm thanh" title="Phát âm thanh"><PlaybackIcon size={20} aria-hidden="true" /></button>
                  <button className="primary" onClick={next}>
                    {index === 3 ? "Xem kết quả" : "Câu tiếp theo →"}
                  </button>
                </div>
              )}
            </>
          )}
          {stage === "done" && (
            <>
              <h3>Bạn đã đi hết tình huống.</h3>
              <p>
                {attempts.filter((a) => a.correct && !a.hinted).length}/4 câu
                trả lời đúng không dùng gợi ý ở lượt gần nhất.
              </p>
              {attempts
                .filter((a) => !a.correct || a.hinted)
                .map((a) => (
                  <p key={a.question_id}>
                    Cần củng cố:{" "}
                    {
                      lesson.questions.find((q) => q.id === a.question_id)
                        ?.answer
                    }
                  </p>
                ))}
              <p>
                {user
                  ? "Kết quả đã lưu trong tài khoản. Bài được hẹn ôn vào ngày mai; bạn có thể quay lại mục này để ôn."
                  : "Đây là lượt dùng thử, kết quả chỉ giữ khi đang mở bài. Đăng nhập để lưu lên tài khoản."}
              </p>
              <p>
                Đúng ngay sau khi học chưa đồng nghĩa nhớ lâu. Lần sau hãy thử
                trước khi mở lại hội thoại.
              </p>
              <button className="primary" onClick={begin}>
                Thử lại không mở hội thoại
              </button>
            </>
          )}
          <button
            className="text-button"
            disabled={pending}
            onClick={() => {
              setOpen(false);
              setStage("story");
            }}
          >
            Thu gọn bài
          </button>
        </>
      )}
      {loading && <p role="status">Đang lấy tiến độ…</p>}
      {error && (
        <p role="alert">
          {error}{" "}
          <button
            className="text-button"
            onClick={() => window.location.reload()}
          >
            Tải lại để thử kết nối
          </button>
        </p>
      )}
      {!user && (
        <small>Chế độ thử · đăng nhập để lưu kết quả và ngày ôn.</small>
      )}
    </section>
  );
}
