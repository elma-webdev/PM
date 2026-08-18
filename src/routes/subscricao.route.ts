import { Router } from "express";
import { CreateSubscricao, CancelSubscricao, EnableSubscricao, Subscricao} from "../controller/subscricao/subscricao.js";
import { Auth } from "../middleware/Auth.js";
const subscripRouter = Router();


subscripRouter.post("/subscricao", Auth, CreateSubscricao);
subscripRouter.get("/subscricao", Auth, Subscricao);
subscripRouter.post("/subscricao/:subsc_id/enable", Auth, EnableSubscricao);
subscripRouter.post("/subscricao/:subsc_id/cancel", Auth, CancelSubscricao);
export { subscripRouter };