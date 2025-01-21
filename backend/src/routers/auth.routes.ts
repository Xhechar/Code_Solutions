import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { verifyAdmin } from "../middlewares/verify.tokens";

export const authRouter = Router();

const authController = new AuthController();

authRouter.post('/login', authController.loginUser);
authRouter.post('/change-password', authController.changePassword);
authRouter.get('/recoveries', verifyAdmin, authController.getAllRecoveries);
authRouter.put('/verify-email', authController.verifyMail);
