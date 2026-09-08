import pg from "pg";
import { readFile } from "node:fs/promises";
export async function postgresOptions(config) {
  let url;
  try {
    url = new URL(config.url);
  } catch {
    throw new Error("DATABASE_URL must be a valid PostgreSQL URL.");
  }
  if (!["postgres:", "postgresql:"].includes(url.protocol))
    throw new Error("The postgres adapter requires a PostgreSQL URL.");
  if (config.caFile && config.ssl === false)
    throw new Error("DB_SSL_CA_FILE requires TLS.");
  let ssl;
  if (config.ssl !== undefined || config.caFile) {
    // pg URL SSL options otherwise override the explicit verification/CA object.
    for (const key of ["sslmode", "sslcert", "sslkey", "sslrootcert", "ssl"])
      url.searchParams.delete(key);
    ssl =
      config.ssl === false
        ? false
        : {
            rejectUnauthorized: true,
            ...(config.caFile
              ? { ca: await readFile(config.caFile, "utf8") }
              : {}),
          };
  }
  return {
    connectionString: url.toString(),
    max: config.poolSize,
    connectionTimeoutMillis: config.connectionTimeoutMillis,
    idleTimeoutMillis: config.idleTimeoutMillis,
    ...(ssl !== undefined ? { ssl } : {}),
    types: {
      getTypeParser: (oid, format) =>
        oid === 1082 && format !== "binary"
          ? (value) => value
          : pg.types.getTypeParser(oid, format),
    },
  };
}
export async function connectPostgres(config, { Pool = pg.Pool } = {}) {
  const pool = new Pool(await postgresOptions(config));
  pool.on("error", () =>
    console.error(
      "An idle database connection failed; the pool will replace it.",
    ),
  );
  try {
    await pool.query("SELECT 1");
  } catch (error) {
    await pool.end();
    throw error;
  }
  return {
    kind: "postgresql",
    dialect: "postgresql",
    query: (sql, args) => pool.query(sql, args),
    exec: (sql) => pool.query(sql),
    transaction: async (work) => {
      const connection = await pool.connect();
      let broken;
      try {
        await connection.query("BEGIN");
        const result = await work(connection);
        await connection.query("COMMIT");
        return result;
      } catch (error) {
        try {
          await connection.query("ROLLBACK");
        } catch (rollbackError) {
          broken = rollbackError;
        }
        throw error;
      } finally {
        connection.release(broken);
      }
    },
    close: () => pool.end(),
  };
}
