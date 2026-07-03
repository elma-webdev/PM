import  multer  from 'multer';
import {createPaciente,getPacientes, getPacientesById } from "../controller/users/paciente.js";
import { Router} from "express";
import {permission_Level1, permission_Level2 } from "../middleware/permission.js";
import { Auth } from "../middleware/Auth.js";


const upload = multer({ storage: multer.memoryStorage() });
const pacienteRouter=Router();
pacienteRouter.post('/paciente', upload.single('photo'), createPaciente);

pacienteRouter.get("/paciente",Auth, getPacientes); 

pacienteRouter.get("/paciente/:id", Auth, getPacientesById);



export {pacienteRouter};