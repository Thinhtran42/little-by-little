import test from "node:test";
import assert from "node:assert/strict";
import { phrasalQueue, searchPhrasal } from "../shared/phrasal-practice.js";
import { phrasalLessons } from "../shared/phrasal-lessons.js";
test("phrasal queue prioritizes older due questions, includes unseen and omits future reviews", () => {
  const qs = ["a", "b", "c", "d", "e"].map((id) => ({ id }));
  const attempts = [
    { question_id: "a", due_day: "2026-10-01" },
    { question_id: "b", due_day: "2026-09-29" },
    { question_id: "d", due_day: "2026-09-28" },
  ];
  assert.deepEqual(phrasalQueue(qs, attempts, "2026-09-29"), [3, 1, 2, 4]);
  assert.deepEqual(
    phrasalQueue(
      qs,
      qs.map((q) => ({ question_id: q.id, due_day: "2026-10-01" })),
      "2026-09-29",
    ),
    [],
  );
});
test("phrasal search supports Vietnamese accents, meanings and multiple terms", () => {
  assert.equal(searchPhrasal(phrasalLessons[0], 'DỌN'), true);
  assert.equal(searchPhrasal(phrasalLessons[1], 'ĐỀ CẬP'), true);
  assert.equal(searchPhrasal(phrasalLessons[0], "cat vao cho"), true);
  assert.equal(searchPhrasal(phrasalLessons[3], "take off"), true);
  assert.equal(searchPhrasal(phrasalLessons[0], "khong ton tai"), false);
  assert.equal(searchPhrasal(phrasalLessons[0], "  "), true);
});
