import type { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../security/tokens.js";

export interface AuthenticatedRequest extends Request { userId?: string }

export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const header = req.header("authorization");
  if (!header?.startsWith("Bearer ")) return res.status(401).json({ error: "AUTH_REQUIRED" });
  try {
    req.userId = verifyAccessToken(header.slice(7));
    next();
  } catch {
    res.status(401).json({ error: "INVALID_TOKEN" });
  }
}
