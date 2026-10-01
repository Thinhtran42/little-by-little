import React, { useId, useState } from "react";
import { Volume2 } from "lucide-react";
import {
  matchesDictation,
  workComprehension,
} from "../../../shared/work-practice.js";

export function WorkComprehension({ lessonId }) {
  const question = workComprehension[lessonId];
  const [choice, setChoice] = useState(null);
  const [checked, setChecked] = useState(false);
  const group = useId();
  return (
    <section className="wc-understand">
      <h3>Hiểu ý trước khi nhớ từ</h3>
      <p>
        Chọn câu trả lời theo đoạn đọc, rồi tìm chi tiết chứng minh lựa chọn của
        bạn.
      </p>
      <fieldset disabled={checked}>
        <legend lang="en">{question.prompt}</legend>
        {question.options.map((option, i) => (
          <label key={option}>
            <input
              type="radio"
              name={group}
              checked={choice === i}
              onChange={() => setChoice(i)}
            />
            <span lang="en">{option}</span>
          </label>
        ))}
      </fieldset>
      {!checked ? (
        <button disabled={choice === null} onClick={() => setChecked(true)}>
          Giải thích lựa chọn
        </button>
      ) : (
        <div role="status">
          <strong>
            {choice === question.answer
              ? "Bạn đã hiểu đúng ý."
              : "Cùng xem lại chi tiết trong đoạn đọc."}
          </strong>
          <p>
            Đáp án: <span lang="en">{question.options[question.answer]}</span>
          </p>
          <p>{question.explanation}</p>
          <button
            onClick={() => {
              setChecked(false);
              setChoice(null);
            }}
          >
            Đọc và thử lại
          </button>
        </div>
      )}
    </section>
  );
}

export function WorkListening({ phrases, speak }) {
  const [queue, setQueue] = useState(() => phrases.map((_, i) => i));
  const [position, setPosition] = useState(0);
  const [input, setInput] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [missed, setMissed] = useState([]);
  const [retry, setRetry] = useState(false);
  const id = useId();
  const complete = position >= queue.length;
  const target = phrases[queue[position]];
  function clearAnswer() {
    setInput("");
    setRevealed(false);
    setFeedback(null);
  }
  function restart(indices, isRetry) {
    window.speechSynthesis?.cancel();
    setQueue(indices);
    setPosition(0);
    setMissed([]);
    setRetry(isRetry);
    clearAnswer();
  }
  function check(e) {
    e.preventDefault();
    if (!input.trim() || feedback) return;
    const correct = matchesDictation(input, target);
    const independent = correct && !revealed;
    setFeedback({ correct, independent });
    if (!independent)
      setMissed((prev) => [...new Set([...prev, queue[position]])]);
  }
  return (
    <section className="wc-listening">
      <h3>Nghe, viết lại, rồi nói theo</h3>
      <p>
        Nghe một câu trước khi xem chữ. Viết lại câu bạn nghe; sau đó đọc theo
        và thay một chi tiết cho phù hợp với bạn.
      </p>
      <p className="wc-footnote">
        Giọng đọc của thiết bị. Nếu thiết bị không phát tiếng, dùng “Xem câu” để
        luyện đọc. Không thu âm hay chấm phát âm; kết quả lượt luyện này chưa
        lưu tài khoản.
      </p>
      {complete ? (
        <div role="status">
          <h4>{retry ? "Xong lượt luyện lại" : "Xong lượt nghe"}</h4>
          <p>
            {queue.length - missed.length}/{queue.length} câu khớp mẫu mà không
            mở câu trước. Đây là kết quả lượt này, không phải điểm thành thạo.
          </p>
          {missed.length > 0 && (
            <button onClick={() => restart([...missed], true)}>
              Luyện riêng {missed.length} câu cần ôn
            </button>
          )}
          <button
            onClick={() =>
              restart(
                phrases.map((_, i) => i),
                false,
              )
            }
          >
            Nghe lại toàn bộ
          </button>
        </div>
      ) : (
        <>
          <p>
            Câu {position + 1}/{queue.length}
            {retry ? " · Lượt luyện lại" : ""}
          </p>
          <button
            type="button"
            className="wc-audio"
            aria-label="Phát câu luyện nghe"
            onClick={() => speak(target)}
          >
            <Volume2 size={24} aria-hidden="true" />
          </button>
          <form onSubmit={check}>
            <label htmlFor={id}>Câu bạn nghe được</label>
            <textarea
              id={id}
              lang="en"
              rows={3}
              value={input}
              maxLength={500}
              disabled={!!feedback}
              onChange={(e) => setInput(e.target.value)}
              autoComplete="off"
              spellCheck={false}
            />
            <button
              type="button"
              disabled={revealed || !!feedback}
              onClick={() => setRevealed(true)}
            >
              Xem câu (có hỗ trợ)
            </button>
            <button type="submit" disabled={!input.trim() || !!feedback}>
              Đối chiếu câu nghe
            </button>
          </form>
          {(revealed || feedback) && (
            <p className="wc-model" lang="en">
              {target}
            </p>
          )}
          {feedback && (
            <div role="status">
              <strong>
                {feedback.independent
                  ? "Khớp câu mẫu, không mở trước."
                  : feedback.correct
                    ? "Khớp câu mẫu sau khi xem hỗ trợ."
                    : "Chưa khớp câu mẫu. So sánh từ còn thiếu hoặc khác."}
              </strong>
              <p>
                Bỏ qua chữ hoa và dấu câu. Bài này đối chiếu bản chép với câu
                mẫu; một cách diễn đạt khác vẫn có thể đúng tiếng Anh.
              </p>
              <p>
                Đọc theo một lần. Sau đó thử thay tên, thời gian hoặc công việc
                trong câu nếu phù hợp.
              </p>
              <button
                onClick={() => {
                  window.speechSynthesis?.cancel();
                  setPosition((p) => p + 1);
                  clearAnswer();
                }}
              >
                {position + 1 === queue.length
                  ? "Xem kết quả lượt nghe"
                  : "Câu nghe tiếp theo"}
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
