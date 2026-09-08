import { createAuthService } from "./auth.service.js";
import { createAuthController } from "./auth.controller.js";
export async function authRoutes(
  app,
  { db, production, config, googleProvider },
) {
  const service = await createAuthService({ db });
  const controller = createAuthController({
    service,
    production,
    config,
    provider: googleProvider,
  });
  const publicRoute = {
    config: { public: true, rateLimit: { max: 15, timeWindow: "15 minutes" } },
  };
  app.get(
    "/api/auth/google/start",
    { config: { public: true } },
    controller.googleStart,
  );
  app.get(
    "/api/auth/google/callback",
    { config: { public: true } },
    controller.googleCallback,
  );
  app.post("/api/auth/register", publicRoute, controller.register);
  app.post("/api/auth/login", publicRoute, controller.login);
  app.get("/api/auth/me", { config: { public: true } }, controller.me);
  app.post("/api/auth/logout", controller.logout);
  app.post("/api/auth/recover", publicRoute, controller.recover);
  app.post("/api/auth/change-password", controller.changePassword);
  app.delete("/api/auth/account", controller.deleteAccount);
}
