import { readFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";
// SQL DATE is a calendar day, never a JavaScript timestamp in a server timezone.
pg.types.setTypeParser(1082, (value) => value);
import { PGlite } from "@electric-sql/pglite";
export const projectRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);
export async function connectDatabase({
  url = process.env.DATABASE_URL,
  dataDir = process.env.LOCAL_DATABASE_DIR ||
    path.join(projectRoot, ".data/postgres"),
  production = process.env.NODE_ENV === "production",
} = {}) {
  if (url) {
    const pool = new pg.Pool({
      connectionString: url,
      max: Number(process.env.DB_POOL_SIZE || 10),
      ssl:
        process.env.DB_SSL === "true"
          ? { rejectUnauthorized: true }
          : undefined,
    });
    await pool.query("SELECT 1");
    return {
      kind: "postgresql",
      query: (sql, args) => pool.query(sql, args),
      exec: (sql) => pool.query(sql),
      transaction: async (fn) => {
        const c = await pool.connect();
        try {
          await c.query("BEGIN");
          const result = await fn(c);
          await c.query("COMMIT");
          return result;
        } catch (e) {
          await c.query("ROLLBACK");
          throw e;
        } finally {
          c.release();
        }
      },
      close: () => pool.end(),
    };
  }
  if (production)
    throw new Error(
      "Production requires DATABASE_URL pointing to PostgreSQL. Embedded development database is disabled.",
    );
  if (dataDir !== "memory://") await mkdir(dataDir, { recursive: true });
  const db = new PGlite(dataDir);
  await db.waitReady;
  return {
    kind: "pglite-development",
    query: (sql, args) => db.query(sql, args),
    exec: (sql) => db.exec(sql),
    transaction: (fn) => db.transaction(fn),
    close: () => db.close(),
  };
}
export async function migrate(db) {
  const sql = await readFile(new URL("./schema.sql", import.meta.url), "utf8");
  await db.transaction(async (tx) => {
    if (db.kind === "postgresql")
      await tx.query("SELECT pg_advisory_xact_lock(817263)");
    await (tx.exec ? tx.exec(sql) : tx.query(sql));
  });
}
