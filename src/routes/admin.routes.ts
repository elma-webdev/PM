import { Router } from "express";
import { createAdmin } from "../controller/users/admin.js";
import {ApenasAdmin, CreateNotification, UnreadNotification} from "../controller/logActividade/teste.js";
import { Auth } from "../middleware/Auth.js";
import { getAllUsers } from "../controller/dashboard/users.js";
const adminRouter = Router();

adminRouter.post("/admin", createAdmin)
adminRouter.get("/dashboard/users", getAllUsers)
adminRouter.get("/apenasAdmin", Auth, ApenasAdmin)
adminRouter.get("/notification/unread", Auth, UnreadNotification)
adminRouter.post("/apenasPaciente", Auth, CreateNotification)

export {adminRouter};