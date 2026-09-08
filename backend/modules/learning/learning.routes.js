import { createLearningService } from "./learning.service.js";
export async function learningRoutes(app, dependencies) {
  const service = createLearningService(dependencies);
  app.get("/api/me/progress", (req) =>
    service.getProgress({
      actor: req.user,
      input: req.body,
      params: req.params,
    }),
  );
  app.get("/api/me/export", (req) =>
    service.exportProgress({
      actor: req.user,
      input: req.body,
      params: req.params,
    }),
  );
  app.post("/api/me/commands", (req) =>
    service.applyCommands({
      actor: req.user,
      input: req.body,
      params: req.params,
    }),
  );
  app.post("/api/me/attempts", (req) =>
    service.submitAttempt({
      actor: req.user,
      input: req.body,
      params: req.params,
    }),
  );
  app.post("/api/me/scenarios/:id", (req) =>
    service.submitScenario({
      actor: req.user,
      input: req.body,
      params: req.params,
    }),
  );
  app.post("/api/me/import", (req) =>
    service.importProgress({
      actor: req.user,
      input: req.body,
      params: req.params,
    }),
  );
  app.delete("/api/me/progress", (req) =>
    service.resetProgress({
      actor: req.user,
      input: req.body,
      params: req.params,
    }),
  );
}
