import { Pool } from "pg";
import { env } from "./config.js";

export const pool = env.DATABASE_URL
  ? new Pool({ connectionString: env.DATABASE_URL, max: 10, ssl: env.NODE_ENV === "production" ? { rejectUnauthorized: false } : undefined })
  : null;

export async function query<T extends object = any>(text: string, params: unknown[] = []): Promise<T[]> {
  if (!pool) throw new Error("DATABASE_URL is not configured");
  const result = await pool.query<T>(text, params);
  return result.rows;
}
