import { Router } from "express";
import { z } from "zod";
import { query } from "../db.js";
import { hashPassword, verifyPassword } from "../security/password.js";
import { hashToken, issueAccessToken, issueRefreshToken, verifyRefreshToken } from "../security/tokens.js";

const router = Router();
const credentials = z.object({
  username: z.string().trim().min(3).max(32).regex(/^[a-zA-Z0-9_]+$/),
  password: z.string().min(8).max(128),
  displayName: z.string().trim().min(1).max(80).optional()
});

router.post("/register", async (req, res) => {
  const input = credentials.parse(req.body);
  const exists = await query<{id:string}>("select id from users where lower(username)=lower($1) limit 1", [input.username]);
  if (exists.length) return res.status(409).json({ error: "USERNAME_TAKEN" });
  const passwordHash = await hashPassword(input.password);
  const rows = await query<{id:string;username:string}>(
    "insert into users(username,password_hash) values($1,$2) returning id,username",
    [input.username.toLowerCase(), passwordHash]
  );
  const user = rows[0];
  await query("insert into profiles(user_id,display_name) values($1,$2)", [user.id, input.displayName ?? input.username]);
  const accessToken = issueAccessToken(user.id);
  const refreshToken = issueRefreshToken(user.id);
  await query("insert into user_sessions(user_id,refresh_token_hash,expires_at) values($1,$2,now()+interval '30 days')", [user.id, hashToken(refreshToken)]);
  res.status(201).json({ user, accessToken, refreshToken });
});

router.post("/login", async (req, res) => {
  const input = credentials.pick({username:true,password:true}).parse(req.body);
  const rows = await query<{id:string;username:string;password_hash:string}>("select id,username,password_hash from users where lower(username)=lower($1) limit 1", [input.username]);
  const user = rows[0];
  if (!user || !(await verifyPassword(input.password, user.password_hash))) return res.status(401).json({ error: "INVALID_CREDENTIALS" });
  const accessToken = issueAccessToken(user.id);
  const refreshToken = issueRefreshToken(user.id);
  await query("insert into user_sessions(user_id,refresh_token_hash,expires_at) values($1,$2,now()+interval '30 days')", [user.id, hashToken(refreshToken)]);
  res.json({ user: { id: user.id, username: user.username }, accessToken, refreshToken });
});

router.post("/refresh", async (req, res) => {
  const token = z.object({ refreshToken: z.string().min(20) }).parse(req.body).refreshToken;
  const userId = verifyRefreshToken(token);
  const sessions = await query<{id:string}>("select id from user_sessions where user_id=$1 and refresh_token_hash=$2 and revoked_at is null and expires_at>now() limit 1", [userId, hashToken(token)]);
  if (!sessions.length) return res.status(401).json({ error: "REFRESH_REVOKED" });
  await query("update user_sessions set revoked_at=now() where id=$1", [sessions[0].id]);
  const nextRefresh = issueRefreshToken(userId);
  await query("insert into user_sessions(user_id,refresh_token_hash,expires_at) values($1,$2,now()+interval '30 days')", [userId, hashToken(nextRefresh)]);
  res.json({ accessToken: issueAccessToken(userId), refreshToken: nextRefresh });
});

router.post("/logout", async (req, res) => {
  const token = z.object({ refreshToken: z.string().min(20) }).parse(req.body).refreshToken;
  await query("update user_sessions set revoked_at=now() where refresh_token_hash=$1", [hashToken(token)]);
  res.status(204).send();
});

export default router;
