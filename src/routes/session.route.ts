import { Router } from "express";
import { Auth } from "../middleware/Auth.js";
import {permission_Level1, permission_Level2} from "../middleware/permission.js";
import { criarSessao, visualizarSessoesPorData } from "../controller/sessao/sessoes.ts";

const sessionRouter = Router();

sessionRouter.post('/sessoes', criarSessao);

sessionRouter.get('/sessoes', visualizarSessoesPorData);

//Buscar por um dia específico (GET /sessoes?data=2026-06-10):

//Buscar por intervalo de datas (GET /sessoes?inicio=2026-06-01&fim=2026-06-30):

//Buscar filtrando por data e status (GET /sessoes?data=2026-06-10&status=AGENDADA):

export { sessionRouter };
