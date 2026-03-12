import "dotenv/config";
import pg from "pg";

const { Pool } = pg;

const useSsl = String(process.env.DATABASE_SSL || "false").toLowerCase() === "true";
const ssl = useSsl ? { rejectUnauthorized: false } : false;

function buildPoolConfig() {
  const databaseUrl = String(process.env.DATABASE_URL || "").trim();
  const connectionTimeoutMillis = Number(process.env.DB_CONNECT_TIMEOUT_MS || 10000);
  const statementTimeout = Number(process.env.DB_STATEMENT_TIMEOUT_MS || 15000);
  const queryTimeout = Number(process.env.DB_QUERY_TIMEOUT_MS || 15000);

  const timeoutConfig = {
    connectionTimeoutMillis,
    statement_timeout: statementTimeout,
    query_timeout: queryTimeout,
  };

  if (databaseUrl) {
    return {
      connectionString: databaseUrl,
      ssl,
      ...timeoutConfig,
    };
  }

  // Fallback for local development when DATABASE_URL is not set.
  return {
    host: process.env.DB_HOST || "127.0.0.1",
    port: Number(process.env.DB_PORT || 5432),
    database: process.env.DB_NAME || "cloud9",
    user: process.env.DB_USER || "postgres",
    password: String(process.env.DB_PASSWORD ?? "postgres"),
    ssl,
    ...timeoutConfig,
  };
}

export const pool = new Pool(buildPoolConfig());
