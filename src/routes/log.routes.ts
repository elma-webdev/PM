import {Router} from "express"; 
import {tipoLogs, getLogs} from "../controller/logActividade/logs";

const logRouter=Router();

logRouter.get("/get-logs", getLogs);
logRouter.get("/get-log", tipoLogs);

export {logRouter};