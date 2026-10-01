import jwt from "jsonwebtoken";
import { randomBytes, createHash } from "node:crypto";
import { env } from "../config.js";

function secret(kind: "access" | "refresh"): string {
  const value = kind === "access" ? env.JWT_ACCESS_SECRET : env.JWT_REFRESH_SECRET;
  if (!value) throw new Error(`JWT_${kind.toUpperCase()}_SECRET is not configured`);
  return value;
}

export function issueAccessToken(userId: string): string {
  return jwt.sign({ sub: userId, typ: "access" }, secret("access"), { expiresIn: "15m", issuer: "buzztwig" });
}

export function issueRefreshToken(userId: string): string {
  return jwt.sign({ sub: userId, typ: "refresh", jti: randomBytes(16).toString("hex") }, secret("refresh"), { expiresIn: "30d", issuer: "buzztwig" });
}

export function verifyAccessToken(token: string): string {
  const payload = jwt.verify(token, secret("access"), { issuer: "buzztwig" }) as jwt.JwtPayload;
  if (payload.typ !== "access" || typeof payload.sub !== "string") throw new Error("Invalid access token");
  return payload.sub;
}

export function verifyRefreshToken(token: string): string {
  const payload = jwt.verify(token, secret("refresh"), { issuer: "buzztwig" }) as jwt.JwtPayload;
  if (payload.typ !== "refresh" || typeof payload.sub !== "string") throw new Error("Invalid refresh token");
  return payload.sub;
}

export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}
