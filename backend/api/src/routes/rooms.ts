import { Router } from "express";
import { z } from "zod";
import { query } from "../db.js";
import { requireAuth, type AuthenticatedRequest } from "../middleware/auth.js";

const router = Router();

router.get("/", requireAuth, async (req: AuthenticatedRequest,res) => {
  const rows = await query(
    `select r.id,r.room_type,r.title,r.created_at
     from chat_rooms r join chat_participants cp on cp.room_id=r.id
     where cp.user_id=$1 order by r.created_at desc`, [req.userId]);
  res.json(rows);
});

router.post("/", requireAuth, async (req: AuthenticatedRequest,res) => {
  const input=z.object({roomType:z.enum(["DIRECT","GROUP","COMMUNITY","CHANNEL"]),title:z.string().max(120).optional(),participantIds:z.array(z.string().uuid()).max(500).default([])}).parse(req.body);
  const rows=await query<{id:string}>("insert into chat_rooms(room_type,title,created_by) values($1,$2,$3) returning id",[input.roomType,input.title??null,req.userId]);
  const roomId=rows[0].id;
  const ids=[req.userId!,...input.participantIds.filter(id=>id!==req.userId)];
  for (const id of ids) await query("insert into chat_participants(room_id,user_id) values($1,$2) on conflict do nothing",[roomId,id]);
  res.status(201).json({id:roomId});
});

export default router;
