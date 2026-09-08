import { createAdminService } from "./admin.service.js";
export async function adminRoutes(app, dependencies) {
  const service = createAdminService(dependencies);
  app.patch("/api/admin/phrases/:id", (req) =>
    service.updatePhrase({
      actor: req.user,
      input: req.body,
      params: req.params,
    }),
  );
}
