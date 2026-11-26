import {Router} from "express"
import { permissionBoth } from "../middleware/permission.js";
import { Auth } from "../middleware/Auth.js";
import { criarAgendamento } from "../controller/agendamento/agendamento.ts";
import { filtrarAgendamentoPorEstado, filtrarAgendamentoPorNomePsicologo, filtrarAgendamentoPorPsicologoId } from "../controller/agendamento/filtro_agenda.ts";
const agendaRouter=Router()

// Criar agendamento
agendaRouter.post("/agendamento", Auth, criarAgendamento);

// Filtrar por estado?estado=CONFIRMADO
agendaRouter.get("agendamentos/estado", Auth, filtrarAgendamentoPorEstado);

// Filtrar pelo nome do psicólogo?nome=Manuel
agendaRouter.get("agendamentos/psicologo", Auth, filtrarAgendamentoPorNomePsicologo);

// Filtrar pelo ID do psicólogo
agendaRouter.get("/agendamentos/psicologo/:psicologo_id", Auth, filtrarAgendamentoPorPsicologoId);
export {agendaRouter}