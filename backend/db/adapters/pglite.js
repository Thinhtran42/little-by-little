import { mkdir } from "node:fs/promises";
import { PGlite } from "@electric-sql/pglite";
/** Local development adapter, same PostgreSQL dialect. */
export async function connectPglite({ dataDir }) {
  if (dataDir !== "memory://") await mkdir(dataDir, { recursive: true });
  const db = new PGlite(dataDir);
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
