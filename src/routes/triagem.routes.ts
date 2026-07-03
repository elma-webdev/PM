import { Router } from "express";
import { createTriagem, getTriagem } from "../controller/triagem/triagem";
import { permission_Level2 } from "../middleware/permission";
import { Auth } from "../middleware/Auth";

const triagemRouter = Router();
triagemRouter.use(Auth);
triagemRouter.post("/triagem", createTriagem);
triagemRouter.get("/triagem/",getTriagem);

export { triagemRouter };
