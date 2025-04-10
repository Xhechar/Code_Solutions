"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const verify_tokens_1 = require("../middlewares/verify.tokens");
const user_service_1 = require("../services/user.service");
const body_input_validators_1 = require("../validators/body.input.validators");
const userService = new user_service_1.UserService();
class UserController {
    async createUser(req, res) {
        try {
            let { error } = body_input_validators_1.UserRegisterationSchema.validate(req.body);
            if (error) {
                res.status(400).json({
                    'error': error.message
                });
            }
            ;
            res.status(201).json(await userService.createUser(req.body));
        }
        catch (error) {
            res.status(501).json({
                'error': error
            });
        }
    }
    async updateUser(req, res) {
        try {
            let { error } = body_input_validators_1.UserUpdateSchema.validate(req.body);
            if (error) {
                res.status(400).json({
                    'error': error.message
                });
            }
            ;
            res.status(201).json(await userService.updateUser((0, verify_tokens_1.getIdFromToken)(req), req.body));
        }
        catch (error) {
            res.status(501).json({
                'error': error
            });
        }
    }
    async updateProfileImage(req, res) {
        try {
            res.status(201).json(await userService.updateProfileImage((0, verify_tokens_1.getIdFromToken)(req), req.body.ProfilePhoto));
        }
        catch (error) {
            res.status(501).json({
                'error': error
            });
        }
    }
    async softDeleteUser(req, res) {
        try {
            res.status(201).json(await userService.softDeleteUser(req.params.UserId));
        }
        catch (error) {
            res.status(501).json({
                'error': error
            });
        }
    }
    async deleteUser(req, res) {
        try {
            res.status(201).json(await userService.deleteUser(req.params.UserId));
        }
        catch (error) {
            res.status(501).json({
                'error': error
            });
        }
    }
    async restoreUser(req, res) {
        try {
            res.status(201).json(await userService.restoreUser(req.params.UserId));
        }
        catch (error) {
            res.status(501).json({
                'error': error
            });
        }
    }
    async getSingleUser(req, res) {
        try {
            res.status(201).json(await userService.getSingleUser((0, verify_tokens_1.getIdFromToken)(req)));
        }
        catch (error) {
            res.status(501).json({
                'error': error
            });
        }
    }
    async getAllUsers(req, res) {
        try {
            res.status(201).json(await userService.getAllUsers());
        }
        catch (error) {
            res.status(501).json({
                'error': error
            });
        }
    }
    async getSoftDeletedUsers(req, res) {
        try {
            res.status(201).json(await userService.getSoftDeletedUsers());
        }
        catch (error) {
            res.status(501).json({
                'error': error
            });
        }
    }
    async updateUserRole(req, res) {
        try {
            res.status(201).json(await userService.updateUserRole(req.params.UserId));
        }
        catch (error) {
            res.status(501).json({
                'error': error
            });
        }
    }
    async bulkDeleteUsers(req, res) {
        try {
            res.status(201).json(await userService.bulkDeleteUsers(req.body.UserIds));
        }
        catch (error) {
            res.status(501).json({
                'error': error
            });
        }
    }
}
exports.UserController = UserController;
