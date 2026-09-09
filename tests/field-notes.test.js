import test from "node:test";
import assert from "node:assert/strict";
import { fieldNotes } from "../shared/field-notes.js";
test("preview lessons have distinct senses, balanced content, contextual blanks and complete dialogues", () => {
  const ids = new Set();
  assert.equal(fieldNotes.length, 6);
  for (const lesson of fieldNotes) {
    assert.ok(lesson.story.split(/\s+/).length >= 60, lesson.id);
    assert.equal(lesson.dialogue.length, 6);
    for (const kind of ["word", "phrasal", "pattern"])
      assert.equal(lesson.items.filter((i) => i.kind === kind).length, 2);
    for (const item of lesson.items) {
      assert.ok(!ids.has(item.id));
      ids.add(item.id);
      assert.ok(item.vi && item.note && item.example);
      assert.ok(
        item.example.toLowerCase().includes(item.en.toLowerCase()),
        `${item.id}: recall blank must hide the target`,
      );
    }
  }
  assert.equal(ids.size, 36);
});
