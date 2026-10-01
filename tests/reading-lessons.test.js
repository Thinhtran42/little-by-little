import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readingLessons } from "../shared/reading-lessons.js";
import { photoSources } from "../shared/photo-sources.js";
import { checkAnswer } from "../shared/learning.js";
import { sceneFor } from "../frontend/src/components/studio/studio-data.js";

test("readings have resolvable highlights, source records, valid exercises and real local photos", () => {
  assert.equal(
    new Set(readingLessons.map((l) => l.id)).size,
    readingLessons.length,
  );
  assert.equal(readingLessons.length, 18);
  for (const l of readingLessons) {
    assert.ok(photoSources[l.photo]);
    assert.ok(l.goal && l.context && l.source.author);
    assert.ok(l.readings.length >= 2);
    assert.ok(l.terms.length >= 5);
    assert.ok(l.dialogue.length >= 6);
    const targets = l.terms.map((t) => t[0]);
    assert.equal(new Set(targets).size, targets.length);
    for (const p of l.readings) {
      assert.ok(p.vi.length > 40);
      assert.ok(p.text.split(/\s+/).length >= 65);
      const highlights = [...p.text.matchAll(/\*\*(.*?)\*\*/g)].map(
        (m) => m[1],
      );
      assert.ok(highlights.length >= 3);
      for (const h of highlights)
        assert.ok(targets.includes(h), `${l.id}: unknown ${h}`);
    }
    for (const [target, vi, note, example] of l.terms)
      assert.ok(target && vi && note && example);
    assert.ok(
      l.question.answer >= 0 && l.question.answer < l.question.options.length,
    );
    assert.ok(checkAnswer(l.recall.answer, l.recall.answer));
    if (l.source.kind === "adapted")
      assert.ok(l.source.url && l.source.licenseUrl && l.source.note);
  }
  for (const p of Object.values(photoSources)) {
    assert.ok(existsSync(`frontend/public${p.src}`));
    assert.ok(p.url.startsWith("https://www.pexels.com/photo/"));
    assert.ok(p.author && p.alt && p.checkedAt && p.licenseUrl);
  }
});

test("topic photos resolve without unrelated fallback scenes", () => {
  for (const key of [
    "health",
    "learning",
    "interview",
    "phone",
    "plans",
    "tech",
    "help",
    "feelings",
    "entertainment",
  ]) {
    assert.equal(sceneFor(key), key);
    assert.ok(photoSources[sceneFor(key)]);
  }
  assert.equal(sceneFor("travel"), "hotel");
  assert.equal(new Set(readingLessons.filter(l=>l.level!=='B2').map((l) => l.photo)).size, 12);
});
