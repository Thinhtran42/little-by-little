import test from "node:test";
import assert from "node:assert/strict";
import { connectDatabase, migrate } from "../db/index.js";
import { createApp } from "../app.js";
import { phrasalLessons } from "../../shared/phrasal-lessons.js";
test("phrasal saves server-graded, isolated, versioned results with idempotent spacing and export/reset", async () => {
  const db = await connectDatabase({
    url: null,
    dataDir: "memory://",
    production: false,
  });
  await migrate(db);
  const app = await createApp({ db });
  try {
    async function account(email) {
      const r = await app.inject({
        method: "POST",
        url: "/api/auth/register",
        payload: { email, password: "Phrasal-password-2026!", name: "Phrasal" },
      });
      assert.equal(r.statusCode, 201);
      return {
        cookie: r.headers["set-cookie"].split(";")[0],
        "x-csrf-token": r.json().csrf,
      };
    }
    const a = await account("phrasal-a@example.test"),
      b = await account("phrasal-b@example.test"),
      l = phrasalLessons[0],
      base = "/api/me/phrasal/" + l.id;
    const send = (headers, url, payload, method) =>
      app.inject({
        method: method || (payload ? "POST" : "GET"),
        url,
        headers,
        ...(payload ? { payload } : {}),
      });
    assert.equal((await send({}, base)).statusCode, 401);
    assert.equal((await send(a, "/api/me/phrasal/missing")).statusCode, 404);
    const body = {
      key: "phrasal-1",
      version: l.version,
      questionId: "recall-1",
      answer: "wrong",
      correct: true,
      hinted: false,
    };
    assert.equal(
      (await send({ cookie: a.cookie }, base + "/attempts", body)).statusCode,
      403,
    );
    assert.equal(
      (await send(a, base + "/attempts", { ...body, version: 99 })).statusCode,
      400,
    );
    const wrong = await send(a, base + "/attempts", body);
    assert.equal(wrong.statusCode, 200);
    assert.equal(wrong.json().result.correct, false);
    assert.equal(wrong.json().result.due, wrong.json().today);
    const correct = {
      ...body,
      key: "phrasal-2",
      answer: l.questions[0].answer,
    };
    const saved = (await send(a, base + "/attempts", correct)).json();
    assert.equal(saved.result.level, 1);
    assert.deepEqual(
      (await send(a, base + "/attempts", correct)).json().result,
      saved.result,
    );
    assert.equal(
      (await send(a, base + "/attempts", { ...correct, answer: "other" }))
        .statusCode,
      409,
    );
    assert.equal((await send(b, base)).json().attempts.length, 0);
    assert.equal((await send(a, "/api/me/phrasal")).json().stats.practiced, 1);
    assert.equal((await send(a, "/api/me/courses")).json().attempts.length, 0);
    const exported = (await send(a, "/api/me/export")).json();
    assert.equal(exported.lessons.attempts.length, 2);
    const order = {
      ...body,
      key: "phrasal-3",
      questionId: "word-order",
      answer: l.order.join(" "),
    };
    assert.equal(
      (await send(a, base + "/attempts", order)).json().result.level,
      1,
    );
    const reset = await send(a, "/api/me/progress", {confirm:true}, "DELETE");
    assert.equal(reset.statusCode, 200);
    assert.equal((await send(a, base)).json().attempts.length, 0);
  } finally {
    await app.close();
    await db.close();
  }
});
