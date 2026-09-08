import { randomUUID } from "node:crypto";
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
