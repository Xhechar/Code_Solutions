import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { verifyAdmin, verifyToken } from "../middlewares/verify.tokens";

export const authRouter = Router();

const authController = new AuthController();

authRouter.post('/login', async (req, res) => {
  await authController.loginUser(req, res)});
authRouter.post('/logout', async (req, res) => {
  await authController.logoutUser(req, res)});
authRouter.post('/change-password', authController.changePassword);
authRouter.get('/recoveries', verifyToken, verifyAdmin, authController.getAllRecoveries);
authRouter.put('/verify-email', authController.verifyMail);
