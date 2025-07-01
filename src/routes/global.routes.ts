import  {userRouter} from "./users.routes";
import { Router} from "express";
import { psyRouter } from "./psicologos.routes";
import { avaliacaoRouter } from "./avaliacao.routes";
import { logRouter } from "./log.routes";

const globalRouter=Router();

globalRouter.use('/users', userRouter);
globalRouter.use("/psyc", psyRouter);
globalRouter.use("/rate", avaliacaoRouter);
globalRouter.use("/log", logRouter); 

export {globalRouter};