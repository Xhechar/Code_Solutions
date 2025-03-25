"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const verify_tokens_1 = require("../middlewares/verify.tokens");
exports.authRouter = (0, express_1.Router)();
const authController = new auth_controller_1.AuthController();
exports.authRouter.post('/login', async (req, res) => {
    await authController.loginUser(req, res);
});
exports.authRouter.post('/logout', async (req, res) => {
    await authController.logoutUser(req, res);
});
exports.authRouter.post('/change-password', authController.changePassword);
exports.authRouter.get('/recoveries', verify_tokens_1.verifyToken, verify_tokens_1.verifyAdmin, authController.getAllRecoveries);
exports.authRouter.put('/verify-email', authController.verifyMail);
