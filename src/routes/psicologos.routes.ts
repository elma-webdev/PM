import { Router } from "express";
import {
  createPsicologo,
  getPsicologos,
  getPsicologoById,
  updatePsicologo,
  deletePsicologo,
} from "../controller/users/psicologo";

const psyRouter = Router();

psyRouter.post("/create-psyc", createPsicologo);
psyRouter.get("/get-psyc", getPsicologos);
psyRouter.get("/get-psyc/:id", getPsicologoById);
psyRouter.put("/update-psyc/:id", updatePsicologo);
psyRouter.delete("/delete-psyc/:id", deletePsicologo);

export {psyRouter};
