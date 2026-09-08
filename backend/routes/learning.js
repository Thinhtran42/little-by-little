import { randomUUID } from "node:crypto";
import { createHash } from "node:crypto";
import {
  normalizeProgress,
  initialState,
  recordAttempt,
  markLearned,
} from "../../shared/progress.js";
import { checkAnswer } from "../../shared/learning.js";
import {
  readState,
  readPhraseState,
  lockUser,
  writeProgress,
  bump,
  importState,
  userDay,
  learningDate,
} from "../services/progress.js";
import { fail, text } from "../errors.js";
export async function learningRoutes(app, { db }) {
  app.get("/api/catalog", { config: { public: true } }, async (req, reply) => {
    const topics = (
        await db.query("SELECT content FROM topics ORDER BY position")
      ).rows.map((r) => r.content),
      phrases = (
        await db.query("SELECT content,revision FROM phrases ORDER BY position")
      ).rows.map((r) => ({ ...r.content, revision: r.revision })),
      scenarios = (
        await db.query("SELECT content FROM scenarios ORDER BY position")
      ).rows.map((r) => r.content);
    const result = { topics, phrases, scenarios },
      etag =
        '"' +
        createHash("sha256")
          .update(JSON.stringify(result))
          .digest("hex")
          .slice(0, 20) +
        '"';
    reply
      .header("ETag", etag)
      .header("Cache-Control", "public,max-age=0,must-revalidate");
    if (req.headers["if-none-match"] === etag) return reply.code(304).send();
    return result;
  });
  app.get("/api/me/progress", async (req) => readState(db, req.user.id));
  app.get("/api/me/export", async (req) => ({
    app: "little-by-little",
    exportedAt: new Date().toISOString(),
    progress: (await readState(db, req.user.id)).state,
  }));
  app.post("/api/me/commands", async (req) => {
    const commands = req.body?.commands;
    if (!Array.isArray(commands) || commands.length > 100 || !commands.length)
      fail(400, "Danh sách cập nhật không hợp lệ.");
    await db.transaction(async (tx) => {
      await lockUser(tx, req.user.id);
      const id = req.user.id;
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
          await tx.query(
            "UPDATE learner_settings SET profile=$2,goal=$3,audio=$4,timezone=COALESCE($5,timezone) WHERE user_id=$1",
            [
              id,
              JSON.stringify(normalized.profile),
              normalized.goal,
              JSON.stringify(normalized.audio),
              timezone || null,
            ],
          );
          continue;
        }
        const phraseId = text(cmd.id, "Mã câu", { max: 100 });
        if (
          !(await tx.query("SELECT id FROM phrases WHERE id=$1", [phraseId]))
            .rows.length
        )
          fail(404, "Không tìm thấy câu học.");
        if (cmd.type === "bookmark") {
          if (typeof cmd.value !== "boolean")
            fail(400, "Trạng thái lưu không hợp lệ.");
          if (cmd.value)
            await tx.query(
              "INSERT INTO bookmarks(user_id,phrase_id) VALUES($1,$2) ON CONFLICT DO NOTHING",
              [id, phraseId],
            );
          else
            await tx.query(
              "DELETE FROM bookmarks WHERE user_id=$1 AND phrase_id=$2",
              [id, phraseId],
            );
        } else if (cmd.type === "note") {
          const note = text(cmd.value, "Ghi chú", { min: 0, max: 2000 });
          await tx.query(
            "INSERT INTO personal_notes(user_id,phrase_id,note) VALUES($1,$2,$3) ON CONFLICT(user_id,phrase_id) DO UPDATE SET note=excluded.note",
            [id, phraseId, note],
          );
        } else if (cmd.type === "seen") {
          if (typeof cmd.value !== "boolean")
            fail(400, "Trạng thái học không hợp lệ.");
          if (cmd.value) {
            const day = await userDay(tx, id);
            await tx.query(
              "INSERT INTO phrase_progress(user_id,phrase_id,first_seen,due_day) VALUES($1,$2,$3,$3) ON CONFLICT DO NOTHING",
              [id, phraseId, day],
            );
          } else
            await tx.query(
              "DELETE FROM phrase_progress WHERE user_id=$1 AND phrase_id=$2",
              [id, phraseId],
            );
        } else fail(400, "Loại cập nhật không được hỗ trợ.");
      }
      await bump(tx, id);
    });
    return readState(db, req.user.id);
  });
  app.post("/api/me/attempts", async (req) => {
    const id = req.user.id,
      phraseId = text(req.body?.phraseId, "Mã câu", { max: 100 }),
      key = text(req.body?.key, "Mã lượt luyện", { max: 100 }),
      answer = text(req.body?.answer, "Câu trả lời", { min: 0, max: 2000 }),
      mode = req.body?.mode,
      hinted = req.body?.hinted === true;
    if (!["recall", "listen", "choice"].includes(mode))
      fail(400, "Kiểu bài tập không hợp lệ.");
    let result;
    await db.transaction(async (tx) => {
      await lockUser(tx, id);
      const phrase = (
        await tx.query("SELECT content FROM phrases WHERE id=$1", [phraseId])
      ).rows[0]?.content;
      if (!phrase) fail(404, "Câu học không tồn tại.");
      const old = (
        await tx.query(
          "SELECT * FROM attempts WHERE user_id=$1 AND event_key=$2",
          [id, key],
        )
      ).rows[0];
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
      await tx.query(
        "INSERT INTO attempts(user_id,event_key,phrase_id,mode,answer,correct,hinted,day) VALUES($1,$2,$3,$4,$5,$6,$7,$8)",
        [id, key, phraseId, mode, answer, correct, hinted, day],
      );
      await tx.query(
        "INSERT INTO daily_activity(user_id,day,phrase_id) VALUES($1,$2,$3) ON CONFLICT DO NOTHING",
        [id, day, phraseId],
      );
      await bump(tx, id);
      result = { correct, expected: phrase.en, meaning: phrase.vi, hinted };
    });
    return { ...(await readState(db, id)), result };
  });
  app.post("/api/me/scenarios/:id", async (req) => {
    const answers = req.body?.answers,
      key = text(req.body?.key, "Mã hội thoại", { max: 100 });
    if (
      !Array.isArray(answers) ||
      answers.length > 20 ||
      answers.some((a) => typeof a !== "string" || a.length > 2000)
    )
      fail(400, "Lời đáp không hợp lệ.");
    let result;
    await db.transaction(async (tx) => {
      await lockUser(tx, req.user.id);
      const s = (
        await tx.query("SELECT content FROM scenarios WHERE id=$1", [
          req.params.id,
        ])
      ).rows[0]?.content;
      if (!s) fail(404, "Không tìm thấy tình huống.");
      if (answers.length !== s.steps.length)
        fail(400, "Chưa đủ lượt hội thoại.");
      const old = (
        await tx.query(
          "SELECT answers,scenario_id,correct,total FROM scenario_attempts WHERE user_id=$1 AND event_key=$2",
          [req.user.id, key],
        )
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
      await tx.query(
        "INSERT INTO scenario_attempts(user_id,event_key,scenario_id,answers,correct,total,day) VALUES($1,$2,$3,$4,$5,$6,$7)",
        [
          req.user.id,
          key,
          s.id,
          JSON.stringify(answers),
          correct,
          s.steps.length,
          await userDay(tx, req.user.id),
        ],
      );
      await bump(tx, req.user.id);
      result = { correct, total: s.steps.length };
    });
    return { ...(await readState(db, req.user.id)), result };
  });
  app.post("/api/me/import", async (req) => {
    if (req.body?.confirm !== true)
      fail(400, "Cần xác nhận trước khi thay thế dữ liệu.");
    try {
      normalizeProgress(req.body.progress);
    } catch (e) {
      fail(400, e.message);
    }
    await db.transaction(async (tx) => {
      await lockUser(tx, req.user.id);
      await importState(tx, req.user.id, req.body.progress);
    });
    return readState(db, req.user.id);
  });
  app.delete("/api/me/progress", async (req) => {
    if (req.body?.confirm !== true) fail(400, "Cần xác nhận xóa tiến độ.");
    await db.transaction(async (tx) => {
      await lockUser(tx, req.user.id);
      await importState(tx, req.user.id, initialState());
    });
    return readState(db, req.user.id);
  });
  app.patch("/api/admin/phrases/:id", async (req) => {
    if (req.user.role !== "admin") fail(403, "Bạn không có quyền biên tập.");
    const en = text(req.body?.en, "Câu tiếng Anh", { max: 500 }),
      vi = text(req.body?.vi, "Nghĩa tiếng Việt", { max: 1000 }),
      note = text(req.body?.note || "", "Ghi chú", { min: 0, max: 2000 }),
      alternatives = req.body?.alternatives || [];
    if (
      !Array.isArray(alternatives) ||
      alternatives.length > 20 ||
      alternatives.some((a) => typeof a !== "string" || a.length > 500)
    )
      fail(400, "Đáp án thay thế không hợp lệ.");
    await db.transaction(async (tx) => {
      const current = (
        await tx.query(
          "SELECT content,revision FROM phrases WHERE id=$1 FOR UPDATE",
          [req.params.id],
        )
      ).rows[0];
      if (!current) fail(404, "Không tìm thấy câu.");
      if (req.body.revision !== current.revision)
        fail(
          409,
          "Nội dung đã thay đổi. Tải lại trước khi lưu.",
          "REVISION_CONFLICT",
        );
      await tx.query(
        "UPDATE phrases SET content=$2,revision=revision+1,updated_at=now() WHERE id=$1",
        [
          req.params.id,
          JSON.stringify({ ...current.content, en, vi, note, alternatives }),
        ],
      );
      await tx.query(
        "INSERT INTO audit_log(id,actor_id,action,target_id) VALUES($1,$2,$3,$4)",
        [randomUUID(), req.user.id, "phrase_updated", req.params.id],
      );
    });
    return { ok: true };
  });
}
