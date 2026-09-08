import path from "node:path";
import { fileURLToPath } from "node:url";
import { readDatabaseConfig } from "../config/database.js";
import { connectPostgres } from "./adapters/postgres.js";
import { connectPglite } from "./adapters/pglite.js";
export { migrate } from "./migrate.js";
export const projectRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);
/** Provider choice stays at the composition boundary. */
export async function connectDatabase(overrides = {}) {
  const config = { ...readDatabaseConfig(), ...overrides };
  config.dataDir ||= path.join(projectRoot, ".data/postgres");
  const driver =
    config.driver === "auto"
      ? config.url
        ? "postgres"
        : "pglite"
      : config.driver;
  if (!["postgres", "pglite"].includes(driver))
    throw new Error("DB_DRIVER must be auto, postgres or pglite.");
  if (driver === "postgres") {
    if (!config.url)
      throw new Error("DATABASE_URL is required for the postgres adapter.");
    return connectPostgres(config);
  }
  if (config.production)
    throw new Error(
      "Production requires PostgreSQL. Embedded development database is disabled.",
    );
  if (config.url)
    throw new Error("Remove DATABASE_URL before selecting the pglite adapter.");
  return connectPglite(config);
}
