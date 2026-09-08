function positiveInteger(value, fallback, name) {
  const n = value === undefined || value === "" ? fallback : Number(value);
  if (!Number.isSafeInteger(n) || n < 1)
    throw new Error(`${name} must be a positive integer.`);
  return n;
}
/** Provider-neutral settings. Never log this object. */
export function readDatabaseConfig(env = process.env) {
  if (env.DB_SSL && !["true", "false"].includes(env.DB_SSL))
    throw new Error("DB_SSL must be true or false.");
  return {
    driver: env.DB_DRIVER || "auto",
    url: env.DATABASE_URL || null,
    dataDir: env.LOCAL_DATABASE_DIR,
    production: env.NODE_ENV === "production",
    ssl: env.DB_SSL ? env.DB_SSL === "true" : undefined,
    caFile: env.DB_SSL_CA_FILE || undefined,
    poolSize: positiveInteger(env.DB_POOL_SIZE, 10, "DB_POOL_SIZE"),
    connectionTimeoutMillis: positiveInteger(
      env.DB_CONNECT_TIMEOUT_MS,
      10000,
      "DB_CONNECT_TIMEOUT_MS",
    ),
    idleTimeoutMillis: positiveInteger(
      env.DB_IDLE_TIMEOUT_MS,
      30000,
      "DB_IDLE_TIMEOUT_MS",
    ),
  };
}
