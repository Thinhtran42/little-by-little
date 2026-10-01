import {
  createLessonsService,
  createCoursesService,
} from "./lessons.service.js";
import { phrasalLessons } from "../../../shared/phrasal-lessons.js";
import { workLessons } from '../../../shared/work-course.js';
export async function lessonsRoutes(app, dependencies) {
  const work=createCoursesService(dependencies,workLessons);
  app.get('/api/me/work-course',req=>work.summary(req.user));
  app.get('/api/me/work-course/:lessonId',req=>work.progress(req.user,req.params.lessonId));
  app.post('/api/me/work-course/:lessonId/attempts',req=>work.submit(req.user,req.params.lessonId,req.body));
  const station = createLessonsService(dependencies),
    courses = createCoursesService(dependencies);
  app.get("/api/me/lessons/station", (req) => station.progress(req.user));
  app.post("/api/me/lessons/station/attempts", (req) =>
    station.submit(req.user, req.body),
  );
  app.get("/api/me/courses", (req) => courses.summary(req.user));
  app.get("/api/me/courses/:lessonId", (req) =>
    courses.progress(req.user, req.params.lessonId),
  );
  app.post("/api/me/courses/:lessonId/attempts", (req) =>
    courses.submit(req.user, req.params.lessonId, req.body),
  );
  const phrasal = createCoursesService(dependencies, phrasalLessons);
  app.get("/api/me/phrasal", (req) => phrasal.summary(req.user));
  app.get("/api/me/phrasal/:lessonId", (req) =>
    phrasal.progress(req.user, req.params.lessonId),
  );
  app.post("/api/me/phrasal/:lessonId/attempts", (req) =>
    phrasal.submit(req.user, req.params.lessonId, req.body),
  );
}
