import { Router } from "express";
import {AgendarSessao, MarcarSessaoInstantanea} from "../controller/pareamento/pareamento.js";
import { Auth } from "../middleware/Auth.js";
import {permission_Level1, permission_Level2} from "../middleware/permission.js";
import {
  AcceptSessoes,
  PaySessao,
  DenySessao,
  FinishSessao,
  SessaoRequestByPsicologo,
  SessaoPaid,
  GetAllPsicologoSessaoRequestAccepted,
  GetAllPacienteSessaoRequestAccepted,
  SessaoRequestByPaciente,
} from "../controller/pareamento/searcnInDB.js";
import { getVinculo } from "../controller/pareamento/vinculo.js";


const sessionRouter = Router();

sessionRouter.get("/vinculo/:psicologo_id", Auth, getVinculo);
sessionRouter.post(
  "/sessao/:psicologo_id/instantanea",
  Auth,
  MarcarSessaoInstantanea,
);
sessionRouter.post("/sessao/:psicologo_id/agendar/:modo", Auth, AgendarSessao);
sessionRouter.post("/sessao/accept", Auth, AcceptSessoes);
sessionRouter.patch("/sessao/reject", Auth, DenySessao);
sessionRouter.patch("/sessao/concluded", Auth, FinishSessao);
sessionRouter.post("/sessao/:sessao_id/confirm-payment", Auth, PaySessao);
sessionRouter.get("/sessao/:psicologo_id/pedidos", Auth, SessaoRequestByPsicologo);
sessionRouter.get("/sessao/paciente/:paciente_id/pedidos", Auth, SessaoRequestByPaciente);
sessionRouter.get("/sessao/:psicologo_id/pedidos/accepted", Auth, GetAllPsicologoSessaoRequestAccepted);
sessionRouter.get(
  "/sessao/paciente/:paciente_id/pedidos/accepted",
  Auth,
  GetAllPacienteSessaoRequestAccepted,
);
// sessionRouter.get("/sessao/:psicologo_id/paid", Auth, SessaoPaid);

export { sessionRouter };
