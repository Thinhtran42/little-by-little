// Due questions first, then unseen questions. Future reviews stay out of today's queue.
export function phrasalQueue(questions, attempts, today) {
  const due = [],
    unseen = [];
  questions.forEach((q, index) => {
    const attempt = attempts.find((a) => a.question_id === q.id);
    if (!attempt) unseen.push(index);
    else if (attempt.due_day <= today)
      due.push({ index, day: attempt.due_day });
  });
  return [
    ...due
      .sort((a, b) => a.day.localeCompare(b.day) || a.index - b.index)
      .map((a) => a.index),
    ...unseen,
  ];
}
export function searchPhrasal(lesson, query) {
  const normalize = (value) =>
    value
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[đĐ]/g, "d")
      .toLowerCase();
  const haystack = normalize(
    [
      lesson.title,
      lesson.subtitle,
      ...lesson.terms.flatMap((t) => [t.en, t.vi]),
    ].join(" "),
  );
  return normalize(query.trim())
    .split(/\s+/)
    .every((word) => haystack.includes(word));
}
