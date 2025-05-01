"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_1 = require("../services/auth.service");
const authService = new auth_service_1.AuthService();
class AuthController {
    async loginUser(req, res) {
        try {
            let result = await authService.loginUser(req.body);
            if (result.success) {
                res.cookie('token', result.token, {
                    httpOnly: true,
                    secure: false,
                    sameSite: 'strict',
                    maxAge: 45 * 60 * 1000,
                    signed: true
                });
                let { token, ...rest } = result;
                return res.status(201).json(rest);
            }
            return res.status(201).json(result);
        }
        catch (error) {
            return res.status(501).json({
                error: error
            });
        }
    }
    async logoutUser(req, res) {
        try {
            res.clearCookie('token', { signed: true });
            return res.status(201).json({
                'success': true,
                'message': 'Logout successfull. You are always welcomed.'
            });
        }
        catch (error) {
            return res.status(501).json({
                'error': error
            });
        }
    }
    async changePassword(req, res) {
        try {
            let result = await authService.changePassword(req.body);
            res.status(201).json(result);
        }
        catch (error) {
            res.status(501).json({
                error: error
            });
        }
    }
    async getAllRecoveries(res) {
        try {
            res.status(201).json(await authService.getAllRecoveries());
        }
        catch (error) {
            res.status(501).json({
                error: error
            });
        }
    }
    async verifyMail(req, res) {
        try {
            res.status(201).json(await authService.verifyMail(req.body.Email));
        }
        catch (error) {
            res.status(501).json({
                error: error
            });
        }
    }
}
exports.AuthController = AuthController;
