import test from "node:test";
import assert from "node:assert/strict";
import { connectDatabase, migrate } from "../db/index.js";
import { createApp } from "../app.js";
import { workLessons } from "../../shared/work-course.js";
test("work course checkpoints use authenticated server grading and remain separate from other curricula", async () => {
  const db = await connectDatabase({
    url: null,
    dataDir: "memory://",
    production: false,
  });
  await migrate(db);
  const app = await createApp({ db });
  try {
    const r = await app.inject({
      method: "POST",
      url: "/api/auth/register",
      payload: {
        email: "work-course@example.test",
        password: "Work-course-2026!",
        name: "Work",
      },
    });
    assert.equal(r.statusCode, 201);
    const headers = {
      cookie: r.headers["set-cookie"].split(";")[0],
      "x-csrf-token": r.json().csrf,
    };
    const l = workLessons.at(-1),
      base = "/api/me/work-course/" + l.id;
    assert.equal((await app.inject({ url: base })).statusCode, 401);
    const body = {
      key: "work-first",
      version: 1,
      questionId: l.questions[0].id,
      answer: "wrong",
      hinted: false,
      correct: true,
    };
    const send = (payload) =>
      app.inject({ method: "POST", url: base + "/attempts", headers, payload });
    const wrong = await send(body);
    assert.equal(wrong.statusCode, 200);
    assert.equal(wrong.json().result.correct, false);
    const good = { ...body, key: "work-second", answer: l.questions[0].answer };
    const saved = await send(good);
    assert.equal(saved.json().result.correct, true);
    assert.deepEqual((await send(good)).json().result, saved.json().result);
    assert.equal((await send({ ...good, version: 99 })).statusCode, 400);
    assert.equal(
      (await app.inject({ url: "/api/me/work-course", headers })).json().stats
        .practiced,
      1,
    );
    assert.equal(
      (await app.inject({ url: "/api/me/courses", headers })).json().attempts
        .length,
      0,
    );
    assert.equal(
      (await app.inject({ url: "/api/me/export", headers })).json().lessons
        .attempts.length,
      2,
    );
  } finally {
    await app.close();
    await db.close();
  }
});
