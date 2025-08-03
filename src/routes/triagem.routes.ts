import { Router } from "express";
import { createTriagem, getTriagem } from "../controller/triagem/triagem";

const triagemRouter = Router();

triagemRouter.post('/create-triagem', createTriagem )
triagemRouter.get('/get-triagem', getTriagem )


export { triagemRouter };