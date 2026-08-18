import {Router} from "express"; 
import {getLogPage } from "../controller/logActividade/logs.js";
import { permission_Level1 } from "../middleware/permission.js";

const logRouter=Router();

// logRouter.use(permission_Level1);
logRouter.get("/log", getLogPage);

export {logRouter};