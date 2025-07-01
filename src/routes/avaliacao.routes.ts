import { Router } from "express";
import {
  createAvaliacao,
  getAvaliacoes,
  getAvaliacaoById,
  updateAvaliacao,
  deleteAvaliacao,
} from "../controller/avaliacoes/avaliacao";

const avaliacaoRouter = Router();

avaliacaoRouter.post("/create-rate", createAvaliacao);
avaliacaoRouter.get("/get-rate", getAvaliacoes);
avaliacaoRouter.get("/get-rate/:id", getAvaliacaoById);
avaliacaoRouter.put("/update-rate/:id", updateAvaliacao);
avaliacaoRouter.delete("/delete-rate/:id", deleteAvaliacao);

export { avaliacaoRouter };
