import express from "express";
const app=express();
app.disable("x-powered-by");
app.use(express.json({limit:"1mb"}));
app.get("/health",(_req,res)=>res.json({service:"buzztwig-api",status:"ok"}));
app.get("/v1/health",(_req,res)=>res.json({service:"buzztwig-api",status:"ok",version:"v1"}));
const port=Number(process.env.PORT??3000);
if(process.env.NODE_ENV!=="test") app.listen(port,()=>console.log(`BuzzTwig API listening on ${port}`));
export {app};
