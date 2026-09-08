import { createCatalogService } from "./catalog.service.js";
export async function catalogRoutes(app, dependencies) {
  const service = createCatalogService(dependencies);
  app.get("/api/catalog", { config: { public: true } }, async (req, reply) => {
    const { result, etag } = await service.getCatalog();
    reply
      .header("ETag", etag)
      .header("Cache-Control", "public,max-age=0,must-revalidate");
    if (req.headers["if-none-match"] === etag) return reply.code(304).send();
    return result;
  });
}
