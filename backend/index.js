import { connectDatabase, migrate } from "./db/index.js";
import { seed } from "./db/seed.js";
import { createApp } from "./app.js";
import { readConfig } from "./config/index.js";
const config = readConfig();
const { production, publicOrigin } = config;
if (production && !publicOrigin)
  throw new Error("PUBLIC_ORIGIN is required in production.");
const db = await connectDatabase();
await migrate(db);
await seed(db);
await db.query("DELETE FROM sessions WHERE expires_at<now()");
const app = await createApp({
  db,
  config,
  production,
  logger: true,
  serveFrontend: config.serveFrontend,
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
  port: config.port,
  host: config.host,
});
console.log(`API ready on port ${config.port}; database: ${db.kind}`);
