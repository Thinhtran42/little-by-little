import test from "node:test";
import assert from "node:assert/strict";
import { connectDatabase, migrate } from "../db/index.js";
import { createApp } from "../app.js";
test("station lesson stores server-graded answers, resumes, isolates users and rejects conflicting retries", async () => {
  const db = await connectDatabase({
    url: null,
    dataDir: "memory://",
    production: false,
  });
  await migrate(db);
  const app = await createApp({ db });
  const register = async (email) => {
    const r = await app.inject({
      method: "POST",
      url: "/api/auth/register",
      payload: { email, password: "Test-lesson-password-2026!", name: "Test" },
    });
    assert.equal(r.statusCode, 201);
    return {
      cookie: r.headers["set-cookie"].split(";")[0],
      csrf: r.json().csrf,
      id: r.json().user.id,
    };
  };
  const request = (a, method, payload) =>
    app.inject({
      method,
      url: "/api/me/lessons/station" + (method === "POST" ? "/attempts" : ""),
      headers: { cookie: a.cookie, "x-csrf-token": a.csrf },
      ...(payload ? { payload } : {}),
    });
  try {
    const a = await register("lesson-one@example.test"),
      b = await register("lesson-two@example.test");
    const input = {
      key: "lesson-attempt-1",
      version: 1,
      questionId: "pickup",
      answer: "wrong",
      hinted: false,
      correct: true,
    };
    let r = await request(a, "POST", input);
    assert.equal(r.statusCode, 200);
    assert.equal(r.json().result.correct, false);
    r = await request(a, "POST", input);
    assert.equal(r.json().attempts.length, 1);
    r = await request(a, "POST", { ...input, answer: "pick me up" });
    assert.equal(r.statusCode, 409);
    r = await request(a, "POST", {
      ...input,
      key: "lesson-attempt-2",
      questionId: "depart",
      answer: "set off",
      hinted: true,
    });
    assert.equal(r.json().result.correct, true);
    assert.equal(r.json().result.hinted, true);
    const restored = (await request(a, "GET")).json();
    assert.equal(restored.attempts.length, 2);
    assert.ok(restored.attempts.every((x) => x.due_day > restored.today));
    assert.equal((await request(b, "GET")).json().attempts.length, 0);
    assert.equal(
      (await app.inject({ method: "GET", url: "/api/me/lessons/station" }))
        .statusCode,
      401,
    );
    assert.equal(
      (await request(a, "POST", { ...input, key: "bad", version: 99 }))
        .statusCode,
      400,
    );
    const csrf = await app.inject({
      method: "POST",
      url: "/api/me/lessons/station/attempts",
      headers: { cookie: a.cookie },
      payload: input,
    });
    assert.equal(csrf.statusCode, 403);
    await db.query("DELETE FROM users WHERE id=$1", [a.id]);
    assert.equal(
      (await db.query("SELECT * FROM lesson_attempts WHERE user_id=$1", [a.id]))
        .rows.length,
      0,
    );
  } finally {
    await app.close();
    await db.close();
  }
});
