import { stationLesson } from "../../../shared/station-lesson.js";
import { checkAnswer } from "../../../shared/learning.js";
import { fail, text } from "../../common/errors.js";
import { lockUser, userDay } from "../learning/progress.repository.js";
import * as repository from "./lessons.repository.js";
import { courseUnits } from "../../../shared/courses.js";
import {
  scheduleCourseReview,
  studyStreak,
} from "../../../shared/course-review.js";
export function createCoursesService(dependencies, units = courseUnits) {
  const findUnit = (id) => units.find((unit) => unit.id === id);
  const resolve = (id) => {
    const unit = findUnit(id);
    if (!unit) fail(404, "Không tìm thấy bài học.");
    return createLessonsService(dependencies, unit);
  };
  return {
    async summary(actor) {
      const attempts = await repository.listCourseAttempts(
        dependencies.db,
        actor.id,
        units.map((u) => u.id),
      );
      const today = await userDay(dependencies.db, actor.id),
        days = await repository.studyDays(dependencies.db, actor.id);
      const current = attempts.filter(
        (a) => findUnit(a.lesson_id)?.version === a.version,
      );
      return {
        today,
        attempts: current,
        stats: {
          activeDays: days.length,
          streak: studyStreak(days, today),
          studiedToday: days.includes(today),
          practiced: current.length,
          independent: current.filter((a) => a.correct && !a.hinted).length,
          due: current.filter((a) => a.due_day <= today).length,
        },
      };
    },
    progress: (actor, id) => resolve(id).progress(actor),
    submit: (actor, id, input) => resolve(id).submit(actor, input),
  };
}
export function createLessonsService({ db }, lesson = stationLesson) {
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
        result = {
          correct: old.correct,
          hinted: old.hinted,
          due: old.due_day,
          level: old.review_level,
        };
        return;
      }
      const day = await userDay(tx, actor.id),
        correct = checkAnswer(answer, question.answer, question.alternatives);
      const dueDate = new Date(day + "T12:00:00Z");
      dueDate.setUTCDate(
        dueDate.getUTCDate() +
          (lesson.id === stationLesson.id || (correct && !input.hinted)
            ? 1
            : 0),
      );
      const previous = (
        await repository.listAttempts(tx, actor.id, lesson)
      ).find((a) => a.question_id === question.id);
      const schedule =
        lesson.id === stationLesson.id
          ? {
              due: dueDate.toISOString().slice(0, 10),
              level: 0,
              lastPassed: null,
            }
          : scheduleCourseReview(previous, {
              day,
              correct,
              hinted: input.hinted,
              mode: question.mode,
            });
      const { due, level, lastPassed } = schedule;
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
        level,
        lastPassed,
      });
      result = { correct, hinted: input.hinted, due, level };
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
