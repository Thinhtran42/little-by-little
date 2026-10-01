export async function listAttempts(db, userId, lesson) {
  return (
    await db.query(
      "SELECT DISTINCT ON(question_id) question_id,answer,correct,hinted,day,due_day,review_level,last_passed FROM lesson_attempts WHERE user_id=$1 AND lesson_id=$2 AND version=$3 ORDER BY question_id,created_at DESC,event_key DESC",
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
export async function listCourseAttempts(db, userId, lessonIds) {
  return (await db.query(
    'SELECT DISTINCT ON(lesson_id,version,question_id) lesson_id,version,question_id,correct,hinted,day,due_day,review_level,last_passed FROM lesson_attempts WHERE user_id=$1 AND lesson_id=ANY($2::text[]) ORDER BY lesson_id,version,question_id,created_at DESC,event_key DESC',
    [userId, lessonIds],
  )).rows;
}
export async function studyDays(db,userId){
 return (await db.query('SELECT day FROM daily_activity WHERE user_id=$1 UNION SELECT day FROM attempts WHERE user_id=$1 UNION SELECT day FROM scenario_attempts WHERE user_id=$1 UNION SELECT day FROM lesson_attempts WHERE user_id=$1 ORDER BY day DESC',[userId])).rows.map(r=>r.day);
}
export async function exportLessons(db,userId){
 return (await db.query('SELECT event_key,lesson_id,version,question_id,answer,correct,hinted,day,due_day,review_level,last_passed,created_at FROM lesson_attempts WHERE user_id=$1 ORDER BY created_at,event_key',[userId])).rows;
}
export async function insertAttempt(tx, a) {
  await tx.query(
    "INSERT INTO lesson_attempts(user_id,event_key,lesson_id,version,question_id,answer,correct,hinted,day,due_day,review_level,last_passed) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)",
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
      a.level || 0,
      a.lastPassed || null,
    ],
  );
}
