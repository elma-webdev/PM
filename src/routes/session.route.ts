import { Router } from "express";
import {AgendarSessao, MarcarSessaoInstantanea} from "../controller/pareamento/pareamento.js";
import { Auth } from "../middleware/Auth.js";
import {permission_Level1, permission_Level2} from "../middleware/permission.js";
import { AcceptSessoes, PagarSessao,DenySessao, FinishSessao, SessaoByPsicologo } from "../controller/pareamento/searcnInDB.js";


const sessionRouter = Router();

sessionRouter.post("/sessao/instantanea", Auth, MarcarSessaoInstantanea);
sessionRouter.post("/sessao/agendar", Auth, AgendarSessao);
sessionRouter.patch("/sessao/accept", Auth, AcceptSessoes);
sessionRouter.patch("/sessao/reject", Auth, DenySessao);
sessionRouter.patch("/sessao/concluded", Auth, FinishSessao);
sessionRouter.post("/sessao/:psicologo_id/payment", Auth, PagarSessao);
sessionRouter.get("/sessao/:psicologo_id", Auth, SessaoByPsicologo);

export { sessionRouter };
