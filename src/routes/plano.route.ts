import { Router } from "express";
import { Auth } from "../middleware/Auth.js";
const planoRouter = Router();

import {
    createPlano,
    getPlanos,
    getPlanoById,
    updatePlano,
    deletePlano,
} from "../controller/plano/plano.js";

planoRouter.post("/plano", Auth, createPlano);
planoRouter.get("/plano", Auth, getPlanos);
planoRouter.get("/plano/:id", Auth, getPlanoById);
planoRouter.put("/plano/:id", Auth, updatePlano);
planoRouter.delete("/plano/:id", Auth, deletePlano);


export { planoRouter };
