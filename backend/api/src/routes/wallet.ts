import { Router } from "express";
import { query } from "../db.js";
import { requireAuth, type AuthenticatedRequest } from "../middleware/auth.js";
const router=Router();
router.get("/me",requireAuth,async(req:AuthenticatedRequest,res)=>{const rows=await query("select id,currency,balance_minor,updated_at from wallet_accounts where user_id=$1",[req.userId]);if(!rows.length){const created=await query("insert into wallet_accounts(user_id) values($1) returning id,currency,balance_minor,updated_at",[req.userId]);return res.json(created[0]);}res.json(rows[0]);});
router.get("/ledger",requireAuth,async(req:AuthenticatedRequest,res)=>{const rows=await query("select l.* from wallet_ledger_entries l join wallet_accounts w on w.id=l.wallet_id where w.user_id=$1 order by l.created_at desc limit 100",[req.userId]);res.json(rows);});
export default router;
