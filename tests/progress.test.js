import test from "node:test";
import assert from "node:assert/strict";
import {
  dayKey,
  streak,
  initialState,
  markLearned,
  recordAttempt,
  normalizeProgress,
  dailyPlan,
  mastery,
} from "../shared/progress.js";
import { topics, phrases } from "../shared/catalog.js";
import { scenarios } from "../shared/scenarios.js";
import { checkAnswer, choiceOptions } from "../shared/learning.js";
const now = new Date(2026, 8, 7, 12);
test("640 authored items, 16 balanced topics, and 48 dialogue turns", () => {
  assert.equal(topics.length, 16);
  assert.equal(phrases.length, 640);
  assert.equal(new Set(phrases.map((p) => p.id)).size, 640);
  for (const t of topics) {
    const rows = phrases.filter((p) => p.topic === t.id);
    assert.equal(rows.length, 40);
    for (const [type, count] of [
      ["sentence", 24],
      ["phrasal", 8],
      ["expression", 8],
    ])
      assert.equal(rows.filter((p) => p.type === type).length, count);
    for (const p of rows) {
      assert.ok(p.en && p.vi);
      assert.equal(p.en, p.en.trim());
      if (p.type !== "sentence") assert.ok(p.note);
    }
  }
  assert.equal(scenarios.length, 16);
  for (const s of scenarios) {
    assert.equal(s.steps.length, 3);
    for (const q of s.steps) {
      assert.equal(new Set(q.options).size, 3);
      assert.ok(q.options.includes(q.answer) && q.why);
    }
  }
});
test("manual ticks preserve original ID, never imply mastered knowledge", () => {
  let state = markLearned(initialState(), "everyday-0", now);
  state = markLearned(state, "everyday-0", now);
  assert.equal(state.history["2026-09-07"].length, 1);
  assert.equal(mastery(state.learned["everyday-0"]), "seen");
  assert.equal(state.learned["everyday-0"].due, "2026-09-08");
});
test("productive recall advances only across different dates; errors return today", () => {
  let state = recordAttempt(
    initialState(),
    "everyday-0",
    { correct: true },
    now,
  );
  assert.equal(state.learned["everyday-0"].due, "2026-09-08");
  state = recordAttempt(state, "everyday-0", { correct: true }, now);
  assert.equal(state.learned["everyday-0"].level, 0);
  state = recordAttempt(
    state,
    "everyday-0",
    { correct: true },
    new Date(2026, 8, 8),
  );
  assert.equal(state.learned["everyday-0"].due, "2026-09-11");
  state = recordAttempt(
    state,
    "everyday-0",
    { correct: true },
    new Date(2026, 8, 11),
  );
  assert.equal(mastery(state.learned["everyday-0"]), "strong");
  state = recordAttempt(
    state,
    "everyday-0",
    { correct: false },
    new Date(2026, 8, 11),
  );
  assert.equal(state.learned["everyday-0"].due, "2026-09-11");
  assert.equal(state.learned["everyday-0"].level, 0);
  state = recordAttempt(
    state,
    "everyday-0",
    { correct: true },
    new Date(2026, 8, 11),
  );
  assert.equal(state.learned["everyday-0"].due, "2026-09-12");
});
test("hints and recognition cannot manufacture independent recall", () => {
  let state = recordAttempt(
    initialState(),
    "food-0",
    { correct: true, hinted: true },
    now,
  );
  assert.equal(state.learned["food-0"].verified, false);
  assert.equal(state.learned["food-0"].wrong, 1);
  state = recordAttempt(
    state,
    "food-0",
    { correct: true, mode: "choice" },
    now,
  );
  assert.equal(state.learned["food-0"].verified, false);
  assert.equal(state.learned["food-0"].level, 0);
});
test("duplicate submission keys are idempotent", () => {
  const result = { correct: true, key: "same", mode: "recall" };
  const state = recordAttempt(initialState(), "work-0", result, now);
  assert.equal(recordAttempt(state, "work-0", result, now), state);
});
test("legacy self-rated levels cannot skip independent recall stages", () => {
  const old = normalizeProgress({
    goal: 5,
    learned: {
      "everyday-0": { date: "2026-09-01", due: "2026-09-07", level: 5 },
    },
    saved: [],
    history: {},
  });
  const tested = recordAttempt(old, "everyday-0", { correct: true }, now);
  assert.equal(tested.learned["everyday-0"].level, 0);
  assert.equal(mastery(tested.learned["everyday-0"]), "growing");
});
test("recognition cannot postpone a due productive review", () => {
  const old = recordAttempt(
    initialState(),
    "work-0",
    { correct: true },
    new Date(2026, 8, 6),
  );
  const recognized = recordAttempt(
    old,
    "work-0",
    { correct: true, mode: "choice" },
    now,
  );
  assert.equal(recognized.learned["work-0"].due, "2026-09-07");
});
test("local date and streak handle boundaries and empty history arrays", () => {
  assert.equal(dayKey(new Date(2026, 0, 31)), "2026-01-31");
  const state = markLearned(initialState(), "work-0", new Date(2026, 0, 31));
  assert.equal(state.learned["work-0"].due, "2026-02-01");
  assert.equal(
    streak({ "2026-09-05": ["a"], "2026-09-06": ["b"], "2026-09-07": [] }, now),
    2,
  );
  assert.equal(streak({ "2026-09-05": ["a"] }, now), 0);
});
test("v1 migration preserves IDs without treating old ticks as verified", () => {
  const state = normalizeProgress({
    goal: 10,
    learned: {
      "everyday-0": { date: "2026-09-06", due: "2026-09-07", level: 3 },
    },
    saved: ["everyday-0"],
    history: { "2026-09-06": ["everyday-0"] },
  });
  assert.equal(state.version, 2);
  assert.equal(state.learned["everyday-0"].verified, false);
  assert.equal(state.goal, 10);
  assert.equal(state.profile.onboarded, true);
});
test("malformed imports reject before mutation and sanitize valid envelopes", () => {
  assert.throws(() => normalizeProgress({}), /định dạng/);
  assert.throws(
    () => normalizeProgress({ ...initialState(), version: 99 }),
    /phiên bản/,
  );
  const state = normalizeProgress({
    ...initialState(),
    saved: ["bad-id", "work-0", "work-0"],
    learned: { "work-0": null },
    history: { nope: ["work-0"] },
  });
  assert.deepEqual(state.saved, ["work-0"]);
  assert.deepEqual(state.learned, {});
  assert.deepEqual(state.history, {});
});
test("daily plan prioritizes due items and chosen focus, with bounded workload", () => {
  let state = initialState();
  state.profile.focus = "travel";
  state = recordAttempt(state, "work-0", { correct: false }, now);
  const plan = dailyPlan(state, phrases, now);
  assert.equal(plan.items[0].id, "work-0");
  assert.equal(plan.fresh[0].topic, "travel");
  assert.equal(plan.fresh.length, 4);
  assert.equal(new Set(plan.items.map((p) => p.id)).size, plan.items.length);
});
test("answer matching accepts case, punctuation, curly apostrophes and known contractions without fuzzy grading", () => {
  assert.equal(checkAnswer("I AM ON MY WAY!", "I'm on my way."), true);
  assert.equal(checkAnswer("I can’t hear you.", "I cannot hear you."), true);
  assert.equal(checkAnswer("Let's go.", "Let us go."), true);
  assert.equal(checkAnswer("I have a cat.", "I have a car."), false);
  assert.equal(checkAnswer("", ""), false);
});
test("recognition choices contain exactly one answer and distinct translations", () => {
  for (const p of phrases) {
    const options = choiceOptions(p, phrases);
    assert.equal(options.length, 4);
    assert.equal(options.filter((o) => o.id === p.id).length, 1);
    assert.equal(new Set(options.map((o) => o.vi)).size, 4);
  }
});
