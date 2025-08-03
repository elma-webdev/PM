import  {userRouter} from "./users.routes";
import { Router} from "express";
import { psyRouter } from "./psicologos.routes";
import { avaliacaoRouter } from "./avaliacao.routes";
import { logRouter } from "./log.routes";
import { triagemRouter } from "./triagem.routes";
import { filaRouter } from "./fila.routes";
import { loginRouter } from "./auth.routes";
import { agendaRouter } from "./agendas.routes";


const globalRouter=Router();

globalRouter.use('/users', userRouter);
globalRouter.use("/psyc", psyRouter);
globalRouter.use("/rate", avaliacaoRouter);
globalRouter.use("/log", logRouter); 
globalRouter.use("/triagem", triagemRouter); 
globalRouter.use("/auth", loginRouter);
globalRouter.use("/fila", filaRouter);
globalRouter.use("/agenda", agendaRouter);

export {globalRouter};