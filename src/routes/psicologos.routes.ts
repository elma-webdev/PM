import { Router } from "express";
import * as PsicologoController from "../controller/users/psicologo.js";
import { Auth } from "../middleware/Auth.js";
const psyRouter = Router();

import multer from "multer";
const upload = multer({ storage:multer.memoryStorage() });

psyRouter.get("/users", (req, res) => {
  console.log("Rota /api/users chamada!");
  res.send("ok");
});
psyRouter.post("/psicologo", upload.single('photo'), PsicologoController.createPsicologo);


psyRouter.get(
  "/psicologo",
  Auth,
  PsicologoController.getPsicologos
);

psyRouter.get(
  "/psicologo/:id",
  Auth,
  PsicologoController.getPsicologoById
);
psyRouter.put(
  "/psicologo/:id",
  Auth,
  PsicologoController.updatePsicologo
);
psyRouter.delete(
  "/psicologo/:id",
  Auth,
  PsicologoController.deletePsicologo
);
export { psyRouter };
