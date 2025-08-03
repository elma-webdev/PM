import { Router } from "express";
import { createFila, getFila } from "../controller/fila/fila";

const filaRouter = Router();

filaRouter.post('/create-fila', createFila )
filaRouter.get('/get-fila', getFila )

export {filaRouter}