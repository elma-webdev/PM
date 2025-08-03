import { Router } from "express";
import {loginPaciente, loginPsicologo} from "../authentication/auth"

const loginRouter = Router();

loginRouter.post("/login",loginPaciente);
loginRouter.post("/login-psyc",loginPsicologo);

export { loginRouter };