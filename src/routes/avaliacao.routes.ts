import { Router } from "express";
import {
  createAvaliacao,
  getAvaliacoes,
  getAvaliacaoById,
  updateAvaliacao,
  deleteAvaliacao,
} from "../controller/avaliacoes/avaliacao.js";
import { permission_Level1, permission_Level2 } from "../middleware/permission.js";


const avaliacaoRouter = Router();


avaliacaoRouter.post("/rate",createAvaliacao);
avaliacaoRouter.get("/rate/",getAvaliacoes);
avaliacaoRouter.get("/rate/:id",getAvaliacaoById);
avaliacaoRouter.put("/rate/:id",updateAvaliacao);
avaliacaoRouter.delete("/rate/:id",deleteAvaliacao);

export { avaliacaoRouter };
