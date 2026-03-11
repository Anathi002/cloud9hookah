import "dotenv/config";
import pg from "pg";

const { Pool } = pg;

const useSsl = String(process.env.DATABASE_SSL || "false").toLowerCase() === "true";
const ssl = useSsl ? { rejectUnauthorized: false } : false;

function buildPoolConfig() {
  const databaseUrl = String(process.env.DATABASE_URL || "").trim();

  if (databaseUrl) {
    return {
      connectionString: databaseUrl,
      ssl,
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
  };
}

export const pool = new Pool(buildPoolConfig());
