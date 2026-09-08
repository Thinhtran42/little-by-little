import test, { before, after } from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { connectDatabase, migrate } from "../db/index.js";
import { seed } from "../db/seed.js";
import { createApp } from "../app.js";
let db, app;
before(async () => {
  db = await connectDatabase({
    url: null,
    dataDir: "memory://",
    production: false,
  });
  await migrate(db);
  await seed(db);
  app = await createApp({ db });
});
after(async () => {
  await app?.close();
  await db?.close();
});
const password = "A-test-password-2026!";
async function account() {
  const email = `${randomUUID()}@example.test`;
  const r = await app.inject({
    method: "POST",
    url: "/api/auth/register",
    payload: { email, password, name: "Test" },
  });
  assert.equal(r.statusCode, 201, r.body);
  const p = r.json();
  return { ...p, email, cookie: r.cookies[0].name + "=" + r.cookies[0].value };
}
async function request(a, method, url, body) {
  return app.inject({
    method,
    url,
    payload: body,
    headers: {
      cookie: a.cookie,
      "x-csrf-token": a.csrf,
      origin: "http://localhost:5173",
    },
  });
}
test("catalog is seeded in SQL and exposes ETag", async () => {
  const r = await app.inject("/api/catalog");
  assert.equal(r.statusCode, 200);
  assert.equal(r.json().phrases.length, 640);
  assert.equal(r.json().topics.length, 16);
  const same = await app.inject({
    url: "/api/catalog",
    headers: { "if-none-match": r.headers.etag },
  });
  assert.equal(same.statusCode, 304);
});
test("passwords are hashed, cookies HttpOnly, and session survives a second request", async () => {
  const a = await account();
  const stored = (
    await db.query("SELECT password_hash FROM users WHERE id=$1", [a.user.id])
  ).rows[0];
  assert.ok(stored.password_hash.startsWith("scrypt:"));
  assert.notEqual(stored.password_hash, password);
  const r = await request(a, "GET", "/api/auth/me");
  assert.equal(r.json().user.id, a.user.id);
  const login = await app.inject({
    method: "POST",
    url: "/api/auth/login",
    payload: { email: a.email, password },
  });
  assert.match(login.headers["set-cookie"], /HttpOnly/);
  assert.match(login.headers["set-cookie"], /SameSite=Lax/);
});
test("authentication, CSRF and Origin enforced on mutations", async () => {
  const a = await account();
  assert.equal((await app.inject("/api/me/progress")).statusCode, 401);
  const csrf = await app.inject({
    method: "POST",
    url: "/api/me/commands",
    headers: { cookie: a.cookie },
    payload: { commands: [{ type: "seen", id: "work-0", value: true }] },
  });
  assert.equal(csrf.statusCode, 403);
  const origin = await app.inject({
    method: "POST",
    url: "/api/me/commands",
    headers: {
      cookie: a.cookie,
      "x-csrf-token": a.csrf,
      origin: "https://attacker.invalid",
    },
    payload: { commands: [] },
  });
  assert.equal(origin.statusCode, 403);
});
test("learner cannot read or modify another learner by providing userId", async () => {
  const a = await account(),
    b = await account();
  await request(a, "POST", "/api/me/commands", {
    userId: b.user.id,
    commands: [{ type: "bookmark", id: "food-0", value: true }],
  });
  assert.deepEqual(
    (await request(b, "GET", "/api/me/progress")).json().state.saved,
    [],
  );
  assert.deepEqual(
    (await request(a, "GET", "/api/me/progress")).json().state.saved,
    ["food-0"],
  );
});
test("server rejects client-fabricated correct=true and records actual answer", async () => {
  const a = await account();
  const r = await request(a, "POST", "/api/me/attempts", {
    phraseId: "everyday-0",
    answer: "wrong",
    mode: "recall",
    key: "one",
    correct: true,
  });
  assert.equal(r.statusCode, 200, r.body);
  assert.equal(r.json().result.correct, false);
  const state = (await request(a, "GET", "/api/me/progress")).json().state;
  assert.equal(state.learned["everyday-0"].verified, false);
  assert.equal(state.attempts[0].correct, false);
});
test("idempotency and concurrent submissions avoid duplicate/lost records", async () => {
  const a = await account(),
    body = {
      phraseId: "everyday-0",
      answer: "How's your day going?",
      mode: "recall",
      key: "same",
    };
  const rs = await Promise.all([
    request(a, "POST", "/api/me/attempts", body),
    request(a, "POST", "/api/me/attempts", body),
  ]);
  for (const r of rs) assert.equal(r.statusCode, 200, r.body);
  const state = (await request(a, "GET", "/api/me/progress")).json().state;
  assert.equal(state.attempts.length, 1);
  assert.equal(state.learned["everyday-0"].correct, 1);
  const conflict = await request(a, "POST", "/api/me/attempts", {
    ...body,
    answer: "different",
  });
  assert.equal(conflict.statusCode, 409);
});
test("invalid batch rolls back all earlier operations", async () => {
  const a = await account();
  const r = await request(a, "POST", "/api/me/commands", {
    commands: [
      { type: "bookmark", id: "work-0", value: true },
      { type: "note", id: "missing-999", value: "invalid" },
    ],
  });
  assert.equal(r.statusCode, 404);
  assert.deepEqual(
    (await request(a, "GET", "/api/me/progress")).json().state.saved,
    [],
  );
});
test("database-backed content editing requires admin and matching revision", async () => {
  const a = await account(),
    body = {
      en: "Good day.",
      vi: "Chúc một ngày tốt lành.",
      note: "",
      alternatives: [],
      revision: 1,
    };
  assert.equal(
    (await request(a, "PATCH", "/api/admin/phrases/everyday-0", body))
      .statusCode,
    403,
  );
  await db.query("UPDATE users SET role='admin' WHERE id=$1", [a.user.id]);
  const original = (
    await db.query("SELECT content FROM phrases WHERE id='everyday-0'")
  ).rows[0].content;
  const r = await request(a, "PATCH", "/api/admin/phrases/everyday-0", body);
  assert.equal(r.statusCode, 200);
  assert.equal(
    (await request(a, "PATCH", "/api/admin/phrases/everyday-0", body))
      .statusCode,
    409,
  );
  await db.query(
    "UPDATE phrases SET content=$1,revision=1 WHERE id='everyday-0'",
    [JSON.stringify(original)],
  );
});
test("untrusted import preserves bookmarks but cannot grant mastery", async () => {
  const a = await account();
  const raw = {
    version: 2,
    learned: {
      "food-0": {
        date: "2026-09-01",
        due: "2099-01-01",
        level: 5,
        verified: true,
      },
    },
    saved: ["food-0"],
    history: {},
    goal: 5,
  };
  const r = await request(a, "POST", "/api/me/import", {
    confirm: true,
    progress: raw,
  });
  assert.equal(r.statusCode, 200, r.body);
  assert.equal(r.json().state.learned["food-0"].verified, false);
  assert.equal(r.json().state.learned["food-0"].level, 0);
});
test("recovery code is single-use and invalidates all existing sessions", async () => {
  const a = await account();
  const recover = await app.inject({
    method: "POST",
    url: "/api/auth/recover",
    payload: {
      email: a.email,
      password: "A-new-password-2026!",
      recoveryCode: a.recoveryCode,
    },
  });
  assert.equal(recover.statusCode, 200);
  assert.equal((await request(a, "GET", "/api/me/progress")).statusCode, 401);
  const reuse = await app.inject({
    method: "POST",
    url: "/api/auth/recover",
    payload: { email: a.email, password, recoveryCode: a.recoveryCode },
  });
  assert.equal(reuse.statusCode, 400);
});
test("account deletion cascades through all learner data", async () => {
  const a = await account();
  await request(a, "POST", "/api/me/commands", {
    commands: [{ type: "bookmark", id: "work-0", value: true }],
  });
  const r = await request(a, "DELETE", "/api/auth/account", { password });
  assert.equal(r.statusCode, 200);
  assert.equal(
    (await db.query("SELECT * FROM bookmarks WHERE user_id=$1", [a.user.id]))
      .rows.length,
    0,
  );
  assert.equal((await request(a, "GET", "/api/me/progress")).statusCode, 401);
});
