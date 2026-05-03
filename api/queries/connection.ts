import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { env } from "../lib/env.js";
import * as schema from "../../db/schema.js";
import * as relations from "../../db/relations.js";

const fullSchema = { ...schema, ...relations };

let instance: ReturnType<typeof drizzle<typeof fullSchema>> | null = null;
let pool: Pool | null = null;
let dbAvailable = false;

function parsePostgresUrl(url: string) {
  try {
    // First try: if password is URL-encoded, new URL() should work
    const u = new URL(url);
    return {
      user: u.username,
      password: decodeURIComponent(u.password),
      host: u.hostname,
      port: parseInt(u.port || "5432"),
      database: u.pathname.replace(/^\//, ""),
    };
  } catch {
    // Fallback for raw @ in password — find LAST @ before host
    const afterProtocol = url.replace(/^postgresql:\/\//, "");
    const lastAt = afterProtocol.lastIndexOf("@");
    if (lastAt === -1) return null;

    const credentials = afterProtocol.slice(0, lastAt);
    const hostAndDb = afterProtocol.slice(lastAt + 1);

    const colonIdx = credentials.indexOf(":");
    if (colonIdx === -1) return null;

    const user = credentials.slice(0, colonIdx);
    const password = credentials.slice(colonIdx + 1);

    const [hostPort, ...dbParts] = hostAndDb.split("/");
    const [host, portStr] = hostPort.split(":");
    const database = dbParts.join("/"); // in case db name has /
    const port = portStr ? parseInt(portStr) : 5432;

    return { user, password, host, port, database };
  }
}

export function getDb() {
  if (!instance) {
    if (!env.databaseUrl) {
      throw new Error("DATABASE_URL is not set");
    }

    const config = parsePostgresUrl(env.databaseUrl);
    if (!config) {
      throw new Error("Invalid DATABASE_URL format");
    }

    try {
      pool = new Pool({
        user: config.user,
        password: config.password,
        host: config.host,
        port: config.port,
        database: config.database,
        ssl: { rejectUnauthorized: false },
      });

      instance = drizzle(pool, { schema: fullSchema });
      dbAvailable = true;
    } catch (err: any) {
      console.error("[DB] Failed to connect:", err.message);
      dbAvailable = false;
      throw err;
    }
  }
  return instance;
}

export function isDbAvailable() {
  if (dbAvailable) return true;
  if (!instance && env.databaseUrl) {
    try {
      getDb();
      return true;
    } catch (err: any) {
      console.error("[DB] isDbAvailable check failed:", err.message);
      return false;
    }
  }
  return false;
}

export function getPool() {
  return pool;
}


/* ─── Pool cleanup for serverless (Vercel) ─── */
export function cleanupPool() {
  if (pool) {
    pool.end().catch(() => {});
    pool = null;
    instance = null;
    dbAvailable = false;
  }
}

// Cleanup on process exit/signals (important for Vercel serverless)
process.on('SIGTERM', cleanupPool);
process.on('SIGINT', cleanupPool);
