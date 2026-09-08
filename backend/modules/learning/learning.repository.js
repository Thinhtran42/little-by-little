// Accept the active transaction connection for atomic multi-step operations.
export function updatePreferences(
  connection,
  { userId, profile, goal, audio, timezone },
) {
  return connection.query(
    "UPDATE learner_settings SET profile=$2,goal=$3,audio=$4,timezone=COALESCE($5,timezone) WHERE user_id=$1",
    [userId, profile, goal, audio, timezone],
  );
}
export function findPhraseId(connection, { phraseId }) {
  return connection.query("SELECT id FROM phrases WHERE id=$1", [phraseId]);
}
export function insertBookmark(connection, { userId, phraseId }) {
  return connection.query(
    "INSERT INTO bookmarks(user_id,phrase_id) VALUES($1,$2) ON CONFLICT DO NOTHING",
    [userId, phraseId],
  );
}
export function deleteBookmark(connection, { userId, phraseId }) {
  return connection.query(
    "DELETE FROM bookmarks WHERE user_id=$1 AND phrase_id=$2",
    [userId, phraseId],
  );
}
export function upsertNote(connection, { userId, phraseId, note }) {
  return connection.query(
    "INSERT INTO personal_notes(user_id,phrase_id,note) VALUES($1,$2,$3) ON CONFLICT(user_id,phrase_id) DO UPDATE SET note=excluded.note",
    [userId, phraseId, note],
  );
}
export function markSeen(connection, { userId, phraseId, day }) {
  return connection.query(
    "INSERT INTO phrase_progress(user_id,phrase_id,first_seen,due_day) VALUES($1,$2,$3,$3) ON CONFLICT DO NOTHING",
    [userId, phraseId, day],
  );
}
export function deletePhraseProgress(connection, { userId, phraseId }) {
  return connection.query(
    "DELETE FROM phrase_progress WHERE user_id=$1 AND phrase_id=$2",
    [userId, phraseId],
  );
}
export function findPhrase(connection, { phraseId }) {
  return connection.query("SELECT content FROM phrases WHERE id=$1", [
    phraseId,
  ]);
}
export function findAttempt(connection, { userId, key }) {
  return connection.query(
    "SELECT * FROM attempts WHERE user_id=$1 AND event_key=$2",
    [userId, key],
  );
}
export function insertAttempt(
  connection,
  { userId, key, phraseId, mode, answer, correct, hinted, day },
) {
  return connection.query(
    "INSERT INTO attempts(user_id,event_key,phrase_id,mode,answer,correct,hinted,day) VALUES($1,$2,$3,$4,$5,$6,$7,$8)",
    [userId, key, phraseId, mode, answer, correct, hinted, day],
  );
}
export function insertActivity(connection, { userId, day, phraseId }) {
  return connection.query(
    "INSERT INTO daily_activity(user_id,day,phrase_id) VALUES($1,$2,$3) ON CONFLICT DO NOTHING",
    [userId, day, phraseId],
  );
}
export function findScenario(connection, { scenarioId }) {
  return connection.query("SELECT content FROM scenarios WHERE id=$1", [
    scenarioId,
  ]);
}
export function findScenarioAttempt(connection, { userId, key }) {
  return connection.query(
    "SELECT answers,scenario_id,correct,total FROM scenario_attempts WHERE user_id=$1 AND event_key=$2",
    [userId, key],
  );
}
export function insertScenarioAttempt(
  connection,
  { userId, key, scenarioId, answers, correct, total, day },
) {
  return connection.query(
    "INSERT INTO scenario_attempts(user_id,event_key,scenario_id,answers,correct,total,day) VALUES($1,$2,$3,$4,$5,$6,$7)",
    [userId, key, scenarioId, answers, correct, total, day],
  );
}
