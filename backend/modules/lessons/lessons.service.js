import { stationLesson as lesson } from "../../../shared/station-lesson.js";
import { checkAnswer } from "../../../shared/learning.js";
import { fail, text } from "../../common/errors.js";
import { lockUser, userDay } from "../learning/progress.repository.js";
import * as repository from "./lessons.repository.js";
export function createLessonsService({ db }) {
  async function progress(actor) {
    const attempts = await repository.listAttempts(db, actor.id, lesson);
    const today = await userDay(db, actor.id);
    return { lessonId: lesson.id, version: lesson.version, attempts, today };
  }
  async function submit(actor, input) {
    const key = text(input?.key, "Mã lượt luyện", { max: 100 }),
      answer = text(input?.answer, "Câu trả lời", { min: 0, max: 500 });
    const question = lesson.questions.find((q) => q.id === input?.questionId);
    if (!question || input.version !== lesson.version)
      fail(400, "Bài học đã thay đổi hoặc câu hỏi không hợp lệ.");
    if (typeof input.hinted !== "boolean")
      fail(400, "Trạng thái gợi ý không hợp lệ.");
    let result;
    await db.transaction(async (tx) => {
      await lockUser(tx, actor.id);
      const old = await repository.findAttempt(tx, actor.id, key);
      if (old) {
        if (
          old.question_id !== question.id ||
          old.answer !== answer ||
          old.hinted !== input.hinted ||
          old.version !== lesson.version ||
          old.lesson_id !== lesson.id
        )
          fail(409, "Mã lượt luyện đã dùng cho câu trả lời khác.");
        result = { correct: old.correct, hinted: old.hinted, due: old.due_day };
        return;
      }
      const day = await userDay(tx, actor.id),
        correct = checkAnswer(answer, question.answer, question.alternatives);
      const dueDate = new Date(day + "T12:00:00Z");
      dueDate.setUTCDate(dueDate.getUTCDate() + 1);
      const due = dueDate.toISOString().slice(0, 10);
      await repository.insertAttempt(tx, {
        userId: actor.id,
        key,
        lesson,
        questionId: question.id,
        answer,
        correct,
        hinted: input.hinted,
        day,
        due,
      });
      result = { correct, hinted: input.hinted, due };
    });
    return {
      ...(await progress(actor)),
      result: {
        ...result,
        expected: question.answer,
        explanation: question.explanation,
      },
    };
  }
  return { progress, submit };
}
