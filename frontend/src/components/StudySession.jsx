import { Volume2 as PlaybackIcon } from "lucide-react";
import { eventKey } from "../services/eventKey.js";
import React, { useEffect, useRef, useState } from "react";
import {
  X,
  Volume2,
  ArrowRight,
  Check,
  Lightbulb,
  RotateCcw,
  Mic,
  Square,
  Headphones,
  PenLine,
  BookOpen,
  PartyPopper,
} from "lucide-react";
import { checkAnswer, wordDiff, choiceOptions } from "../learning.js";
import { useCatalog } from "../state/CatalogContext.jsx";
import ContextPractice from './ContextPractice.jsx';

export function VoiceRecorder() {
  const [recording, setRecording] = useState(false),
    [requesting, setRequesting] = useState(false),
    [url, setUrl] = useState(""),
    [error, setError] = useState("");
  const recorder = useRef(null),
    stream = useRef(null),
    objectURL = useRef(""),
    mounted = useRef(true),
    timer = useRef(null);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      clearTimeout(timer.current);
      if (recorder.current?.state === "recording") recorder.current.stop();
      stream.current?.getTracks().forEach((t) => t.stop());
      if (objectURL.current) URL.revokeObjectURL(objectURL.current);
    };
  }, []);
  async function begin() {
    if (requesting || recorder.current?.state === "recording") return;
    setError("");
    if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
      setError(
        "Thiết bị chưa hỗ trợ ghi âm. Bạn vẫn có thể đọc thành tiếng và nghe câu mẫu.",
      );
      return;
    }
    setRequesting(true);
    try {
      const media = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (!mounted.current) {
        media.getTracks().forEach((t) => t.stop());
        return;
      }
      stream.current = media;
      const rec = new MediaRecorder(media);
      recorder.current = rec;
      const chunks = [];
      rec.ondataavailable = (e) => {
        if (e.data.size) chunks.push(e.data);
      };
      rec.onstop = () => {
        clearTimeout(timer.current);
        media.getTracks().forEach((t) => t.stop());
        if (!mounted.current) return;
        if (objectURL.current) URL.revokeObjectURL(objectURL.current);
        objectURL.current = URL.createObjectURL(
          new Blob(chunks, { type: rec.mimeType }),
        );
        setUrl(objectURL.current);
        setRecording(false);
      };
      rec.start();
      setRecording(true);
      timer.current = setTimeout(() => {
        if (rec.state === "recording") rec.stop();
      }, 45000);
    } catch {
      stream.current?.getTracks().forEach((t) => t.stop());
      setError(
        "Chưa truy cập được micro. Hãy cho phép micro trong trình duyệt để ghi âm.",
      );
    } finally {
      if (mounted.current) setRequesting(false);
    }
  }
  return (
    <div className="voice-recorder">
      <button
        className="subtle-button"
        disabled={requesting}
        onClick={() => (recording ? recorder.current?.stop() : begin())}
      >
        {recording ? <Square size={16} /> : <Mic size={16} />}{" "}
        {requesting
          ? "Đang mở micro…"
          : recording
            ? "Dừng ghi âm"
            : "Ghi âm câu của bạn"}
      </button>
      <span>Nghe lại để tự so với mẫu · tối đa 45 giây</span>
      {url && <audio controls src={url} aria-label="Bản ghi âm của bạn" />}
      {error && <p role="status">{error}</p>}
      <small>
        Âm thanh chỉ ở thiết bị và được xóa khi rời bài. Không chấm điểm phát âm
        tự động.
      </small>
    </div>
  );
}

export default function StudySession({
  items,
  mode,
  data,
  onResult,
  onNote,
  onClose,
  speak,
}) {
  const { phrases } = useCatalog();
  const [submitting, setSubmitting] = useState(false),
    [submitError, setSubmitError] = useState("");
  const [queue, setQueue] = useState(() =>
      items.map((p) => ({ phrase: p, retry: false })),
    ),
    [index, setIndex] = useState(0),
    [stage, setStage] = useState(
      !data.learned[items[0]?.id] ? "preview" : "test",
    ),
    [exercise, setExercise] = useState(
      mode === "listen" ? "listen" : mode === "choice" ? "choice" : "recall",
    ),
    [input, setInput] = useState(""),
    [feedback, setFeedback] = useState(null),
    [hinted, setHinted] = useState(false),
    [done, setDone] = useState(false),
    [results, setResults] = useState([]),
    [note, setNote] = useState("");
  const inputRef = useRef(null),
    sessionId = useRef(eventKey()),
    submitted = useRef(false);
  const entry = queue[index],
    p = entry.phrase;
  useEffect(() => {
    if (stage === "test" && !feedback) inputRef.current?.focus();
  }, [stage, index, feedback]);
  useEffect(() => () => window.speechSynthesis?.cancel(), []);
  function resetStep(next) {
    setInput("");
    setFeedback(null);
    setHinted(false);
    setNote(data.notes[next.phrase.id] || "");
    submitted.current = false;
    setStage(
      !data.learned[next.phrase.id] && !next.retry
        ? "preview"
        : "test",
    );
  }
  async function submit(value = input) {
    if (submitted.current) return;
    submitted.current = true;
    setSubmitting(true);
    setSubmitError("");
    try {
      const localCorrect =
        exercise === "choice"
          ? value === p.id
          : checkAnswer(value, p.en, p.alternatives || []);
      const response = await onResult(p.id, {
        correct: localCorrect,
        answer: value,
        mode: exercise,
        hinted,
        key: sessionId.current + "-" + index,
      });
      const passed = response.correct;
      setFeedback({ correct: passed, passed });
      setResults((r) => [
        ...r,
        { id: p.id, correct: passed, retry: entry.retry },
      ]);
      if (!passed && !entry.retry)
        setQueue((q) => [...q, { phrase: p, retry: true }]);
    } catch (e) {
      submitted.current = false;
      setSubmitError(e.message || "Chưa lưu được bài làm. Hãy thử lại.");
    } finally {
      setSubmitting(false);
    }
  }
  function next() {
    if (index + 1 >= queue.length) {
      setDone(true);
      return;
    }
    const nextEntry = queue[index + 1];
    setIndex(index + 1);
    resetStep(nextEntry);
  }
  const firstResults = results.filter((r) => !r.retry),
    right = firstResults.filter((r) => r.correct).length;
  return (
    <div className="modal-backdrop">
      <section
        className="modal study-modal active-study"
        role="dialog"
        aria-modal="true"
        aria-labelledby="study-title"
      >
        <button
          autoFocus
          className="modal-close icon-button"
          onClick={onClose}
          aria-label="Đóng buổi học"
        >
          <X />
        </button>
        {done ? (
          <div className="session-complete">
            <span className="modal-emblem">
              <PartyPopper size={36} />
            </span>
            <h2 id="study-title">Bạn vừa luyện thật sự.</h2>
            <p>
              {right}/{firstResults.length} câu đúng ở lần đầu, không dùng gợi
              ý.
              <br />
              {results.length - firstResults.length} lượt luyện lại câu cần củng
              cố.
            </p>
            <div className="session-summary">
              <strong>
                {firstResults.length
                  ? Math.round((right / firstResults.length) * 100)
                  : 0}
                %
              </strong>
              <span>
                Độ chính xác lần đầu
                <br />
                Câu khó được hẹn ôn sớm hơn.
              </span>
            </div>
            <button className="primary wide" onClick={onClose}>
              Hoàn thành <Check size={17} />
            </button>
          </div>
        ) : (
          <>
            <div className="eyebrow" id="study-title">
              {entry.retry
                ? "THỬ LẠI SAU MỘT KHOẢNG NGẮN"
                : stage === "preview"
                  ? "LÀM QUEN VỚI CÂU MỚI"
                  : "GỢI NHỚ CHỦ ĐỘNG"}{" "}
              · {index + 1}/{queue.length}
            </div>
            <div className="study-progress">
              <i style={{ width: `${(index / queue.length) * 100}%` }} />
            </div>
            {stage === "preview" ? (
              <ContextPractice key={index} phrase={p} speak={speak} onReady={() => { setStage('test'); window.speechSynthesis?.cancel(); }} />
            ) : stage === "legacy-preview" ? (
              <>
                <div className="flashcard">
                  <span className="type-label">
                    {p.type === "phrasal"
                      ? "Phrasal verb"
                      : p.type === "expression"
                        ? "Cách nói tự nhiên"
                        : "Câu giao tiếp"}
                  </span>
                  <h2>{p.en}</h2>
                  <p className="translation">{p.vi}</p>
                  {p.note && <p className="context-note">{p.note}</p>}
                  <button className="listen-button" onClick={() => speak(p.en)} aria-label="Phát âm thanh" title="Phát âm thanh"><PlaybackIcon size={20} aria-hidden="true" /></button>
                </div>
                <p className="study-hint">
                  Đọc thành tiếng một lần. Bước tiếp theo sẽ ẩn tiếng Anh.
                </p>
                <button
                  className="primary wide"
                  onClick={() => {
                    setStage("test");
                    window.speechSynthesis?.cancel();
                  }}
                >
                  Sẵn sàng thử nhớ <ArrowRight size={18} />
                </button>
              </>
            ) : (
              <>
                <div
                  className="exercise-tabs"
                  role="group"
                  aria-label="Kiểu bài tập"
                >
                  <button disabled={!!feedback || submitting} onClick={() => { setHinted(true); setStage('preview'); }}>Thẻ & xếp câu</button>
                  {[
                    ["recall", "Tự viết", PenLine],
                    ["listen", "Nghe & viết", Headphones],
                    ["choice", "Nhận diện", BookOpen],
                  ].map(([id, label, C]) => (
                    <button
                      key={id}
                      disabled={!!feedback || hinted}
                      className={exercise === id ? "active" : ""}
                      onClick={() => {
                        setExercise(id);
                        setInput("");
                      }}
                    >
                      <C size={15} />
                      {label}
                    </button>
                  ))}
                </div>
                <div className="prompt-area">
                  {exercise === "listen" ? (
                    <>
                      <span className="type-label">NGHE VÀ VIẾT LẠI</span>
                      <button
                        className="audio-prompt"
                        onClick={() => speak(p.en)}
                       aria-label="Phát âm thanh" title="Phát âm thanh"><PlaybackIcon size={20} aria-hidden="true" /></button>
                      <button
                        className="text-button"
                        onClick={() => {
                          setExercise("recall");
                          setInput("");
                        }}
                        disabled={!!feedback || submitting}
                      >
                        Không nghe được? Chuyển sang tự viết
                      </button>
                    </>
                  ) : exercise === "choice" ? (
                    <>
                      <span className="type-label">CHỌN NGHĨA PHÙ HỢP</span>
                      <h2>{p.en}</h2>
                    </>
                  ) : (
                    <>
                      <span className="type-label">
                        VIẾT LẠI MẪU CÂU ĐÃ HỌC
                      </span>
                      <h2>{p.vi}</h2>
                      <small>
                        Chấp nhận viết hoa, dấu câu và một số dạng viết tắt. Đây
                        là bài nhớ mẫu câu, không chấm mọi cách dịch tương
                        đương.
                      </small>
                    </>
                  )}
                </div>
                {exercise === "choice" ? (
                  <div className="answer-choices">
                    {choiceOptions(p, phrases).map((o) => (
                      <button
                        key={o.id}
                        disabled={!!feedback}
                        className={
                          feedback && o.id === p.id ? "correct-option" : ""
                        }
                        onClick={() => submit(o.id)}
                      >
                        {o.vi}
                      </button>
                    ))}
                  </div>
                ) : (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (input.trim()) submit();
                    }}
                  >
                    <label className="sr-only" htmlFor="recall-answer">
                      Câu trả lời tiếng Anh
                    </label>
                    <textarea
                      id="recall-answer"
                      ref={inputRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Viết câu tiếng Anh bạn nhớ…"
                      autoComplete="off"
                      autoCorrect="off"
                      spellCheck="false"
                      disabled={!!feedback}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          if (input.trim()) submit();
                        }
                      }}
                    />
                    {!feedback && (
                      <div className="study-buttons">
                        <button
                          type="button"
                          className="subtle-button"
                          onClick={() => setHinted(true)}
                        >
                          <Lightbulb size={16} />
                          Gợi ý
                        </button>
                        <button
                          type="submit"
                          className="primary"
                          disabled={!input.trim() || submitting}
                        >
                          Kiểm tra <Check size={17} />
                        </button>
                      </div>
                    )}
                  </form>
                )}
                {submitError && (
                  <p className="account-message" role="alert">
                    {submitError}
                  </p>
                )}
                {submitting && (
                  <p className="study-hint" role="status">
                    Đang chấm và lưu bài làm…
                  </p>
                )}
                {hinted && !feedback && (
                  <div className="hint-box">
                    Bắt đầu bằng:{" "}
                    <strong>{p.en.split(" ").slice(0, 2).join(" ")}…</strong>
                    <p>Lượt có gợi ý được tính là cần ôn thêm.</p>
                  </div>
                )}
                {feedback && (
                  <div
                    className={`answer-feedback ${feedback.passed ? "pass" : "retry"}`}
                    role="status"
                  >
                    <h3>
                      {feedback.passed
                        ? "Chính xác, bạn đã nhớ được!"
                        : feedback.correct
                          ? "Đúng rồi. Mình sẽ cho bạn thử lại không gợi ý."
                          : "Chưa khớp mẫu câu. Cùng nhìn lại nhé."}
                    </h3>
                    <p className="correct-answer">{p.en}</p>
                    <p>{p.vi}</p>
                    {!feedback.correct && exercise !== "choice" && (
                      <div className="word-diff">
                        {wordDiff(input, p.en).map((w, i) => (
                          <span
                            key={i}
                            className={w.match ? "match" : "missing"}
                          >
                            {w.word}
                          </span>
                        ))}
                      </div>
                    )}
                    {p.note && <p className="context-note">{p.note}</p>}
                    <button
                      className="listen-button"
                      onClick={() => speak(p.en)}
                     aria-label="Phát âm thanh" title="Phát âm thanh"><PlaybackIcon size={20} aria-hidden="true" /></button>
                  </div>
                )}
                {feedback && (
                  <>
                    <details className="personalize">
                      <summary>Biến câu này thành câu của bạn</summary>
                      <label htmlFor="personal-note">
                        Viết ví dụ gắn với cuộc sống của bạn (tự luyện, chưa
                        chấm ngữ pháp).
                      </label>
                      <textarea
                        id="personal-note"
                        maxLength={2000}
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="Ví dụ: I'll be there in five minutes."
                      />
                      <button
                        className="subtle-button"
                        onClick={() => onNote(p.id, note)}
                      >
                        Lưu ví dụ
                      </button>
                      <VoiceRecorder key={index} />
                    </details>
                    <button
                      className="primary wide next-exercise"
                      onClick={next}
                    >
                      {index + 1 >= queue.length
                        ? "Xem kết quả"
                        : "Câu tiếp theo"}{" "}
                      <ArrowRight size={17} />
                    </button>
                  </>
                )}
              </>
            )}
          </>
        )}
      </section>
    </div>
  );
}
