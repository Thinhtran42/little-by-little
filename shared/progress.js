export const STORAGE_KEY = "little-progress";
export const dayKey = (date = new Date()) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
export const addDays = (date, days) =>
  dayKey(new Date(date.getFullYear(), date.getMonth(), date.getDate() + days));
export function streak(history, now = new Date()) {
  let count = 0;
  const date = new Date(now);
  if (!history[dayKey(date)]?.length) date.setDate(date.getDate() - 1);
  while (history[dayKey(date)]?.length) {
    count++;
    date.setDate(date.getDate() - 1);
  }
  return count;
}
export function initialState() {
  return {
    version: 2,
    learned: {},
    saved: [],
    history: {},
    goal: 5,
    attempts: [],
    notes: {},
    scenarios: {},
    profile: {
      name: "",
      focus: "everyday",
      level: "starter",
      onboarded: false,
    },
    audio: { rate: 0.85, accent: "en-US" },
  };
}
const isObject = (x) => !!x && typeof x === "object" && !Array.isArray(x);
const validDate = (x) =>
  typeof x === "string" &&
  /^\d{4}-\d{2}-\d{2}$/.test(x) &&
  !Number.isNaN(Date.parse(x)) &&
  new Date(x).toISOString().slice(0, 10) === x;
const validId = (x) => typeof x === "string" && /^[a-z]+-\d+$/.test(x);
export function normalizeProgress(raw) {
  if (
    !isObject(raw) ||
    !isObject(raw.learned) ||
    !Array.isArray(raw.saved) ||
    !isObject(raw.history)
  )
    throw new Error("Tệp không đúng định dạng bản sao lưu Little by little.");
  if (raw.version && raw.version > 2)
    throw new Error(
      "Bản sao lưu thuộc phiên bản mới hơn. Hãy cập nhật ứng dụng.",
    );
  const state = initialState();
  state.goal = [5, 10, 15].includes(raw.goal) ? raw.goal : 5;
  for (const [id, r] of Object.entries(raw.learned))
    if (validId(id) && isObject(r) && validDate(r.date) && validDate(r.due))
      state.learned[id] = {
        date: r.date,
        due: r.due,
        level: Math.max(0, Math.min(5, Math.floor(Number(r.level) || 0))),
        correct: Math.max(0, Number(r.correct) || 0),
        wrong: Math.max(0, Number(r.wrong) || 0),
        lastPassed: validDate(r.lastPassed) ? r.lastPassed : null,
        verified: !!r.verified,
      };
  state.saved = [...new Set(raw.saved.filter(validId))];
  for (const [day, ids] of Object.entries(raw.history))
    if (validDate(day) && Array.isArray(ids))
      state.history[day] = [...new Set(ids.filter(validId))];
  state.attempts = Array.isArray(raw.attempts)
    ? raw.attempts
        .filter(
          (a) =>
            isObject(a) &&
            validId(a.id) &&
            validDate(a.day) &&
            typeof a.correct === "boolean" &&
            typeof a.key === "string" &&
            ["recall", "listen", "choice"].includes(a.mode),
        )
        .slice(-5000)
        .map((a) => ({
          key: a.key.slice(0, 100),
          id: a.id,
          day: a.day,
          correct: a.correct,
          mode: a.mode,
          hinted: !!a.hinted,
        }))
    : [];
  if (isObject(raw.notes))
    for (const [id, n] of Object.entries(raw.notes))
      if (validId(id) && typeof n === "string")
        state.notes[id] = n.slice(0, 2000);
  if (isObject(raw.scenarios))
    for (const [id, s] of Object.entries(raw.scenarios))
      if (
        /^[a-z]+$/.test(id) &&
        isObject(s) &&
        Number.isInteger(s.correct) &&
        Number.isInteger(s.total) &&
        s.correct >= 0 &&
        s.correct <= s.total &&
        s.total <= 20
      )
        state.scenarios[id] = {
          correct: s.correct,
          total: s.total,
          date: validDate(s.date) ? s.date : dayKey(),
        };
  if (isObject(raw.profile))
    state.profile = {
      name: String(raw.profile.name || "").slice(0, 40),
      focus: ["everyday", "work", "travel", "connections"].includes(
        raw.profile.focus,
      )
        ? raw.profile.focus
        : "everyday",
      level: ["starter", "returning"].includes(raw.profile.level)
        ? raw.profile.level
        : "starter",
      onboarded: !!raw.profile.onboarded,
    };
  else if (Object.keys(state.learned).length) state.profile.onboarded = true;
  if (isObject(raw.audio))
    state.audio = {
      rate: [0.7, 0.85, 1].includes(raw.audio.rate) ? raw.audio.rate : 0.85,
      accent: ["en-US", "en-GB"].includes(raw.audio.accent)
        ? raw.audio.accent
        : "en-US",
    };
  return state;
}
export function loadProgress() {
  let value;
  try {
    value = localStorage.getItem(STORAGE_KEY);
    return value ? normalizeProgress(JSON.parse(value)) : initialState();
  } catch {
    if (value) {
      try {
        localStorage.setItem("little-progress-recovery", value);
      } catch {}
    }
    return initialState();
  }
}
const recordActivity = (state, id, now) => ({
  ...state.history,
  [dayKey(now)]: [...new Set([...(state.history[dayKey(now)] || []), id])],
});
// A manual tick means seen; it does not prove independent recall.
export function markLearned(state, id, now = new Date()) {
  return {
    ...state,
    learned: {
      ...state.learned,
      [id]: state.learned[id] || {
        date: dayKey(now),
        due: addDays(now, 1),
        level: 0,
        correct: 0,
        wrong: 0,
        verified: false,
      },
    },
    history: recordActivity(state, id, now),
  };
}
export function recordAttempt(
  state,
  id,
  { correct, mode = "recall", hinted = false, key },
  now = new Date(),
) {
  if (key && state.attempts.some((a) => a.key === key)) return state;
  const old = state.learned[id] || {
    date: dayKey(now),
    level: 0,
    correct: 0,
    wrong: 0,
    verified: false,
  };
  const passed = correct && !hinted,
    productive = mode !== "choice",
    alreadyPassed = old.lastPassed === dayKey(now);
  const level = passed
    ? productive
      ? alreadyPassed
        ? old.level
        : old.verified
          ? Math.min(old.level + 1, 5)
          : 0
      : old.level
    : 0;
  const due =
    passed && !productive
      ? old.due || addDays(now, 1)
      : passed && alreadyPassed && old.due > dayKey(now)
        ? old.due
        : addDays(now, passed ? [1, 3, 7, 14, 30, 60][level] : 0);
  const attempt = {
    id,
    correct: passed,
    mode,
    hinted,
    day: dayKey(now),
    key: key || `${Date.now()}-${Math.random()}`,
  };
  return {
    ...state,
    learned: {
      ...state.learned,
      [id]: {
        ...old,
        level,
        due,
        verified: old.verified || (passed && productive),
        correct: (old.correct || 0) + (passed ? 1 : 0),
        wrong: (old.wrong || 0) + (passed ? 0 : 1),
        lastPassed: passed && productive ? dayKey(now) : old.lastPassed || null,
      },
    },
    attempts: [...state.attempts, attempt].slice(-5000),
    history: recordActivity(state, id, now),
  };
}
export function reviewPhrase(state, id, remembered, now = new Date()) {
  return recordAttempt(state, id, { correct: remembered }, now);
}
export const mastery = (entry) =>
  !entry
    ? "new"
    : entry.verified && entry.level >= 2
      ? "strong"
      : entry.verified
        ? "growing"
        : "seen";
export const focusTopics = {
  everyday: [
    "everyday",
    "food",
    "home",
    "shopping",
    "health",
    "tech",
    "help",
    "learning",
  ],
  work: [
    "work",
    "interview",
    "phone",
    "plans",
    "tech",
    "help",
    "feelings",
    "learning",
  ],
  travel: [
    "travel",
    "food",
    "shopping",
    "help",
    "phone",
    "plans",
    "health",
    "everyday",
  ],
  connections: [
    "friends",
    "feelings",
    "entertainment",
    "phone",
    "food",
    "plans",
    "home",
    "everyday",
  ],
};
export function dailyPlan(state, phrases, now = new Date()) {
  const today = dayKey(now),
    done = state.history[today] || [],
    selected = focusTopics[state.profile?.focus] || focusTopics.everyday;
  const due = phrases
    .filter((p) => state.learned[p.id]?.due <= today)
    .sort(
      (a, b) =>
        state.learned[a.id].due.localeCompare(state.learned[b.id].due) ||
        (state.learned[b.id].wrong || 0) - (state.learned[a.id].wrong || 0),
    )
    .slice(0, state.goal * 2);
  const newCount = done.filter(
    (id) => state.learned[id]?.date === today,
  ).length;
  const pool = phrases
    .filter((p) => !state.learned[p.id])
    .sort((a, b) => {
      const ai = selected.indexOf(a.topic),
        bi = selected.indexOf(b.topic);
      return (
        (ai < 0 ? 99 : ai) - (bi < 0 ? 99 : bi) ||
        (state.profile?.level === "starter"
          ? (a.type === "sentence" ? 0 : 1) - (b.type === "sentence" ? 0 : 1)
          : 0)
      );
    });
  const fresh = pool.slice(0, Math.max(0, state.goal - newCount));
  return { due, fresh, items: [...due, ...fresh], newCount };
}
