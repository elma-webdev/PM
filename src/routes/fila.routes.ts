import { Router } from "express";
import { createFila, getFila, getMyposition } from "../controller/fila/fila.js";
import { permission_Level2 } from "../middleware/permission.js";
import { Auth } from "../middleware/Auth.js";

const filaRouter = Router();
filaRouter.use(Auth)
filaRouter.get("/fila/", getFila);
filaRouter.get("/fila/myP", getMyposition);

export {filaRouter}