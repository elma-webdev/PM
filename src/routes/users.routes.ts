import {createPaciente, createAnonimo,getPacientes} from "../controller/users/users";
import { Router} from "express";


const userRouter=Router();

userRouter.post('/create-paciente', createPaciente);
userRouter.get('/get-paciente', getPacientes);
userRouter.post('/user', createAnonimo);


export {userRouter};