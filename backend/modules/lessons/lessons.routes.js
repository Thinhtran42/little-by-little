import { createLessonsService } from "./lessons.service.js";
export async function lessonsRoutes(app, dependencies) {
  const service = createLessonsService(dependencies);
  app.get("/api/me/lessons/station", (req) => service.progress(req.user));
  app.post("/api/me/lessons/station/attempts", (req) =>
    service.submit(req.user, req.body),
  );
}
