import * as repository from "./learning.repository.js";
import {
  normalizeProgress,
  initialState,
  recordAttempt,
} from "../../../shared/progress.js";
import { checkAnswer } from "../../../shared/learning.js";
import {
  readState,
  readPhraseState,
  lockUser,
  writeProgress,
  bump,
  importState,
  userDay,
  learningDate,
} from "./progress.repository.js";
import { fail, text } from "../../common/errors.js";
/** @param {{ db: import('../../db/types.js').Database }} dependencies */
export function createLearningService({ db }) {
  async function getProgress({ actor }) {
    return readState(db, actor.id);
  }
  async function exportProgress({ actor }) {
    return {
      app: "little-by-little",
      exportedAt: new Date().toISOString(),
      progress: (await readState(db, actor.id)).state,
    };
  }
  async function applyCommands({ actor, input }) {
    const commands = input?.commands;
    if (!Array.isArray(commands) || commands.length > 100 || !commands.length)
      fail(400, "Danh sách cập nhật không hợp lệ.");
    await db.transaction(async (tx) => {
      await lockUser(tx, actor.id);
      const id = actor.id;
      for (const cmd of commands) {
        if (cmd.type === "preferences") {
          const current = (await readState(tx, id)).state;
          const normalized = normalizeProgress({ ...current, ...cmd.value });
          let timezone = cmd.timezone;
          if (timezone) {
            try {
              new Intl.DateTimeFormat("en", { timeZone: timezone }).format();
            } catch {
              fail(400, "Múi giờ không hợp lệ.");
            }
          }
          await repository.updatePreferences(tx, {
            userId: id,
            profile: JSON.stringify(normalized.profile),
            goal: normalized.goal,
            audio: JSON.stringify(normalized.audio),
            timezone: timezone || null,
          });
          continue;
        }
        const phraseId = text(cmd.id, "Mã câu", { max: 100 });
        if (
          !(await repository.findPhraseId(tx, { phraseId: phraseId })).rows
            .length
        )
          fail(404, "Không tìm thấy câu học.");
        if (cmd.type === "bookmark") {
          if (typeof cmd.value !== "boolean")
            fail(400, "Trạng thái lưu không hợp lệ.");
          if (cmd.value)
            await repository.insertBookmark(tx, {
              userId: id,
              phraseId: phraseId,
            });
          else
            await repository.deleteBookmark(tx, {
              userId: id,
              phraseId: phraseId,
            });
        } else if (cmd.type === "note") {
          const note = text(cmd.value, "Ghi chú", { min: 0, max: 2000 });
          await repository.upsertNote(tx, {
            userId: id,
            phraseId: phraseId,
            note: note,
          });
        } else if (cmd.type === "seen") {
          if (typeof cmd.value !== "boolean")
            fail(400, "Trạng thái học không hợp lệ.");
          if (cmd.value) {
            const day = await userDay(tx, id);
            await repository.markSeen(tx, {
              userId: id,
              phraseId: phraseId,
              day: day,
            });
          } else
            await repository.deletePhraseProgress(tx, {
              userId: id,
              phraseId: phraseId,
            });
        } else fail(400, "Loại cập nhật không được hỗ trợ.");
      }
      await bump(tx, id);
    });
    return readState(db, actor.id);
  }
  async function submitAttempt({ actor, input }) {
    const id = actor.id,
      phraseId = text(input?.phraseId, "Mã câu", { max: 100 }),
      key = text(input?.key, "Mã lượt luyện", { max: 100 }),
      answer = text(input?.answer, "Câu trả lời", { min: 0, max: 2000 }),
      mode = input?.mode,
      hinted = input?.hinted === true;
    if (!["recall", "listen", "choice"].includes(mode))
      fail(400, "Kiểu bài tập không hợp lệ.");
    let result;
    await db.transaction(async (tx) => {
      await lockUser(tx, id);
      const phrase = (await repository.findPhrase(tx, { phraseId: phraseId }))
        .rows[0]?.content;
      if (!phrase) fail(404, "Câu học không tồn tại.");
      const old = (await repository.findAttempt(tx, { userId: id, key: key }))
        .rows[0];
      if (old) {
        if (
          old.phrase_id !== phraseId ||
          old.answer !== answer ||
          old.mode !== mode
        )
          fail(
            409,
            "Mã lượt luyện đã dùng cho câu trả lời khác.",
            "IDEMPOTENCY_CONFLICT",
          );
        result = {
          correct: old.correct,
          hinted: old.hinted,
          expected: phrase.en,
          meaning: phrase.vi,
          duplicate: true,
        };
        return;
      }
      const correct =
          (mode === "choice"
            ? answer === phraseId
            : checkAnswer(answer, phrase.en, phrase.alternatives || [])) &&
          !hinted,
        day = await userDay(tx, id),
        state = await readPhraseState(tx, id, phraseId);
      const next = recordAttempt(
        state,
        phraseId,
        { correct, mode, hinted, key },
        learningDate(day),
      );
      await writeProgress(tx, id, phraseId, next.learned[phraseId]);
      await repository.insertAttempt(tx, {
        userId: id,
        key: key,
        phraseId: phraseId,
        mode: mode,
        answer: answer,
        correct: correct,
        hinted: hinted,
        day: day,
      });
      await repository.insertActivity(tx, {
        userId: id,
        day: day,
        phraseId: phraseId,
      });
      await bump(tx, id);
      result = { correct, expected: phrase.en, meaning: phrase.vi, hinted };
    });
    return { ...(await readState(db, id)), result };
  }
  async function submitScenario({ actor, input, params } = {}) {
    const answers = input?.answers,
      key = text(input?.key, "Mã hội thoại", { max: 100 });
    if (
      !Array.isArray(answers) ||
      answers.length > 20 ||
      answers.some((a) => typeof a !== "string" || a.length > 2000)
    )
      fail(400, "Lời đáp không hợp lệ.");
    let result;
    await db.transaction(async (tx) => {
      await lockUser(tx, actor.id);
      const s = (await repository.findScenario(tx, { scenarioId: params.id }))
        .rows[0]?.content;
      if (!s) fail(404, "Không tìm thấy tình huống.");
      if (answers.length !== s.steps.length)
        fail(400, "Chưa đủ lượt hội thoại.");
      const old = (
        await repository.findScenarioAttempt(tx, { userId: actor.id, key: key })
      ).rows[0];
      if (old) {
        if (
          old.scenario_id !== s.id ||
          JSON.stringify(old.answers) !== JSON.stringify(answers)
        )
          fail(409, "Mã hội thoại đã được dùng.");
        result = { correct: old.correct, total: old.total };
        return;
      }
      const correct = s.steps.filter((q, i) => q.answer === answers[i]).length;
      await repository.insertScenarioAttempt(tx, {
        userId: actor.id,
        key: key,
        scenarioId: s.id,
        answers: JSON.stringify(answers),
        correct: correct,
        total: s.steps.length,
        day: await userDay(tx, actor.id),
      });
      await bump(tx, actor.id);
      result = { correct, total: s.steps.length };
    });
    return { ...(await readState(db, actor.id)), result };
  }
  async function importProgress({ actor, input }) {
    if (input?.confirm !== true)
      fail(400, "Cần xác nhận trước khi thay thế dữ liệu.");
    try {
      normalizeProgress(input.progress);
    } catch (e) {
      fail(400, e.message);
    }
    await db.transaction(async (tx) => {
      await lockUser(tx, actor.id);
      await importState(tx, actor.id, input.progress);
    });
    return readState(db, actor.id);
  }
  async function resetProgress({ actor, input }) {
    if (input?.confirm !== true) fail(400, "Cần xác nhận xóa tiến độ.");
    await db.transaction(async (tx) => {
      await lockUser(tx, actor.id);
      await importState(tx, actor.id, initialState());
    });
    return readState(db, actor.id);
  }
  return {
    getProgress,
    exportProgress,
    applyCommands,
    submitAttempt,
    submitScenario,
    importProgress,
    resetProgress,
  };
}
