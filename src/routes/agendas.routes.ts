import {Router} from "express"
import { createAgenda, getAgenda } from "../agenda/agenda"
const agendaRouter=Router()


agendaRouter.post("/create-agenda", createAgenda);
agendaRouter.get('/get-agenda', getAgenda)

export {agendaRouter}