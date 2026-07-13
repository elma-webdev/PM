import { Router } from "express";
import { createTriagem, getTriagem } from "../controller/triagem/triagem.js";
import { permission_Level2 } from "../middleware/permission.js";
import { Auth } from "../middleware/Auth.js";

const triagemRouter = Router();
triagemRouter.use(Auth);
triagemRouter.post("/triagem", createTriagem);
triagemRouter.get("/triagem/",getTriagem);

export { triagemRouter };
