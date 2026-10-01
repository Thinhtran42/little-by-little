import test from "node:test";
import assert from "node:assert/strict";
import { workLessons, workWeeks, workStatus } from "../shared/work-course.js";
import { photoSources } from "../shared/photo-sources.js";
test("four workplace weeks have original versioned lessons, weekly transfer tasks and isolated completion rules", () => {
  assert.equal(workWeeks.length, 4);
  assert.equal(workLessons.length, 20);
  assert.equal(new Set(workLessons.map((l) => l.id)).size, 20);
  for (let week = 0; week < 4; week++) {
    const ls = workLessons.filter((l) => l.week === week);
    assert.deepEqual(
      ls.map((l) => l.day),
      [1, 2, 3, 4, 5],
    );
    assert.equal(ls.filter((l) => l.review).length, 1);
    assert.equal(ls[4].review, true);
  }
  for (const l of workLessons) {
    assert.equal(l.questions.length, 3);
    assert.equal(l.dialogue.length, 4);
    assert.equal(l.phrases.length, 3);
    assert.ok(photoSources[l.photo]);
    assert.ok(l.reading.length > 150 && l.task.length > 30);
    assert.equal(new Set(l.questions.map((q) => q.id)).size, 3);
  }
  const l = workLessons[0];
  assert.deepEqual(
    workStatus(
      l,
      [
        {
          lesson_id: l.id,
          version: 1,
          correct: true,
          hinted: true,
          due_day: "2026-09-30",
        },
        {
          lesson_id: l.id,
          version: 2,
          correct: true,
          hinted: false,
          due_day: "2026-09-30",
        },
      ],
      "2026-09-30",
    ),
    { answered: 1, correct: 0, due: 1 },
  );
});
