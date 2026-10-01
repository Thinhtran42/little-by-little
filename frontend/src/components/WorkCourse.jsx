import React, { useEffect, useRef, useState } from "react";
import { Volume2, ArrowLeft, ArrowRight } from "lucide-react";
import {
  workWeeks,
  workLessons,
  workStatus,
} from "../../../shared/work-course.js";
import { useLearner } from "../state/LearnerContext.jsx";
import { api } from "../services/api.js";
import { CourseQuiz } from "./CourseHub.jsx";
import { WorkComprehension, WorkListening } from "./WorkPractice.jsx";
import { RealPhoto, PhotoCredit } from "./RealPhoto.jsx";
import "./work-course.css";

function Audio({ text, speak, label }) {
  return (
    <button
      type="button"
      className="wc-audio"
      aria-label={label}
      onClick={() => speak(text)}
    >
      <Volume2 size={20} aria-hidden="true" />
    </button>
  );
}
export default function WorkCourse({ speak }) {
  const { user } = useLearner();
  return <Workspace key={user?.id || "guest"} user={user} speak={speak} />;
}
function Workspace({ user, speak }) {
  const [week, setWeek] = useState(0),
    [selected, setSelected] = useState(null),
    [summary, setSummary] = useState(null),
    [error, setError] = useState(""),
    [reload, setReload] = useState(0);
  useEffect(() => {
    if (!user) return;
    const ac = new AbortController();
    api("/me/work-course", { signal: ac.signal })
      .then(setSummary)
      .catch((e) => {
        if (!ac.signal.aborted) setError(e.message);
      });
    return () => ac.abort();
  }, [user, reload]);
  useEffect(() => () => window.speechSynthesis?.cancel(), []);
  const status = (l) =>
    workStatus(l, summary?.attempts || [], summary?.today || "");
  const next =
    workLessons.find((l) => status(l).due) ||
    workLessons.find((l) => status(l).correct < 3) ||
    workLessons[0];
  if (selected)
    return (
      <WorkLesson
        key={selected.id}
        unit={selected}
        user={user}
        speak={speak}
        onBack={() => {
          setSelected(null);
          setSummary(null);
          setError("");
          setReload((n) => n + 1);
          window.speechSynthesis?.cancel();
        }}
      />
    );
  return (
    <section className="work-course">
      <div className="wc-intro">
        <div>
          <span className="studio-kicker">KHÓA THỬ NGHIỆM · A2–B1+</span>
          <h2>20 buổi. Những việc bạn cần nói.</h2>
          <p>
            Nhắn tin rõ hơn, phối hợp tự tin hơn và biết cách hỏi lại khi chưa
            hiểu. Mỗi tuần 4 bài tình huống + 1 bài thử sức, khoảng 10–15 phút
            mỗi buổi.
          </p>
          <p>
            Hai ngày còn lại dành cho ôn hoặc nghỉ. Bạn có thể học theo nhịp
            riêng; không có khóa ngày hay cam kết đạt một trình độ sau 4 tuần.
          </p>
          <button
            className="studio-button"
            onClick={() => {
              setWeek(next.week);
              setSelected(next);
            }}
          >
            Bắt đầu / tiếp tục: {next.title} <ArrowRight size={18} />
          </button>
        </div>
        <div className="wc-cover">
          <RealPhoto scene="work" priority />
        </div>
      </div>
      {!user && (
        <p className="wc-notice">
          Học thử miễn phí. Đăng nhập để lưu bài kiểm tra và lịch ôn. Bản này
          chưa mở thanh toán.
        </p>
      )}
      {user &&
        (error ? (
          <div role="alert">
            <p>Chưa tải được tiến độ: {error}</p>
            <button
              onClick={() => {
                setError("");
                setReload((n) => n + 1);
              }}
            >
              Thử tải lại
            </button>
          </div>
        ) : summary ? (
          <p className="wc-notice">
            {workLessons.filter((l) => status(l).correct === 3).length}/20 bài
            có 3/3 câu kiểm tra đúng không gợi ý ở lượt gần nhất ·{" "}
            {summary.stats.due} câu đến hạn. Bài nói/viết mở chưa được chấm bởi
            giáo viên.
          </p>
        ) : (
          <p role="status">Đang tải tiến độ khóa học…</p>
        ))}
      <nav className="wc-weeks" aria-label="Tuần của khóa công việc">
        {workWeeks.map((w, i) => (
          <button
            key={w.title}
            aria-pressed={week === i}
            onClick={() => setWeek(i)}
          >
            <span>Tuần {i + 1}</span>
            <strong>{w.title}</strong>
          </button>
        ))}
      </nav>
      <h3>{workWeeks[week].goal}</h3>
      <div className="wc-days">
        {workLessons
          .filter((l) => l.week === week)
          .map((l) => (
            <button
              key={l.id}
              className="wc-day"
              onClick={() => setSelected(l)}
            >
              <span className="wc-number">{l.day}</span>
              <div>
                <small>
                  {l.review ? "THỬ SỨC CUỐI TUẦN" : "BÀI TÌNH HUỐNG"}
                </small>
                <h3>{l.title}</h3>
                <p>{l.context}</p>
                {summary && (
                  <small>
                    {status(l).correct}/3 câu đúng · {status(l).due} câu đến hạn
                  </small>
                )}
              </div>
              <ArrowRight size={20} aria-hidden="true" />
            </button>
          ))}
      </div>
      <p className="wc-footnote">
        Nội dung tự biên soạn, đang thử nghiệm với người học. Bài kiểm tra dùng
        đáp án xác định; phần tự diễn đạt cần đối chiếu theo tiêu chí. Mức độ
        chưa được thẩm định độc lập.
      </p>
    </section>
  );
}
function WorkLesson({ unit: l, user, speak, onBack }) {
  const [tab, setTab] = useState("learn"),
    [shown, setShown] = useState(1),
    [draft, setDraft] = useState(""),
    [model, setModel] = useState(false);
  const heading = useRef(null);
  useEffect(() => {
    heading.current?.focus();
    return () => window.speechSynthesis?.cancel();
  }, []);
  return (
    <section className="work-course">
      <button className="wc-back" onClick={onBack}>
        <ArrowLeft size={18} /> Kế hoạch 4 tuần
      </button>
      <span className="studio-kicker">
        TUẦN {l.week + 1} · BUỔI {l.day} {l.review ? "· THỬ SỨC" : ""}
      </span>
      <h2 ref={heading} tabIndex={-1}>
        {l.title}
      </h2>
      <p>{l.context}</p>
      <nav className="wc-tabs" aria-label="Các phần bài công việc">
        {[
          ["learn", "Tình huống & cách nói"],
          ["listen", "Nghe & nhớ câu"],
          ["apply", "Tự diễn đạt"],
          ["quiz", "Kiểm tra & lưu"],
        ].map(([id, label]) => (
          <button
            key={id}
            aria-pressed={tab === id}
            onClick={() => {
              setTab(id);
              window.speechSynthesis?.cancel();
            }}
          >
            {label}
          </button>
        ))}
      </nav>
      <div hidden={tab !== "learn"}>
        <div className="wc-reading">
          <figure>
            <div className="wc-cover">
              <RealPhoto scene={l.photo} />
            </div>
            <PhotoCredit scene={l.photo} />
          </figure>
          <article>
            <h3>
              {l.review
                ? "Tình huống mới để vận dụng"
                : "Đọc để hình dung công việc"}
            </h3>
            <Audio
              speak={speak}
              text={l.reading}
              label="Đọc tình huống công việc"
            />
            <p lang="en">{l.reading}</p>
          </article>
        </div>
        <WorkComprehension lessonId={l.id} />
        <h3>Ba cách nói mang theo</h3>
        <ul className="wc-phrases">
          {l.phrases.map((phrase, i) => (
            <li key={phrase}>
              <span>{phrase}</span>
              <Audio
                speak={speak}
                text={phrase}
                label={`Đọc mẫu câu ${i + 1}`}
              />
            </li>
          ))}
        </ul>
        <section className="wc-dialogue">
          <h3>Thử nói lượt tiếp theo</h3>
          <p>Đọc vai A, tự nói lời đáp trước khi mở vai B.</p>
          {l.dialogue.slice(0, shown).map((line, i) => (
            <p key={i}>
              <strong>{i % 2 ? "B" : "A"} </strong>
              {line}{" "}
              <Audio speak={speak} text={line} label={`Đọc lượt ${i + 1}`} />
            </p>
          ))}
          {shown < l.dialogue.length ? (
            <button
              className="studio-button"
              onClick={() => setShown((n) => n + 1)}
            >
              Mở lời tiếp theo
            </button>
          ) : (
            <button onClick={() => setShown(1)}>Nhập vai lại</button>
          )}
        </section>
        <button className="studio-button" onClick={() => setTab("listen")}>
          Thử nghe khi không nhìn chữ →
        </button>
      </div>
      <div hidden={tab !== "listen"}>
        <WorkListening phrases={l.phrases} speak={speak} />
        <button
          className="studio-button"
          onClick={() => {
            window.speechSynthesis?.cancel();
            setTab("apply");
          }}
        >
          Thử diễn đạt theo cách của bạn →
        </button>
      </div>
      <section hidden={tab !== "apply"} className="wc-apply">
        <h3>
          {l.review ? "Nhiệm vụ cuối tuần" : "Áp dụng vào công việc của bạn"}
        </h3>
        <p>{l.task}</p>
        <label htmlFor="work-draft">Bản nháp của bạn</label>
        <textarea
          id="work-draft"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          rows={7}
          maxLength={4000}
          placeholder="Viết bằng tiếng Anh, hoặc dùng ô này để chuẩn bị trước khi nói…"
        />
        <p className="wc-footnote">
          Bản nháp chỉ ở màn hình này, rời bài hoặc tải lại sẽ mất. Chưa gửi cho
          giáo viên, chưa tự động chấm.
        </p>
        <fieldset>
          <legend>Tự đối chiếu trước khi xem mẫu</legend>
          {[
            "Tôi đã truyền đạt đủ các ý trong nhiệm vụ.",
            "Người nhận biết họ cần làm gì hoặc phản hồi điều gì.",
            "Thời gian, trách nhiệm và điều kiện được nói rõ khi cần.",
          ].map((s) => (
            <label key={s}>
              <input type="checkbox" />
              {s}
            </label>
          ))}
        </fieldset>
        <button onClick={() => setModel(!model)} aria-expanded={model}>
          {model ? "Ẩn cách diễn đạt tham khảo" : "Xem cách diễn đạt tham khảo"}
        </button>
        {model && (
          <div className="wc-model">
            <p>{l.phrases.join(" ")}</p>
            <small>
              Đây là các mẫu câu hỗ trợ, không phải đáp án duy nhất hoặc bài mẫu
              đáp ứng toàn bộ nhiệm vụ. Hãy thay chi tiết theo tình huống của
              bạn.
            </small>
          </div>
        )}
        <button className="studio-button" onClick={() => setTab("quiz")}>
          Làm 3 câu kiểm tra →
        </button>
      </section>
      <div hidden={tab !== "quiz"}>
        <p>
          Ba câu này được chấm theo đáp án; không thay thế đánh giá bài nói/viết
          mở.
        </p>
        <CourseQuiz unit={l} user={user} apiBase="/me/work-course" />
      </div>
    </section>
  );
}
