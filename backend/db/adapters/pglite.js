import { mkdir } from "node:fs/promises";
import { PGlite } from "@electric-sql/pglite";
/** Local development adapter, same PostgreSQL dialect. */
export async function connectPglite({ dataDir }) {
  if (dataDir !== "memory://") await mkdir(dataDir, { recursive: true });
  // Keep SQL DATE values calendar-only, matching the PostgreSQL adapter.
  const db = new PGlite(dataDir, { parsers: { 1082: (value) => value } });
  await db.waitReady;
  return {
    kind: "pglite-development",
    dialect: "postgresql",
    query: (sql, args) => db.query(sql, args),
    exec: (sql) => db.exec(sql),
    transaction: (work) => db.transaction(work),
    close: () => db.close(),
  };
}
