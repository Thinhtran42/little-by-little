import { connectDatabase, migrate } from "./db/index.js";
import { seed } from "./db/seed.js";
import { createApp } from "./app.js";
const production = process.env.NODE_ENV === "production";
const publicOrigin = process.env.PUBLIC_ORIGIN || process.env.RENDER_EXTERNAL_URL;
if (production && !publicOrigin)
  throw new Error("PUBLIC_ORIGIN is required in production.");
const db = await connectDatabase();
await migrate(db);
await seed(db);
await db.query("DELETE FROM sessions WHERE expires_at<now()");
const app = await createApp({
  db,
  production,
  logger: true,
  serveFrontend: production || process.env.SERVE_FRONTEND === "true",
  origins: publicOrigin ? [new URL(publicOrigin).origin] : undefined,
});
const close = async () => {
  await app.close();
  await db.close();
  process.exit(0);
};
process.on("SIGINT", close);
process.on("SIGTERM", close);
await app.listen({
  port: Number(process.env.PORT || 3001),
  host: process.env.HOST || "127.0.0.1",
});
console.log(
  `API ready on port ${process.env.PORT || 3001}; database: ${db.kind}`,
);
