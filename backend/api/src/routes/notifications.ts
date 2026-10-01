import { Router } from "express";
import { query } from "../db.js";
import { requireAuth, type AuthenticatedRequest } from "../middleware/auth.js";
const router=Router();
router.get("/",requireAuth,async(req:AuthenticatedRequest,res)=>res.json(await query("select id,kind,payload,read_at,created_at from notifications where user_id=$1 order by created_at desc limit 100",[req.userId])));
router.post("/:id/read",requireAuth,async(req:AuthenticatedRequest,res)=>{await query("update notifications set read_at=now() where id=$1 and user_id=$2",[req.params.id,req.userId]);res.status(204).send();});
export default router;
