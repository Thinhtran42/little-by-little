import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { phrasalLessons, phrasalGroups } from "../shared/phrasal-lessons.js";
import { photoSources } from "../shared/photo-sources.js";
test("phrasal contexts resolve highlighted senses, licensed local photographs and complete assessments", () => {
  assert.equal(phrasalLessons.length,18);
  assert.equal(phrasalLessons.reduce((n,l)=>n+l.terms.length,0),72);
  assert.equal(
    new Set(phrasalLessons.map((l) => l.id)).size,
    phrasalLessons.length,
  );
  for (const l of phrasalLessons) {
    assert.ok(phrasalGroups.some((g) => g.id === l.group));
    assert.ok(existsSync("frontend/public" + photoSources[l.scene].src));
    const highlights = [...l.story.matchAll(/\*\*(.*?)\*\*/g)].map((m) => m[1]);
    assert.deepEqual(
      highlights,
      l.terms.map((t) => t.en),
    );
    assert.equal(l.terms.length, 4);
    assert.equal(l.dialogue.length, 6);
    assert.equal(l.questions.length, 5);
    assert.equal(new Set(l.questions.map((q) => q.id)).size, 5);
    assert.equal(l.questions.at(-1).mode, "choice");
    for (const t of l.terms) {
      assert.ok(t.pattern && t.mistake && t.example);
      assert.ok(t.prompt.includes("___"));
    }
  }
});
