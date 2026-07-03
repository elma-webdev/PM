import { Router } from "express";
import { createAdmin } from "../controller/users/admin.js";

const adminRouter = Router();

adminRouter.post("/admin", createAdmin)

export {adminRouter};