"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StackController = void 0;
const stack_service_1 = require("../services/stack.service");
const body_input_validators_1 = require("../validators/body.input.validators");
const stackService = new stack_service_1.StackService();
class StackController {
    async createStack(req, res) {
        try {
            let { error } = body_input_validators_1.StackSchema.validate(req.body);
            if (error) {
                return res.status(400).json({
                    'error': error.message
                });
            }
            ;
            return res.status(201).json(await stackService.createStack(req.body));
        }
        catch (error) {
            return res.status(501).json({
                'error': error
            });
        }
    }
    async updateStack(req, res) {
        try {
            let { error } = body_input_validators_1.StackSchema.validate(req.body);
            if (error) {
                return res.status(400).json({
                    'error': error.message
                });
            }
            ;
            return res.status(201).json(await stackService.updateStack(req.params.StackId, req.body));
        }
        catch (error) {
            return res.status(501).json({
                'error': error
            });
        }
    }
    async deleteStack(req, res) {
        try {
            return res.status(201).json(await stackService.deleteStack(req.params.StackId));
        }
        catch (error) {
            return res.status(501).json({
                'error': error
            });
        }
    }
    async getAllStacks(req, res) {
        try {
            return res.status(201).json(await stackService.getAllStacks());
        }
        catch (error) {
            return res.status(501).json({
                'error': error
            });
        }
    }
    async getSingleStack(req, res) {
        try {
            return res.status(201).json(await stackService.getSingleStack(req.params.StackId));
        }
        catch (error) {
            return res.status(501).json({
                'error': error
            });
        }
    }
}
exports.StackController = StackController;
