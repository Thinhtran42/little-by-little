import { randomUUID } from "node:crypto";
import { OAuth2Client } from "google-auth-library";
import {
  hashPassword,
  verifyPassword,
  token,
  hashToken,
  csrfFor,
  safeUser,
} from "../security.js";
import { initialState } from "../../shared/progress.js";
import { fail, text, validateEmail } from "../errors.js";
export async function authRoutes(app, { db, production }) {
  const dummy = await hashPassword(token());
  const googleClientId = process.env.GOOGLE_CLIENT_ID || "";
  const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET || "";
  const googleRedirectUri =
    process.env.GOOGLE_REDIRECT_URI ||
    `${process.env.PUBLIC_ORIGIN || process.env.RENDER_EXTERNAL_URL || "http://localhost:3001"}/api/auth/google/callback`;
  const google = googleClientId ? new OAuth2Client(googleClientId) : null;
  const publicRoute = {
    config: { public: true, rateLimit: { max: 15, timeWindow: "15 minutes" } },
  };
  async function session(tx, userId) {
    const raw = token();
    await tx.query(
      "INSERT INTO sessions(token_hash,user_id,expires_at) VALUES($1,$2,$3)",
      [hashToken(raw), userId, new Date(Date.now() + 7 * 86400000)],
    );
    return raw;
  }
  function cookie(reply, raw) {
    reply.setCookie("little_session", raw, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: production,
      maxAge: 7 * 86400,
    });
  }
  function oauthCookie(reply, raw) {
    reply.setCookie("google_oauth_state", raw, {
      path: "/api/auth/google",
      httpOnly: true,
      sameSite: "lax",
      secure: production,
      maxAge: 600,
    });
  }
  function clearOauthCookie(reply) {
    reply.clearCookie("google_oauth_state", { path: "/api/auth/google" });
  }
  app.get("/api/auth/google/start", { config: { public: true } }, async (req, reply) => {
    if (!googleClientId || !googleClientSecret) {
      return reply.redirect("/?auth_error=google_not_configured");
    }
    const state = token();
    oauthCookie(reply, state);
    const params = new URLSearchParams({
      client_id: googleClientId,
      redirect_uri: googleRedirectUri,
      response_type: "code",
      scope: "openid email profile",
      state,
      prompt: "select_account",
    });
    return reply.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`);
  });
  app.get("/api/auth/google/callback", { config: { public: true } }, async (req, reply) => {
    const state = String(req.query?.state || ""),
      expected = String(req.cookies.google_oauth_state || "");
    clearOauthCookie(reply);
    if (!google || !googleClientSecret || !state || !expected || hashToken(state) !== hashToken(expected))
      return reply.redirect("/?auth_error=google_state");
    try {
      const code = String(req.query?.code || "");
      if (!code) return reply.redirect("/?auth_error=google_cancelled");
      const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "content-type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          code,
          client_id: googleClientId,
          client_secret: googleClientSecret,
          redirect_uri: googleRedirectUri,
          grant_type: "authorization_code",
        }),
      });
      if (!tokenResponse.ok) throw new Error("Google token exchange failed");
      const tokens = await tokenResponse.json();
      const ticket = await google.verifyIdToken({
        idToken: tokens.id_token,
        audience: googleClientId,
      });
      const profile = ticket.getPayload();
      if (!profile?.sub || !profile.email || profile.email_verified !== true)
        throw new Error("Google account email is not verified");
      const address = validateEmail(profile.email), name = text(profile.name || "", "Tên", { max: 40 });
      const raw = await db.transaction(async (tx) => {
        let user = (await tx.query("SELECT * FROM users WHERE auth_provider='google' AND provider_subject=$1", [profile.sub])).rows[0];
        if (!user) user = (await tx.query("SELECT * FROM users WHERE email=$1", [address])).rows[0];
        if (!user) {
          const id = randomUUID();
          const passwordHash = await hashPassword(token());
          user = (await tx.query(
            "INSERT INTO users(id,email,password_hash,auth_provider,provider_subject) VALUES($1,$2,$3,'google',$4) RETURNING *",
            [id, address, passwordHash, profile.sub],
          )).rows[0];
          const d = initialState();
          d.profile.name = name;
          await tx.query("INSERT INTO learner_settings(user_id,profile,audio) VALUES($1,$2,$3)", [id, JSON.stringify(d.profile), JSON.stringify(d.audio)]);
        } else {
          await tx.query("UPDATE users SET auth_provider='google',provider_subject=COALESCE(provider_subject,$2) WHERE id=$1", [user.id, profile.sub]);
        }
        return session(tx, user.id);
      });
      cookie(reply, raw);
      return reply.redirect("/?auth=google_success");
    } catch (error) {
      req.log.warn({ err: error }, "google_auth_failed");
      return reply.redirect("/?auth_error=google_failed");
    }
  });
  app.post("/api/auth/register", publicRoute, async (req, reply) => {
    const address = validateEmail(req.body?.email),
      password = text(req.body?.password, "Mật khẩu", { min: 12, max: 128 }),
      name = text(req.body?.name || "", "Tên", { min: 0, max: 40 }),
      hashed = await hashPassword(password),
      recoveryCode = token(),
      id = randomUUID();
    const raw = await db.transaction(async (tx) => {
      await tx.query(
        "INSERT INTO users(id,email,password_hash,recovery_hash) VALUES($1,$2,$3,$4)",
        [id, address, hashed, hashToken(recoveryCode)],
      );
      const d = initialState();
      d.profile.name = name;
      await tx.query(
        "INSERT INTO learner_settings(user_id,profile,audio) VALUES($1,$2,$3)",
        [id, JSON.stringify(d.profile), JSON.stringify(d.audio)],
      );
      return session(tx, id);
    });
    cookie(reply, raw);
    reply.code(201);
    return {
      user: { id, email: address, role: "learner" },
      csrf: csrfFor(raw),
      recoveryCode,
    };
  });
  app.post("/api/auth/login", publicRoute, async (req, reply) => {
    const address = validateEmail(req.body?.email),
      password = text(req.body?.password, "Mật khẩu", { max: 128 });
    const user = (
      await db.query("SELECT * FROM users WHERE email=$1", [address])
    ).rows[0];
    const valid = await verifyPassword(password, user?.password_hash || dummy);
    if (!user || !valid)
      fail(401, "Email hoặc mật khẩu chưa đúng.", "BAD_CREDENTIALS");
    const raw = await db.transaction((tx) => session(tx, user.id));
    cookie(reply, raw);
    return { user: safeUser(user), csrf: csrfFor(raw) };
  });
  app.get("/api/auth/me", { config: { public: true } }, async (req) =>
    req.user
      ? { user: req.user, csrf: csrfFor(req.cookies.little_session) }
      : { user: null },
  );
  app.post("/api/auth/logout", async (req, reply) => {
    await db.query("DELETE FROM sessions WHERE token_hash=$1", [
      hashToken(req.cookies.little_session),
    ]);
    reply.clearCookie("little_session", { path: "/" });
    return { ok: true };
  });
  app.post("/api/auth/recover", publicRoute, async (req, reply) => {
    const address = validateEmail(req.body?.email),
      code = text(req.body?.recoveryCode, "Mã khôi phục", {
        min: 20,
        max: 100,
      }),
      password = text(req.body?.password, "Mật khẩu mới", {
        min: 12,
        max: 128,
      }),
      newHash = await hashPassword(password),
      replacement = token();
    await db.transaction(async (tx) => {
      const user = (
        await tx.query(
          "SELECT * FROM users WHERE email=$1 AND recovery_hash=$2 FOR UPDATE",
          [address, hashToken(code)],
        )
      ).rows[0];
      if (!user)
        fail(400, "Email hoặc mã khôi phục chưa đúng.", "RECOVERY_FAILED");
      await tx.query(
        "UPDATE users SET password_hash=$2,recovery_hash=$3 WHERE id=$1",
        [user.id, newHash, hashToken(replacement)],
      );
      await tx.query("DELETE FROM sessions WHERE user_id=$1", [user.id]);
      await tx.query(
        "INSERT INTO audit_log(id,actor_id,action) VALUES($1,$2,$3)",
        [randomUUID(), user.id, "password_recovered"],
      );
    });
    reply.clearCookie("little_session", { path: "/" });
    return { ok: true, recoveryCode: replacement };
  });
  app.post("/api/auth/change-password", async (req) => {
    const old = text(req.body?.currentPassword, "Mật khẩu hiện tại", {
        max: 128,
      }),
      next = text(req.body?.newPassword, "Mật khẩu mới", { min: 12, max: 128 });
    const user = (
      await db.query("SELECT password_hash FROM users WHERE id=$1", [
        req.user.id,
      ])
    ).rows[0];
    if (!(await verifyPassword(old, user.password_hash)))
      fail(401, "Mật khẩu hiện tại chưa đúng.");
    const hashed = await hashPassword(next);
    await db.transaction(async (tx) => {
      await tx.query("UPDATE users SET password_hash=$2 WHERE id=$1", [
        req.user.id,
        hashed,
      ]);
      await tx.query(
        "DELETE FROM sessions WHERE user_id=$1 AND token_hash<>$2",
        [req.user.id, hashToken(req.cookies.little_session)],
      );
    });
    return { ok: true };
  });
  app.delete("/api/auth/account", async (req, reply) => {
    const password = text(req.body?.password, "Mật khẩu", { max: 128 });
    const user = (
      await db.query("SELECT password_hash FROM users WHERE id=$1", [
        req.user.id,
      ])
    ).rows[0];
    if (!(await verifyPassword(password, user.password_hash)))
      fail(401, "Mật khẩu chưa đúng.");
    await db.query("DELETE FROM users WHERE id=$1", [req.user.id]);
    reply.clearCookie("little_session", { path: "/" });
    return { ok: true };
  });
}
