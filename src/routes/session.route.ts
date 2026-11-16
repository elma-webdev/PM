import { Router } from "express";
import {AgendarSessao, MarcarSessaoInstantanea} from "../controller/pareamento/pareamento.js";
import { Auth } from "../middleware/Auth.js";
import {permission_Level1, permission_Level2} from "../middleware/permission.js";
import { criarSessao, visualizarSessoesPorData } from "../controller/agendamento/sessoes.ts";

const sessionRouter = Router();

sessionRouter.post('/sessoes', criarSessao);

// Rota para visualizar sessões por data
sessionRouter.get('/sessoes', visualizarSessoesPorData);

//Criar Sessão (POST /sessoes):


//Buscar por um dia específico (GET /sessoes?data=2026-06-10):

//Buscar por intervalo de datas (GET /sessoes?inicio=2026-06-01&fim=2026-06-30):

//Buscar filtrando por data e status (GET /sessoes?data=2026-06-10&status=AGENDADA):

export { sessionRouter };
