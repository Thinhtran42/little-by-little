import { readConfig } from "./config/index.js";
import { registerAuthGuard } from "./http/auth-guard.js";
import { registerErrorHandler } from "./http/error-handler.js";
import { catalogRoutes } from "./modules/catalog/catalog.routes.js";
import { adminRoutes } from "./modules/admin/admin.routes.js";
import Fastify from "fastify";
import cookie from "@fastify/cookie";
import helmet from "@fastify/helmet";
import rateLimit from "@fastify/rate-limit";
import staticFiles from "@fastify/static";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { projectRoot } from "./db/index.js";

import { authRoutes } from "./modules/auth/auth.routes.js";
import { learningRoutes } from "./modules/learning/learning.routes.js";
export async function createApp({
  db,
  config = readConfig(),
  googleProvider,
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
    trustProxy: config.trustProxy,
  });
  await app.register(cookie);
  await app.register(helmet, {
    contentSecurityPolicy: production
      ? { directives: { mediaSrc: ["'self'", "blob:"] } }
      : false,
  });
  await app.register(rateLimit, {
    max: 200,
    timeWindow: "1 minute",
    allowList: (req) =>
      !req.url.startsWith("/api/") || req.url === "/api/health",
  });
  registerAuthGuard(app, { db, origins });
  registerErrorHandler(app);
  app.get("/api/health", { config: { public: true } }, async () => {
    await db.query("SELECT 1");
    return { ok: true, version: "3.0.0" };
  });
  await authRoutes(app, { db, production, config, googleProvider });
  await catalogRoutes(app, { db });
  await adminRoutes(app, { db });
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
