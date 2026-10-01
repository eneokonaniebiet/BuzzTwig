import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(3000),
  DATABASE_URL: z.string().min(1).optional(),
  JWT_ACCESS_SECRET: z.string().min(32).optional(),
  JWT_REFRESH_SECRET: z.string().min(32).optional(),
  CORS_ORIGINS: z.string().default("http://localhost:3000"),
  NODE_ENV: z.enum(["development","test","production"]).default("development")
});

export const env = envSchema.parse(process.env);
