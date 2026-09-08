import { topics, phrases } from "../../shared/catalog.js";
import { scenarios } from "../../shared/scenarios.js";
export async function seed(db) {
  await db.transaction(async (tx) => {
    for (const [i, t] of topics.entries()) {
      const { rows, ...content } = t;
      await tx.query(
        "INSERT INTO topics(id,position,content) VALUES($1,$2,$3) ON CONFLICT DO NOTHING",
        [t.id, i, JSON.stringify(content)],
      );
    }
    for (const [i, p] of phrases.entries())
      await tx.query(
        "INSERT INTO phrases(id,topic_id,position,content) VALUES($1,$2,$3,$4) ON CONFLICT DO NOTHING",
        [p.id, p.topic, i, JSON.stringify({ ...p, alternatives: [] })],
      );
    for (const [i, s] of scenarios.entries())
      await tx.query(
        "INSERT INTO scenarios(id,position,content) VALUES($1,$2,$3) ON CONFLICT DO NOTHING",
        [s.id, i, JSON.stringify(s)],
      );
  });
}
