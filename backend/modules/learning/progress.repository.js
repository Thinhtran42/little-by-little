import {
  initialState,
  normalizeProgress,
  recordAttempt,
  dayKey,
} from "../../../shared/progress.js";
export const dayFor = (timezone, now = new Date()) =>
  new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
export const learningDate = (day) => new Date(`${day}T12:00:00`);
export async function userDay(tx, id) {
  const r = await tx.query(
    "SELECT timezone FROM learner_settings WHERE user_id=$1",
    [id],
  );
  return dayFor(r.rows[0].timezone);
}
export async function lockUser(tx, id) {
  await tx.query(
    "SELECT user_id FROM learner_settings WHERE user_id=$1 FOR UPDATE",
    [id],
  );
}
export async function readState(db, id) {
  // Keep the revision and all tables in the same serialized user snapshot.
  if (db.kind)
    return db.transaction(async (tx) => {
      await lockUser(tx, id);
      return readState(tx, id);
    });
  const state = initialState();
  const settings = (
    await db.query("SELECT * FROM learner_settings WHERE user_id=$1", [id])
  ).rows[0];
  state.profile = settings.profile;
  state.goal = settings.goal;
  state.audio = settings.audio;
  for (const p of (
    await db.query("SELECT * FROM phrase_progress WHERE user_id=$1", [id])
  ).rows)
    state.learned[p.phrase_id] = {
      date: p.first_seen,
      due: p.due_day,
      level: p.level,
      verified: p.verified,
      correct: p.correct_count,
      wrong: p.wrong_count,
      lastPassed: p.last_passed,
    };
  state.saved = (
    await db.query("SELECT phrase_id FROM bookmarks WHERE user_id=$1", [id])
  ).rows.map((r) => r.phrase_id);
  for (const r of (
    await db.query(
      "SELECT day,phrase_id FROM daily_activity WHERE user_id=$1 ORDER BY day",
      [id],
    )
  ).rows)
    (state.history[r.day] ||= []).push(r.phrase_id);
  for (const r of (
    await db.query(
      "SELECT phrase_id,note FROM personal_notes WHERE user_id=$1",
      [id],
    )
  ).rows)
    state.notes[r.phrase_id] = r.note;
  state.attempts = (
    await db.query(
      "SELECT event_key,phrase_id,mode,correct,hinted,day FROM attempts WHERE user_id=$1 ORDER BY created_at DESC,event_key DESC LIMIT 5000",
      [id],
    )
  ).rows
    .reverse()
    .map((r) => ({
      key: r.event_key,
      id: r.phrase_id,
      mode: r.mode,
      correct: r.correct,
      hinted: r.hinted,
      day: r.day,
    }));
  for (const r of (
    await db.query(
      "SELECT DISTINCT ON(scenario_id) scenario_id,correct,total,day FROM scenario_attempts WHERE user_id=$1 ORDER BY scenario_id,created_at DESC,event_key DESC",
      [id],
    )
  ).rows)
    state.scenarios[r.scenario_id] = {
      correct: r.correct,
      total: r.total,
      date: r.day,
    };
  return {
    state,
    revision: Number(settings.revision),
    timezone: settings.timezone,
  };
}
export async function readPhraseState(tx, id, phraseId) {
  const state = initialState();
  const p = (
    await tx.query(
      "SELECT * FROM phrase_progress WHERE user_id=$1 AND phrase_id=$2",
      [id, phraseId],
    )
  ).rows[0];
  if (p)
    state.learned[phraseId] = {
      date: p.first_seen,
      due: p.due_day,
      level: p.level,
      verified: p.verified,
      correct: p.correct_count,
      wrong: p.wrong_count,
      lastPassed: p.last_passed,
    };
  return state;
}
export async function writeProgress(tx, id, phraseId, p) {
  await tx.query(
    `INSERT INTO phrase_progress(user_id,phrase_id,first_seen,due_day,level,verified,correct_count,wrong_count,last_passed) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9) ON CONFLICT(user_id,phrase_id) DO UPDATE SET first_seen=excluded.first_seen,due_day=excluded.due_day,level=excluded.level,verified=excluded.verified,correct_count=excluded.correct_count,wrong_count=excluded.wrong_count,last_passed=excluded.last_passed`,
    [
      id,
      phraseId,
      p.date,
      p.due,
      p.level,
      p.verified || false,
      p.correct || 0,
      p.wrong || 0,
      p.lastPassed || null,
    ],
  );
}
export async function bump(tx, id) {
  await tx.query(
    "UPDATE learner_settings SET revision=revision+1 WHERE user_id=$1",
    [id],
  );
}
export async function importState(tx, id, raw) {
  const state = normalizeProgress(raw),
    known = new Set(
      (await tx.query("SELECT id FROM phrases")).rows.map((r) => r.id),
    );
  for (const table of [
    "phrase_progress",
    "attempts",
    "daily_activity",
    "bookmarks",
    "personal_notes",
    "scenario_attempts",
  ])
    await tx.query(`DELETE FROM ${table} WHERE user_id=$1`, [id]);
  const today = await userDay(tx, id);
  // Imported client history is never accepted as verified assessment evidence.
  for (const [phraseId, p] of Object.entries(state.learned))
    if (known.has(phraseId))
      await writeProgress(tx, id, phraseId, {
        ...p,
        due: today,
        level: 0,
        verified: false,
        correct: 0,
        wrong: 0,
        lastPassed: null,
      });
  for (const phraseId of state.saved)
    if (known.has(phraseId))
      await tx.query("INSERT INTO bookmarks(user_id,phrase_id) VALUES($1,$2)", [
        id,
        phraseId,
      ]);
  for (const [phraseId, note] of Object.entries(state.notes))
    if (known.has(phraseId))
      await tx.query(
        "INSERT INTO personal_notes(user_id,phrase_id,note) VALUES($1,$2,$3)",
        [id, phraseId, note],
      );
  for (const [day, ids] of Object.entries(state.history))
    for (const phraseId of ids)
      if (known.has(phraseId) && day <= today)
        await tx.query(
          "INSERT INTO daily_activity(user_id,day,phrase_id) VALUES($1,$2,$3) ON CONFLICT DO NOTHING",
          [id, day, phraseId],
        );
  await tx.query(
    "UPDATE learner_settings SET profile=$2,goal=$3,audio=$4,revision=revision+1 WHERE user_id=$1",
    [
      id,
      JSON.stringify(state.profile),
      state.goal,
      JSON.stringify(state.audio),
    ],
  );
}
