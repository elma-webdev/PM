import {pacienteRouter} from "./paciente.routes.js";
import { Router} from "express";
import { avaliacaoRouter } from "./avaliacao.routes.js";
import { logRouter } from "./log.routes.js";
import { triagemRouter } from "./triagem.routes.js";
import { filaRouter } from "./fila.routes.js";
import { loginRouter } from "./auth.routes.js";
import { agendaRouter } from "./agendas.routes.js";
import { sessionRouter } from "./session.route.js";
import { postRouter } from "./post.routes.js";
import { adminRouter } from "./admin.routes.js";
import { psyRouter } from "./psicologos.routes.js";

const globalRouter=Router();

globalRouter.use(adminRouter);
globalRouter.use(loginRouter);
globalRouter.use(agendaRouter);
globalRouter.use(postRouter);
globalRouter.use(pacienteRouter);
globalRouter.use(psyRouter);
globalRouter.use(avaliacaoRouter);
globalRouter.use(logRouter); 
globalRouter.use(triagemRouter); 
globalRouter.use(filaRouter);
globalRouter.use(sessionRouter);

export {globalRouter};