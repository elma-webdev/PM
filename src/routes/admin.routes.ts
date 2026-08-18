import { Router } from "express";
import { createAdmin } from "../controller/users/admin.js";
import {ApenasAdmin} from "../controller/logActividade/teste.js";
import { Auth } from "../middleware/Auth.js";
import { getAllUsers } from "../controller/dashboard/users.js";
import { AcceptPsichologist, RejectPsichologist } from "../controller/gestao_app/AcceptUser.js";
import { getPsichologistRequest } from "../controller/gestao_app/ResquestUser.js";
import {
  CreateNotification,
  UnreadNotification,
  ReadNotification,
} from "../controller/notificacoes/norification.js";
const adminRouter = Router();

adminRouter.post("/admin", createAdmin)
adminRouter.get("/dashboard/users", getAllUsers)
adminRouter.get("/apenasAdmin", Auth, ApenasAdmin)


adminRouter.get("/notification/:user_id/unread", Auth, UnreadNotification)
adminRouter.patch("/notification/:user_id/read", Auth, ReadNotification)
adminRouter.post("/notification/:user_id", Auth, CreateNotification)


adminRouter.patch("/psicologo/:user_id/accept", Auth, AcceptPsichologist )
adminRouter.patch("/psicologo/:user_id/reject", Auth, RejectPsichologist )
adminRouter.get("/psicologo/requests", Auth, getPsichologistRequest)

export {adminRouter};