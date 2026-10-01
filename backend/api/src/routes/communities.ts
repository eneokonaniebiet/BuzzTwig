import { Router } from "express";
import { z } from "zod";
import { query } from "../db.js";
import { requireAuth, type AuthenticatedRequest } from "../middleware/auth.js";
const router=Router();
router.get("/",requireAuth,async(_req,res)=>res.json(await query("select id,name,slug,description,visibility,created_at from communities where visibility='PUBLIC' order by created_at desc limit 100")));
router.post("/",requireAuth,async(req:AuthenticatedRequest,res)=>{const input=z.object({name:z.string().trim().min(2).max(100),slug:z.string().trim().min(2).max(80).regex(/^[a-z0-9-]+$/),description:z.string().max(1000).optional(),visibility:z.enum(["PUBLIC","PRIVATE"]).default("PUBLIC")}).parse(req.body);const rows=await query("insert into communities(owner_id,name,slug,description,visibility) values($1,$2,$3,$4,$5) returning *",[req.userId,input.name,input.slug,input.description??null,input.visibility]);await query("insert into community_members(community_id,user_id,role) values($1,$2,'OWNER')",[rows[0].id,req.userId]);res.status(201).json(rows[0]);});
router.post("/:id/join",requireAuth,async(req:AuthenticatedRequest,res)=>{await query("insert into community_members(community_id,user_id) values($1,$2) on conflict do nothing",[req.params.id,req.userId]);res.status(204).send();});
export default router;
