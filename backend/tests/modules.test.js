import test, { before, after } from "node:test";
import assert from "node:assert/strict";
import { connectDatabase, migrate } from "../db/index.js";
import { seed } from "../db/seed.js";
import { createApp } from "../app.js";
import { readConfig } from "../config/index.js";
import { createAuthService } from "../modules/auth/auth.service.js";
import { createLearningService } from "../modules/learning/learning.service.js";

let db;
before(async () => {
  db = await connectDatabase({
    url: null,
    dataDir: "memory://",
    production: false,
  });
  await migrate(db);
  await seed(db);
});
after(async () => db?.close());

test("services register a user and update progress without HTTP request objects", async () => {
  const auth = await createAuthService({ db });
  const result = await auth.register({
    input: {
      email: "service@example.test",
      password: "Module-test-password-2026!",
      name: "Service",
    },
  });
  assert.ok(result.sessionToken);
  const learning = createLearningService({ db });
  await learning.applyCommands({
    actor: result.user,
    input: { commands: [{ type: "preferences", value: { goal: 10 } }] },
  });
  const progress = await learning.getProgress({ actor: result.user });
  assert.equal(progress.state.goal, 10);
  assert.equal(progress.state.profile.name, "Service");
});

test("Google controller keeps state validation and session cookie contract with injected provider", async () => {
  let exchanges = 0;
  const app = await createApp({
    db,
    config: readConfig({}),
    googleProvider: {
      enabled: true,
      authorizationUrl: (state) =>
        `https://accounts.example.test/authorize?state=${state}`,
      verifyCode: async (code) => {
        assert.equal(code, "test-code");
        exchanges++;
        return {
          sub: "subject-module-test",
          email: "oauth-module@example.test",
          email_verified: true,
          name: "Google Test",
        };
      },
    },
  });
  try {
    const start = await app.inject({
      method: "GET",
      url: "/api/auth/google/start",
    });
    assert.equal(start.statusCode, 302);
    const state = new URL(start.headers.location).searchParams.get("state");
    assert.ok(state);
    const cookie = start.headers["set-cookie"].split(";")[0];
    const bad = await app.inject({
      method: "GET",
      url: "/api/auth/google/callback?state=wrong&code=test-code",
      headers: { cookie },
    });
    assert.equal(bad.headers.location, "/?auth_error=google_state");
    assert.equal(exchanges, 0);
    const callback = await app.inject({
      method: "GET",
      url: `/api/auth/google/callback?state=${state}&code=test-code`,
      headers: { cookie },
    });
    assert.equal(callback.headers.location, "/?auth=google_success");
    assert.equal(exchanges, 1);
    const cookies = [callback.headers["set-cookie"]].flat();
    const session = cookies.find((c) => c.startsWith("little_session="));
    assert.match(session, /HttpOnly/);
    const me = await app.inject({
      method: "GET",
      url: "/api/auth/me",
      headers: { cookie: session.split(";")[0] },
    });
    assert.equal(me.json().user.email, "oauth-module@example.test");
    assert.equal("sessionToken" in me.json(), false);
    const progress = await app.inject({
      method: "GET",
      url: "/api/me/progress",
      headers: { cookie: session.split(";")[0] },
    });
    assert.equal(progress.json().state.profile.name, "Google Test");
  } finally {
    await app.close();
  }
});

test("password HTTP response does not expose service sessionToken", async () => {
  const app = await createApp({ db, config: readConfig({}) });
  try {
    const result = await app.inject({
      method: "POST",
      url: "/api/auth/register",
      payload: {
        email: "http-contract@example.test",
        password: "Module-test-password-2026!",
        name: "Contract",
      },
    });
    assert.equal(result.statusCode, 201);
    assert.equal("sessionToken" in result.json(), false);
    assert.match(result.headers["set-cookie"], /HttpOnly/);
    const disabled = await app.inject({
      method: "GET",
      url: "/api/auth/google/start",
    });
    assert.equal(
      disabled.headers.location,
      "/?auth_error=google_not_configured",
    );
  } finally {
    await app.close();
  }
});

test("configuration is deterministic when an environment object is supplied", () => {
  const config = readConfig({
    RENDER_EXTERNAL_URL: "https://demo.example",
    NODE_ENV: "production",
  });
  assert.equal(
    config.google.redirectUri,
    "https://demo.example/api/auth/google/callback",
  );
  assert.equal(config.production, true);
  assert.equal(readConfig({}).google.clientSecret, "");
});
