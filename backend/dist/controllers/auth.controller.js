"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_1 = require("../services/auth.service");
const body_input_validators_1 = require("../validators/body.input.validators");
const authService = new auth_service_1.AuthService();
class AuthController {
    async loginUser(req, res) {
        try {
            let { error } = body_input_validators_1.LoginDetailsSchema.validate(req.body);
            if (error) {
                res.status(401).json({
                    'error': error.message
                });
            }
            else {
                let result = await authService.loginUser(req.body);
                res.status(201).json(result);
            }
        }
        catch (error) {
            res.status(501).json({
                error: error
            });
        }
    }
    async changePassword(req, res) {
        try {
            let { error } = body_input_validators_1.RecoveryDetailsSchema.validate(req.body);
            if (error) {
                return res.status(401).json({
                    'error': error.message
                });
            }
            ;
            let result = await authService.changePassword(req.body);
            return res.status(201).json(result);
        }
        catch (error) {
            return res.status(501).json({
                error: error
            });
        }
    }
    async getAllRecoveries(res) {
        try {
            return res.status(201).json(await authService.getAllRecoveries());
        }
        catch (error) {
            return res.status(501).json({
                error: error
            });
        }
    }
    async verifyMail(req, res) {
        try {
            return res.status(201).json(await authService.verifyMail(req.body.Email));
        }
        catch (error) {
            return res.status(501).json({
                error: error
            });
        }
    }
}
exports.AuthController = AuthController;
