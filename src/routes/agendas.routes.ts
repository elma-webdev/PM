import {Router} from "express"
import { permissionBoth } from "../middleware/permission.js";
import { Auth } from "../middleware/Auth.js";
import { criarAgendamento } from "../controller/agendamento/agendamento.ts";
import { filtrarAgendamentoPorEstado, filtrarAgendamentoPorNomePsicologo, filtrarAgendamentoPorPsicologoId } from "../controller/agendamento/filtro_agenda.ts";
const agendaRouter=Router()

// Criar agendamento
agendaRouter.post("/agendamento", criarAgendamento);

// Filtrar por estado
agendaRouter.get("agendamentos/estado?estado=CONFIRMADO", filtrarAgendamentoPorEstado);

// Filtrar pelo nome do psicólogo
agendaRouter.get("agendamentos/psicologo?nome=Manuel", filtrarAgendamentoPorNomePsicologo);

// Filtrar pelo ID do psicólogo
agendaRouter.get("/agendamentos/psicologo/:psicologo_id", filtrarAgendamentoPorPsicologoId);
export {agendaRouter}