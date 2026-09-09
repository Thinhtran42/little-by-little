import test from "node:test";
import assert from "node:assert/strict";
import { connectPglite } from "../db/adapters/pglite.js";

test("PGlite preserves calendar dates in queries and transactions", async () => {
  const db = await connectPglite({ dataDir: "memory://" });
  try {
    const sql = "SELECT '2026-09-09'::date AS day, NULL::date AS empty";
    assert.deepEqual((await db.query(sql)).rows[0], {
      day: "2026-09-09",
      empty: null,
    });
    assert.deepEqual(
      await db.transaction(async (tx) => (await tx.query(sql)).rows[0]),
      { day: "2026-09-09", empty: null },
    );
  } finally {
    await db.close();
  }
});
