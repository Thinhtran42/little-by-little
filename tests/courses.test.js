import test from "node:test";
import assert from "node:assert/strict";
import { courses, courseUnits, getCourseUnit } from "../shared/courses.js";
import { checkAnswer } from "../shared/learning.js";
test("original courses link complete readings, grammar and uniquely versioned assessment items", () => {
  assert.deepEqual(
    courses.map((c) => c.units.length),
    [12, 6],
  );
  assert.equal(new Set(courseUnits.map((u) => u.id)).size, 18);
  assert.equal(new Set(courseUnits.map((u) => u.reading.id)).size, 18);
  for (const u of courseUnits) {
    assert.equal(getCourseUnit(u.id), u);
    assert.equal(u.questions.length, 3);
    assert.equal(new Set(u.questions.map((q) => q.id)).size, 3);
    assert.ok(u.grammar.rule && u.grammar.example && u.topic);
    for (const q of u.questions) {
      assert.ok(q.prompt && q.answer && q.explanation);
      assert.ok(checkAnswer(q.answer, q.answer, q.alternatives));
      if (q.options)
        assert.equal(q.options.filter((o) => o === q.answer).length, 1);
    }
  }
  assert.equal(getCourseUnit("fake"), undefined);
});
