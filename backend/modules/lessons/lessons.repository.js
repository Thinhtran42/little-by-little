export async function listAttempts(db, userId, lesson) {
  return (
    await db.query(
      "SELECT DISTINCT ON(question_id) question_id,answer,correct,hinted,day,due_day FROM lesson_attempts WHERE user_id=$1 AND lesson_id=$2 AND version=$3 ORDER BY question_id,created_at DESC,event_key DESC",
      [userId, lesson.id, lesson.version],
    )
  ).rows;
}
export async function findAttempt(tx, userId, key) {
  return (
    await tx.query(
      "SELECT * FROM lesson_attempts WHERE user_id=$1 AND event_key=$2",
      [userId, key],
    )
  ).rows[0];
}
export async function insertAttempt(tx, a) {
  await tx.query(
    "INSERT INTO lesson_attempts(user_id,event_key,lesson_id,version,question_id,answer,correct,hinted,day,due_day) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)",
    [
      a.userId,
      a.key,
      a.lesson.id,
      a.lesson.version,
      a.questionId,
      a.answer,
      a.correct,
      a.hinted,
      a.day,
      a.due,
    ],
  );
}
