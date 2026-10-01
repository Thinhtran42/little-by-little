import test from "node:test";
import assert from "node:assert/strict";
import { connectDatabase, migrate } from "../db/index.js";
import { createApp } from "../app.js";
import { courseUnits } from "../../shared/courses.js";
test("course assessment is server graded, user isolated, resumable, idempotent and rejects stale content", async () => {
  const db = await connectDatabase({
    url: null,
    dataDir: "memory://",
    production: false,
  });
  await migrate(db);
  const app = await createApp({ db });
  try {
    const register = async (email) => {
      const r = await app.inject({
        method: "POST",
        url: "/api/auth/register",
        payload: {
          email,
          password: "Test-course-password-2026!",
          name: "Course",
        },
      });
      assert.equal(r.statusCode, 201);
      return {
        cookie: r.headers["set-cookie"].split(";")[0],
        "x-csrf-token": r.json().csrf,
      };
    };
    const a = await register("course-a@example.test"),
      b = await register("course-b@example.test");
    const unit = courseUnits[12];
    const base = "/api/me/courses/" + unit.id;
    const send = (headers, path, body) =>
      app.inject({
        method: body ? "POST" : "GET",
        url: path,
        headers,
        ...(body ? { payload: body } : {}),
      });
    assert.equal((await send({}, base)).statusCode, 401);
    assert.equal((await send(a, "/api/me/courses/missing")).statusCode, 404);
    const body = {
      key: "course-1",
      version: unit.version,
      questionId: "recall",
      answer: "wrong",
      correct: true,
      hinted: false,
    };
    let r = await send(a, base + "/attempts", body);
    assert.equal(r.statusCode, 200);
    assert.equal(r.json().result.correct, false);
    assert.equal(r.json().result.due, r.json().today);
    assert.equal(
      (await send(a, base + "/attempts", body)).json().attempts.length,
      1,
    );
    assert.equal(
      (await send(a, base + "/attempts", { ...body, answer: "different" }))
        .statusCode,
      409,
    );
    assert.equal(
      (
        await send(
          a,
          "/api/me/courses/" + courseUnits[13].id + "/attempts",
          body,
        )
      ).statusCode,
      409,
    );
    assert.equal(
      (
        await send(a, base + "/attempts", {
          ...body,
          key: "bad-version",
          version: 999,
        })
      ).statusCode,
      400,
    );
    assert.equal(
      (
        await send(a, base + "/attempts", {
          ...body,
          key: "bad-question",
          questionId: "injected",
        })
      ).statusCode,
      400,
    );
    assert.equal(
      (await send({ cookie: a.cookie }, base + "/attempts", body)).statusCode,
      403,
    );
    const expected = unit.questions.find((q) => q.id === "recall").answer;
    r = await send(a, base + "/attempts", {
      ...body,
      key: "course-2",
      answer: expected,
      hinted: true,
    });
    assert.equal(r.json().result.correct, true);
    assert.equal(r.json().result.due, r.json().today);
    r = await send(a, base + "/attempts", {
      ...body,
      key: "course-3",
      answer: expected,
    });
    assert.equal(r.json().result.correct, true);
    assert.ok(r.json().result.due > r.json().today);
    assert.equal((await send(b, base)).json().attempts.length, 0);
    assert.equal((await send(b, "/api/me/courses")).json().attempts.length, 0);
    const summary = (await send(a, "/api/me/courses")).json();
    assert.equal(summary.attempts.length, 1);
    assert.equal(summary.attempts[0].lesson_id, unit.id);
    assert.equal(summary.attempts[0].correct, true);
    assert.equal((await send(a, base)).json().attempts[0].answer, expected);
    assert.equal(summary.stats.practiced,1);
    assert.equal(summary.stats.activeDays,1);
    assert.equal(summary.stats.streak,1);
    assert.equal(summary.attempts[0].review_level,1);
    await migrate(db); // Existing answers survive repeat deployment/migration.
    const exported=(await send(a,'/api/me/export')).json();
    assert.equal(exported.lessons.attempts.length,3);
    assert.ok(exported.lessons.attempts.every(x=>!('user_id' in x)));
    assert.equal((await send(b,'/api/me/export')).json().lessons.attempts.length,0);
    const reset=await app.inject({method:'DELETE',url:'/api/me/progress',headers:a,payload:{confirm:true}});
    assert.equal(reset.statusCode,200);
    assert.equal((await send(a,base)).json().attempts.length,0);
    assert.equal((await send(a,'/api/me/courses')).json().stats.activeDays,0);
  } finally {
    await app.close();
    await db.close();
  }
});
