import React, { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Volume2 } from "lucide-react";
import { courses, courseUnits } from "../../../shared/courses.js";
import { checkAnswer } from "../../../shared/learning.js";
import { useLearner } from "../state/LearnerContext.jsx";
import { api } from "../services/api.js";
import { eventKey } from "../services/eventKey.js";
import { ReadingLesson } from "./ReadingLibrary.jsx";
import { RealPhoto } from "./RealPhoto.jsx";
import "./courses.css";

export default function CourseHub({ c, initialReadingId }) {
  const { user } = useLearner();
  return <CourseWorkspace key={user?.id || "guest"} user={user} c={c} initialReadingId={initialReadingId} />;
}
function CourseWorkspace({ user, c, initialReadingId }) {
  const initialUnit = courseUnits.find(u=>u.reading.id===initialReadingId);
  const [level, setLevel] = useState(initialUnit?.level==='B2'?'b2':'b1'),
    [selected, setSelected] = useState(initialUnit || null),
    [summary, setSummary] = useState(null),
    [error, setError] = useState(""),
    [loading, setLoading] = useState(!!user),
    [refresh, setRefresh] = useState(0);
  useEffect(() => {
    if (!user) return;
    const controller = new AbortController();
    setLoading(true);
    setError("");
    api("/me/courses", { signal: controller.signal })
      .then(setSummary)
      .catch((e) => {
        if (!controller.signal.aborted) setError(e.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [user, refresh]);
  useEffect(() => () => window.speechSynthesis?.cancel(), []);
  const course = courses.find((x) => x.id === level);
  if (selected)
    return (
      <CourseUnit
        key={selected.id}
        unit={selected}
        user={user}
        c={c}
        onBack={() => {
          setSelected(null);
          setRefresh((n) => n + 1);
          window.speechSynthesis?.cancel();
          window.scrollTo(0, 0);
        }}
      />
    );
  return (
    <section className="courses">
      <div className="course-intro">
        <span className="studio-kicker">LITTLE BY LITTLE ORIGINALS</span>
        <h2>Từ biết một câu đến nói rõ một ý.</h2>
        <p>
          Hai lộ trình tự biên soạn. Chọn B1 để củng cố nền tảng, hoặc B2 nếu
          bạn đã diễn đạt được những việc thường ngày.
        </p>
        <small>
          Mức độ là định hướng biên tập; đây không phải bài thi xác định trình
          độ hay bản số hóa sách Destination.
        </small>
      </div>
      <nav className="course-levels" aria-label="Chọn trình độ">
        {courses.map((x) => (
          <button
            key={x.id}
            aria-pressed={x.id === level}
            onClick={() => setLevel(x.id)}
          >
            <strong>{x.level}</strong>
            <span>{x.title.split(" · ")[1]}</span>
            <small>
              {x.units.length} bài · {x.units.length * 3} câu kiểm tra
            </small>
          </button>
        ))}
      </nav>
      <p>
        {course.description} Mỗi buổi chọn một bài, khoảng 15–20 phút; quay lại
        câu cần ôn trước khi học bài mới.
      </p>
      {loading && <p role="status">Đang tải kết quả tài khoản…</p>}
      {error && (
        <div role="alert">
          <p>Chưa tải được kết quả: {error}</p>
          <button onClick={() => setRefresh((n) => n + 1)}>Thử tải lại</button>
        </div>
      )}
      {!user && (
        <p className="course-notice">
          Bạn đang học thử. Đăng nhập để lưu bài kiểm tra và ngày ôn; lượt làm
          của khách chỉ giữ trong màn hình đang mở.
        </p>
      )}
      <div className="course-unit-grid">
        {course.units.map((unit, i) => {
          const attempts =
            summary?.attempts.filter((a) => a.lesson_id === unit.id) || [];
          const correct = attempts.filter((a) => a.correct && !a.hinted).length;
          const due = attempts.filter((a) => a.due_day <= summary.today).length;
          return (
            <button
              className="course-unit-card"
              key={unit.id}
              onClick={() => {
                setSelected(unit);
                window.scrollTo(0, 0);
              }}
            >
              <RealPhoto scene={unit.reading.photo} />
              <div>
                <span className="studio-kicker">
                  {unit.level} / {String(i + 1).padStart(2, "0")}
                </span>
                <h3>{unit.reading.title}</h3>
                <p>{unit.reading.goal}</p>
                <small>{unit.grammar.title}</small>
                {summary && !error && (
                  <span className="course-score">
                    {correct}/3 câu đúng không gợi ý ·{" "}
                    {due
                      ? `${due} câu đến ngày ôn`
                      : "Có thể luyện bất cứ lúc nào"}
                  </span>
                )}
                <span className="course-open">
                  Mở bài <ArrowRight size={18} />
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
function CourseUnit({ unit, user, c, onBack }) {
  const [stage, setStage] = useState("overview");
  const heading = useRef(null);
  useEffect(() => {
    heading.current?.focus({ preventScroll: true });
    return () => window.speechSynthesis?.cancel();
  }, []);
  if (stage === "read")
    return (
      <ReadingLesson
        lesson={unit.reading}
        speak={c.speak}
        onBack={() => setStage("overview")}
        backLabel="Về bài trong lộ trình"
      />
    );
  const related = c.phrases.filter((p) => p.topic === unit.topic).slice(0, 5);
  return (
    <section className="courses course-unit">
      <button className="studio-link" onClick={onBack}>
        <ArrowLeft size={17} /> Về lộ trình B1/B2
      </button>
      <h2 ref={heading} tabIndex={-1}>
        {unit.reading.title}
      </h2>
      <p>{unit.reading.goal}</p>
      <nav className="reading-tabs" aria-label="Hoạt động trong bài">
        {[
          ["overview", "Cấu trúc & cách dùng"],
          ["cards", "Flashcard"],
          ["read", "Đọc & hội thoại"],
          ["quiz", "Kiểm tra & ôn"],
        ].map(([id, label]) => (
          <button
            key={id}
            aria-pressed={stage === id}
            onClick={() => {
              setStage(id);
              window.speechSynthesis?.cancel();
            }}
          >
            {label}
          </button>
        ))}
      </nav>
      {stage === "overview" && (
        <>
          <div className="course-grammar">
            <span className="studio-kicker">NGỮ PHÁP TRONG TÌNH HUỐNG</span>
            <h3>{unit.grammar.title}</h3>
            <p>{unit.grammar.rule}</p>
            <blockquote lang="en">{unit.grammar.example}</blockquote>
            <button
              className="studio-icon"
              aria-label="Nghe ví dụ ngữ pháp"
              onClick={() => c.speak(unit.grammar.example)}
            >
              <Volume2 size={20} />
            </button>
          </div>
          <h3>Lượt học gợi ý</h3>
          <ol>
            <li>Đọc cấu trúc, tự đặt một câu về bạn.</li>
            <li>Lật thẻ để nhớ nghĩa và cách kết hợp từ.</li>
            <li>Đọc hai tình huống, đổi vai trong hội thoại.</li>
            <li>Làm ba câu kiểm tra; quay lại ôn theo kết quả.</li>
          </ol>
          <button className="studio-button" onClick={() => setStage("cards")}>
            Bắt đầu với flashcard <ArrowRight size={18} />
          </button>
          {related.length > 0 && (
            <div className="course-related">
              <h3>Luyện thêm trong kho câu hiện có</h3>
              <p>
                5 câu cùng chủ đề. Kết quả được ghi theo cơ chế học và ôn của
                kho câu.
              </p>
              <button className="studio-link" onClick={() => c.start(related)}>
                Luyện 5 câu liên quan <ArrowRight size={18} />
              </button>
            </div>
          )}
        </>
      )}
      {stage === "cards" && (
        <CourseCards terms={unit.reading.terms} speak={c.speak} />
      )}
      {stage === "quiz" && <CourseQuiz key={unit.id} unit={unit} user={user} />}
    </section>
  );
}
function CourseCards({ terms, speak }) {
  const [index, setIndex] = useState(0),
    [flipped, setFlipped] = useState(false);
  const [en, vi, note, example] = terms[index];
  return (
    <div className="course-flash">
      <p>
        Thẻ {index + 1}/{terms.length} · Thử nói nghĩa trước khi lật.
      </p>
      <button
        className="course-flash-face"
        aria-label={flipped ? "Ẩn nghĩa flashcard" : "Lật flashcard xem nghĩa"}
        aria-pressed={flipped}
        onClick={() => setFlipped(!flipped)}
      >
        <strong lang="en">{en}</strong>
        {flipped ? (
          <>
            <span>{vi}</span>
            <small>{note}</small>
            <em lang="en">{example}</em>
          </>
        ) : (
          <span>Chạm để xem nghĩa và ví dụ</span>
        )}
      </button>
      <button
        className="studio-icon"
        aria-label="Nghe câu ví dụ flashcard"
        onClick={() => speak(example)}
      >
        <Volume2 size={20} />
      </button>
      <div className="course-card-controls">
        <button
          disabled={index === 0}
          onClick={() => {
            setIndex(index - 1);
            setFlipped(false);
          }}
        >
          Thẻ trước
        </button>
        <button
          disabled={index === terms.length - 1}
          onClick={() => {
            setIndex(index + 1);
            setFlipped(false);
          }}
        >
          Thẻ tiếp
        </button>
      </div>
      <small>
        Lật thẻ giúp luyện nhớ; thao tác này không đánh dấu đã thành thạo.
      </small>
    </div>
  );
}
export function CourseQuiz({ unit, user, apiBase='/me/courses' }) {
  const [progress, setProgress] = useState(null),
    [loading, setLoading] = useState(!!user),
    [error, setError] = useState(""),
    [index, setIndex] = useState(0),
    [answer, setAnswer] = useState(""),
    [hinted, setHinted] = useState(false),
    [result, setResult] = useState(null),
    [pending, setPending] = useState(false),
    [done, setDone] = useState(false),
    [reload, setReload] = useState(0);
  const key = useRef(eventKey()),
    alive = useRef(true);
  useEffect(() => {
    alive.current = true;
    const ac = new AbortController();
    if (user) {
      setLoading(true);
      api(`${apiBase}/${unit.id}`, { signal: ac.signal })
        .then((p) => {
          setProgress(p);
          const next = unit.questions.findIndex(
            (q) =>
              !p.attempts.some(
                (a) =>
                  a.question_id === q.id &&
                  a.correct &&
                  !a.hinted &&
                  a.due_day > p.today,
              ),
          );
          setIndex(next < 0 ? 0 : next);
          setError("");
        })
        .catch((e) => {
          if (!ac.signal.aborted) setError(e.message);
        })
        .finally(() => {
          if (!ac.signal.aborted) setLoading(false);
        });
    }
    return () => {
      alive.current = false;
      ac.abort();
    };
  }, [user, unit, reload, apiBase]);
  const q = unit.questions[index];
  async function submit(e) {
    e.preventDefault();
    if (pending || result) return;
    setPending(true);
    setError("");
    try {
      if (user) {
        const p = await api(`${apiBase}/${unit.id}/attempts`, {
          method: "POST",
          body: {
            key: key.current,
            version: unit.version,
            questionId: q.id,
            answer,
            hinted,
          },
        });
        if (!alive.current) return;
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
      if (alive.current) setError(`Chưa lưu được câu trả lời: ${e.message}`);
    } finally {
      if (alive.current) setPending(false);
    }
  }
  function reset(next) {
    setIndex(next);
    setAnswer("");
    setHinted(false);
    setResult(null);
    setError("");
    key.current = eventKey();
  }
  if (loading) return <p role="status">Đang tải bài kiểm tra…</p>;
  if (user && !progress)
    return (
      <div role="alert">
        <p>Chưa tải được tiến độ: {error}</p>
        <button onClick={() => setReload((n) => n + 1)}>Thử tải lại</button>
      </div>
    );
  if (done)
    return (
      <div className="course-grammar">
        <h3>Kết quả lượt luyện</h3>
        <p>
          {progress?.attempts.filter((a) => a.correct && !a.hinted).length || 0}
          /3 câu có kết quả gần nhất đúng, không dùng gợi ý.
        </p>
        <p>
          {user
            ? "Đã lưu vào tài khoản. Câu sai hoặc dùng gợi ý ôn lại hôm nay; câu tự nhớ đúng qua các ngày có khoảng ôn 1, 3, 7, 14 rồi 30 ngày."
            : "Lượt khách chưa được lưu vào tài khoản."}
        </p>
        <small>
          Một lượt đúng chưa chứng minh đã nhớ lâu. Lặp đúng trong cùng ngày không tăng mức; trắc nghiệm chỉ hẹn lại một ngày. Đây là lịch theo quy tắc, chưa cá nhân hóa bằng mô hình ghi nhớ.
        </small>
        <button
          className="studio-button"
          onClick={() => {
            setDone(false);
            reset(0);
          }}
        >
          Luyện lại từ đầu
        </button>
      </div>
    );
  return (
    <form className="reading-recall course-quiz" onSubmit={submit}>
      <span className="studio-kicker">
        CÂU {index + 1}/3 ·{" "}
        {q.mode === "choice"
          ? "ĐỌC HIỂU"
          : q.mode === "grammar"
            ? "CẤU TRÚC"
            : "TỰ NHỚ"}
      </span>
      <h3>{q.prompt}</h3>
      {q.options ? (
        <fieldset disabled={pending || !!result}>
          <legend>Chọn câu trả lời</legend>
          {q.options.map((o) => (
            <label key={o}>
              <input
                type="radio"
                name="course-answer"
                checked={answer === o}
                onChange={() => {
                  setAnswer(o);
                  key.current = eventKey();
                }}
              />
              {o}
            </label>
          ))}
        </fieldset>
      ) : (
        <label>
          Câu trả lời
          <input
            aria-label="Câu trả lời lộ trình"
            value={answer}
            disabled={pending || !!result}
            onChange={(e) => {
              setAnswer(e.target.value);
              key.current = eventKey();
            }}
            autoComplete="off"
            spellCheck="false"
          />
        </label>
      )}
      {!result && (
        <div className="course-card-controls">
          <button
            className="studio-button"
            disabled={pending || !answer.trim()}
          >
            {pending ? "Đang lưu…" : "Kiểm tra đáp án"}
          </button>
          <button
            type="button"
            disabled={pending}
            onClick={() => {
              setHinted(true);
              key.current = eventKey();
            }}
          >
            Xem gợi ý
          </button>
        </div>
      )}
      {hinted && !result && (
        <p role="status">Gợi ý: {q.answer}. Lượt này được ghi là có hỗ trợ.</p>
      )}
      {error && <p role="alert">{error}</p>}
      {result && (
        <>
          <p role="status">
            {result.correct ? "Đúng rồi." : "Chưa đúng."} {result.explanation}{" "}
            Đáp án: {result.expected}.{" "}
            {user ? "Đã lưu kết quả." : "Lượt thử chưa lưu vào tài khoản."}
            {user&&result.due&&<> Ngày ôn: <time dateTime={result.due}>{result.due.split('-').reverse().join('/')}</time>.</>}
          </p>
          <button
            type="button"
            className="studio-button"
            onClick={() =>
              index === unit.questions.length - 1
                ? setDone(true)
                : reset(index + 1)
            }
          >
            {index === unit.questions.length - 1
              ? "Xem kết quả"
              : "Câu tiếp theo"}
          </button>
        </>
      )}
      <small>
        {user
          ? "Máy chủ chấm và lưu từng câu vào tài khoản."
          : "Khách học thử: đóng bài sẽ mất lượt làm này."}{" "}
        Kết quả lộ trình có trong Tổng quan, Ôn tập và Tiến bộ; số câu kho cũ vẫn được thống kê riêng.
      </small>
    </form>
  );
}
