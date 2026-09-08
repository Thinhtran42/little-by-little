import { readFile } from "node:fs/promises";
/** PostgreSQL schema: another engine requires different migrations. */
export async function migrate(db) {
  const sql = await readFile(new URL("./schema.sql", import.meta.url), "utf8");
  await db.transaction(async (tx) => {
    if (db.kind === "postgresql")
      await tx.query("SELECT pg_advisory_xact_lock(817263)");
    await (tx.exec ? tx.exec(sql) : tx.query(sql));
  });
}
