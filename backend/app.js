import Fastify from "fastify";
import cookie from "@fastify/cookie";
import helmet from "@fastify/helmet";
import rateLimit from "@fastify/rate-limit";
import staticFiles from "@fastify/static";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { projectRoot } from "./db/index.js";
import { hashToken, csrfFor, safeUser } from "./security.js";
import { fail } from "./errors.js";
import { authRoutes } from "./routes/auth.js";
import { learningRoutes } from "./routes/learning.js";
export async function createApp({
  db,
  production = false,
  logger = false,
  origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3001",
    "http://127.0.0.1:3001",
  ],
  serveFrontend = false,
} = {}) {
  const app = Fastify({
    logger: logger
      ? {
          redact: [
            "req.headers.cookie",
            "req.headers.authorization",
            'res.headers["set-cookie"]',
          ],
        }
      : false,
    bodyLimit: 5 * 1024 * 1024,
    trustProxy: process.env.TRUST_PROXY === "true",
  });
  await app.register(cookie);
  await app.register(helmet, {
    contentSecurityPolicy: production
      ? { directives: { mediaSrc: ["'self'", "blob:"] } }
      : false,
  });
  await app.register(rateLimit, { max: 200, timeWindow: "1 minute", allowList: req => !req.url.startsWith('/api/') || req.url === '/api/health' });
  app.decorateRequest("user", null);
  app.addHook("preHandler", async (req, reply) => {
    if (!req.url.startsWith("/api/")) return;
    reply.header("Cache-Control", "no-store");
    const write = !["GET", "HEAD", "OPTIONS"].includes(req.method);
    if (write) {
      if (req.headers.origin && !origins.includes(req.headers.origin))
        fail(403, "Nguồn yêu cầu không được phép.", "ORIGIN_BLOCKED");
      if (!req.headers["content-type"]?.startsWith("application/json"))
        fail(415, "Yêu cầu cần dữ liệu JSON.");
    }
    const raw = req.cookies.little_session;
    if (raw) {
      const user = (
        await db.query(
          "SELECT u.id,u.email,u.role FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.token_hash=$1 AND s.expires_at>now()",
          [hashToken(raw)],
        )
      ).rows[0];
      if (user) req.user = safeUser(user);
    }
    if (!req.routeOptions.config.public && !req.user)
      fail(401, "Vui lòng đăng nhập để tiếp tục.", "AUTH_REQUIRED");
    if (
      write &&
      !req.routeOptions.config.public &&
      req.headers["x-csrf-token"] !== csrfFor(raw || "")
    )
      fail(403, "Phiên làm việc cần được tải lại.", "CSRF_FAILED");
  });
  app.setErrorHandler((error, req, reply) => {
    const status = error.statusCode || (error.code === "23505" ? 409 : 500);
    if (status >= 500) req.log.error({ err: error }, "request_failed");
    reply.code(status).send({
      error: {
        code:
          status === 500 ? "INTERNAL_ERROR" : error.code || "REQUEST_FAILED",
        message:
          status === 500
            ? "Máy chủ gặp sự cố. Vui lòng thử lại."
            : error.code === "23505"
              ? "Email này đã được đăng ký."
              : error.message,
      },
    });
  });
  app.get("/api/health", { config: { public: true } }, async () => {
    await db.query("SELECT 1");
    return { ok: true, version: "3.0.0" };
  });
  await authRoutes(app, { db, production });
  await learningRoutes(app, { db });
  const dist = resolve(projectRoot, "dist");
  if (serveFrontend && existsSync(dist)) {
    await app.register(staticFiles, { root: dist });
    app.setNotFoundHandler((req, reply) => {
      if (req.url.startsWith("/api/"))
        return reply.code(404).send({
          error: { code: "NOT_FOUND", message: "API không tồn tại." },
        });
      return reply.sendFile("index.html");
    });
  }
  return app;
}
