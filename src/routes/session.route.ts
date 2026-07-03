import { Router } from "express";
import ParearPacienteComPsicologo from "../controller/pareamento/pareamento";
import { Auth } from "../middleware/Auth";
import { permission_Level1, permission_Level2, } from "../middleware/permission";


const sessionRouter = Router();

sessionRouter.post("/pareamento",ParearPacienteComPsicologo);

export { sessionRouter };
