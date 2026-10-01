import { Router } from "express";
import { z } from "zod";
import { query } from "../db.js";
import { requireAuth, type AuthenticatedRequest } from "../middleware/auth.js";

const router=Router();
router.get("/:roomId",requireAuth,async(req:AuthenticatedRequest,res)=>{
  const roomId=z.string().uuid().parse(req.params.roomId);
  const allowed=await query("select 1 from chat_participants where room_id=$1 and user_id=$2",[roomId,req.userId]);
  if(!allowed.length)return res.status(403).json({error:"NOT_A_PARTICIPANT"});
  const limit=Math.min(Number(req.query.limit)||50,100);
  const rows=await query("select id,sender_id,encrypted_payload,content_type,client_message_id,ephemeral,burn_duration_seconds,created_at from messages where room_id=$1 order by created_at desc limit $2",[roomId,limit]);
  res.json(rows.reverse());
});
router.post("/:roomId",requireAuth,async(req:AuthenticatedRequest,res)=>{
  const roomId=z.string().uuid().parse(req.params.roomId);
  const input=z.object({clientMessageId:z.string().min(1).max(128),encryptedPayload:z.string().min(1).max(500000),contentType:z.string().max(32).default("TEXT"),ephemeral:z.boolean().default(false),burnDurationSeconds:z.number().int().positive().max(604800).optional()}).parse(req.body);
  const allowed=await query("select 1 from chat_participants where room_id=$1 and user_id=$2",[roomId,req.userId]);
  if(!allowed.length)return res.status(403).json({error:"NOT_A_PARTICIPANT"});
  const rows=await query("insert into messages(room_id,sender_id,encrypted_payload,content_type,client_message_id,ephemeral,burn_duration_seconds) values($1,$2,$3,$4,$5,$6,$7) on conflict(sender_id,client_message_id) do update set client_message_id=excluded.client_message_id returning id,sender_id,encrypted_payload,content_type,client_message_id,ephemeral,burn_duration_seconds,created_at",[roomId,req.userId,input.encryptedPayload,input.contentType,input.clientMessageId,input.ephemeral,input.burnDurationSeconds??null]);
  res.status(201).json(rows[0]);
});
export default router;
