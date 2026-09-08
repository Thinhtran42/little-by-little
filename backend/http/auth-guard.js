import { hashToken, csrfFor, safeUser } from "../common/security.js";
import { fail } from "../common/errors.js";
import { findSessionUser } from "../modules/auth/auth.repository.js";
export function registerAuthGuard(app, { db, origins }) {
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
      const user = (await findSessionUser(db, { tokenHash: hashToken(raw) }))
        .rows[0];
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
}
