import test from "node:test";
import assert from "node:assert/strict";
import { readDatabaseConfig } from "../config/database.js";
import { connectDatabase } from "../db/index.js";
import { connectPostgres, postgresOptions } from "../db/adapters/postgres.js";

test("PostgreSQL provider URLs use the same settings and explicit TLS cannot be overridden by URL", async () => {
  for (const host of [
    "render.example",
    "aws-region.pooler.supabase.com",
    "localhost",
  ]) {
    const config = readDatabaseConfig({
      DATABASE_URL: `postgresql://app:placeholder@${host}:5432/app?sslmode=disable`,
      DB_SSL: "true",
      DB_POOL_SIZE: "5",
    });
    const options = await postgresOptions(config);
    assert.equal(options.ssl.rejectUnauthorized, true);
    assert.equal(
      new URL(options.connectionString).searchParams.has("sslmode"),
      false,
    );
    assert.equal(options.max, 5);
    assert.equal(options.types.getTypeParser(1082)("2026-09-08"), "2026-09-08");
  }
});
test("invalid settings fail early without connecting or silently using local database", async () => {
  assert.throws(
    () => readDatabaseConfig({ DB_POOL_SIZE: "0" }),
    /positive integer/,
  );
  assert.throws(() => readDatabaseConfig({ DB_SSL: "maybe" }), /DB_SSL/);
  await assert.rejects(
    connectDatabase({ driver: "pglite", url: null, production: true }),
    /Production requires/,
  );
  await assert.rejects(
    connectDatabase({ driver: "postgres", url: null }),
    /DATABASE_URL/,
  );
  await assert.rejects(
    connectDatabase({ driver: "mysql", url: null }),
    /DB_DRIVER/,
  );
  await assert.rejects(
    postgresOptions({ url: "mysql://localhost/app" }),
    /PostgreSQL URL/,
  );
});
test("Postgres transaction keeps one connection, commits results and rolls back failures", async () => {
  const calls = [];
  class Pool {
    on() {}
    async query(sql) {
      calls.push(sql);
      return { rows: [] };
    }
    async connect() {
      return {
        query: async (sql) => {
          calls.push(sql);
        },
        release: (error) => calls.push(error ? "discard" : "release"),
      };
    }
    async end() {
      calls.push("end");
    }
  }
  const db = await connectPostgres(
    readDatabaseConfig({ DATABASE_URL: "postgres://localhost/app" }),
    { Pool },
  );
  assert.equal(
    await db.transaction(async (tx) => {
      await tx.query("work");
      return 42;
    }),
    42,
  );
  assert.deepEqual(calls.slice(-4), ["BEGIN", "work", "COMMIT", "release"]);
  const failure = new Error("business failure");
  await assert.rejects(
    db.transaction(async () => {
      throw failure;
    }),
    (e) => e === failure,
  );
  assert.deepEqual(calls.slice(-3), ["BEGIN", "ROLLBACK", "release"]);
  await db.close();
  assert.equal(calls.at(-1), "end");
});
test("failed startup closes pool and failed rollback discards connection without hiding original error", async () => {
  let closed = false,
    discarded;
  const failure = new Error("startup");
  class BadPool {
    on() {}
    async query() {
      throw failure;
    }
    async end() {
      closed = true;
    }
  }
  const config = readDatabaseConfig({
    DATABASE_URL: "postgres://localhost/app",
  });
  await assert.rejects(
    connectPostgres(config, { Pool: BadPool }),
    (e) => e === failure,
  );
  assert.equal(closed, true);
  class Pool {
    on() {}
    async query() {}
    async end() {}
    async connect() {
      return {
        query: async (sql) => {
          if (sql === "ROLLBACK") throw new Error("broken connection");
        },
        release: (e) => {
          discarded = e;
        },
      };
    }
  }
  const db = await connectPostgres(config, { Pool });
  await assert.rejects(
    db.transaction(async () => {
      throw failure;
    }),
    (e) => e === failure,
  );
  assert.match(discarded.message, /broken connection/);
  await db.close();
});
