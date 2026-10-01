import { Router } from "express";
import { z } from "zod";
import { query } from "../db.js";
import { requireAuth, type AuthenticatedRequest } from "../middleware/auth.js";

const router = Router();
router.get("/me", requireAuth, async (req: AuthenticatedRequest, res) => {
  const rows = await query("select u.id,u.username,p.display_name,p.avatar_url,p.bio from users u join profiles p on p.user_id=u.id where u.id=$1", [req.userId]);
  if (!rows.length) return res.status(404).json({ error: "USER_NOT_FOUND" });
  res.json(rows[0]);
});

router.patch("/me", requireAuth, async (req: AuthenticatedRequest, res) => {
  const input = z.object({ displayName: z.string().trim().min(1).max(80).optional(), bio: z.string().max(500).optional(), avatarUrl: z.string().url().max(2048).optional() }).parse(req.body);
  await query("update profiles set display_name=coalesce($2,display_name),bio=coalesce($3,bio),avatar_url=coalesce($4,avatar_url),updated_at=now() where user_id=$1", [req.userId,input.displayName,input.bio,input.avatarUrl]);
  const rows = await query("select u.id,u.username,p.display_name,p.avatar_url,p.bio from users u join profiles p on p.user_id=u.id where u.id=$1", [req.userId]);
  res.json(rows[0]);
});
export default router;
