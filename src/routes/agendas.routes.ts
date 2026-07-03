import {Router} from "express"
import { createAgenda, getAgenda } from "../controller/agenda/agenda.js";
import { permissionBoth } from "../middleware/permission.js";
import { Auth } from "../middleware/Auth.js";
const agendaRouter=Router()

agendaRouter.post("/agenda", createAgenda);
agendaRouter.get('/agenda/', Auth,getAgenda)

export {agendaRouter}