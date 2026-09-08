import * as repository from "./admin.repository.js";
import { randomUUID } from "node:crypto";
import { fail, text } from "../../common/errors.js";
/** @param {{ db: import('../../db/types.js').Database }} dependencies */
export function createAdminService({ db }) {
  async function updatePhrase({ actor, input, params } = {}) {
    if (actor.role !== "admin") fail(403, "Bạn không có quyền biên tập.");
    const en = text(input?.en, "Câu tiếng Anh", { max: 500 }),
      vi = text(input?.vi, "Nghĩa tiếng Việt", { max: 1000 }),
      note = text(input?.note || "", "Ghi chú", { min: 0, max: 2000 }),
      alternatives = input?.alternatives || [];
    if (
      !Array.isArray(alternatives) ||
      alternatives.length > 20 ||
      alternatives.some((a) => typeof a !== "string" || a.length > 500)
    )
      fail(400, "Đáp án thay thế không hợp lệ.");
    await db.transaction(async (tx) => {
      const current = (await repository.lockPhrase(tx, { phraseId: params.id }))
        .rows[0];
      if (!current) fail(404, "Không tìm thấy câu.");
      if (input.revision !== current.revision)
        fail(
          409,
          "Nội dung đã thay đổi. Tải lại trước khi lưu.",
          "REVISION_CONFLICT",
        );
      await repository.updatePhrase(tx, {
        phraseId: params.id,
        content: JSON.stringify({
          ...current.content,
          en,
          vi,
          note,
          alternatives,
        }),
      });
      await repository.insertAudit(tx, {
        id: randomUUID(),
        actorId: actor.id,
        action: "phrase_updated",
        targetId: params.id,
      });
    });
    return { ok: true };
  }
  return { updatePhrase };
}
