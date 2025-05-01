"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StackController = void 0;
const stack_service_1 = require("../services/stack.service");
const stackService = new stack_service_1.StackService();
class StackController {
    async createStack(req, res) {
        try {
            res.status(201).json(await stackService.createStack(req.body));
        }
        catch (error) {
            res.status(501).json({
                'error': error
            });
        }
    }
    async updateStack(req, res) {
        try {
            res.status(201).json(await stackService.updateStack(req.params.StackId, req.body));
        }
        catch (error) {
            res.status(501).json({
                'error': error
            });
        }
    }
    async deleteStack(req, res) {
        try {
            res.status(201).json(await stackService.deleteStack(req.params.StackId));
        }
        catch (error) {
            res.status(501).json({
                'error': error
            });
        }
    }
    async getAllStacks(req, res) {
        try {
            res.status(201).json(await stackService.getAllStacks());
        }
        catch (error) {
            res.status(501).json({
                'error': error
            });
        }
    }
    async getSingleStack(req, res) {
        try {
            res.status(201).json(await stackService.getSingleStack(req.params.StackId));
        }
        catch (error) {
            res.status(501).json({
                'error': error
            });
        }
    }
}
exports.StackController = StackController;
