import { Router } from "express";
import {loginUser, logoutUser} from "../authentication/auth.js"
import {Auth} from "../middleware/Auth.js"
import { deslogarPsicologo, logarPsicologo } from "../../utils/function.udateStatus_psic.js";
import { RefreshToken } from "../authentication/refresh_token.js";
import { resetPassword } from "../authentication/reset-password.js";
import { forgotPassword } from "../authentication/require-password.js";

const loginRouter = Router();


loginRouter.post("/login", loginUser);
loginRouter.post("/refresh", RefreshToken);
loginRouter.post("/reset-password", resetPassword);
loginRouter.post("/forgot-password",forgotPassword)

loginRouter.get("/logout", Auth, deslogarPsicologo, logoutUser);

export { loginRouter };