"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProblemController = void 0;
const verify_tokens_1 = require("../middlewares/verify.tokens");
const problem_service_1 = require("../services/problem.service");
const body_input_validators_1 = require("../validators/body.input.validators");
const problemService = new problem_service_1.ProblemService();
class ProblemController {
    async createProblem(req, res) {
        try {
            let { error } = body_input_validators_1.ProblemSchema.validate(req.body);
            if (error) {
                return res.status(401).json({
                    'error': error.message
                });
            }
            return res.status(201).json(await problemService.createProblem((0, verify_tokens_1.getIdFromToken)(req), req.body));
        }
        catch (error) {
            return res.status(501).json({
                'error': error
            });
        }
    }
    async updateProblem(req, res) {
        try {
            let { error } = body_input_validators_1.ProblemSchema.validate(req.body);
            if (error) {
                return res.status(401).json({
                    'error': error.message
                });
            }
            return res.status(201).json(await problemService.updateProblem((0, verify_tokens_1.getIdFromToken)(req), req.params.id, req.body));
        }
        catch (error) {
            return res.status(501).json({
                'error': error
            });
        }
    }
    async approveProblem(req, res) {
        try {
            return res.status(201).json(await problemService.approveProblem((0, verify_tokens_1.getIdFromToken)(req), req.params.ProblemId));
        }
        catch (error) {
            return res.status(501).json({
                'error': error
            });
        }
    }
    async deleteProblem(req, res) {
        try {
            return res.status(201).json(await problemService.deleteProblem((0, verify_tokens_1.getIdFromToken)(req), req.params.ProblemId));
        }
        catch (error) {
            return res.status(501).json({
                'error': error
            });
        }
    }
    async getUserProblems(req, res) {
        try {
            return res.status(201).json(await problemService.getUserProblems((0, verify_tokens_1.getIdFromToken)(req)));
        }
        catch (error) {
            return res.status(501).json({
                'error': error
            });
        }
    }
    async getAllProblems(req, res) {
        try {
            return res.status(201).json(await problemService.getAllProblems());
        }
        catch (error) {
            return res.status(501).json({
                'error': error
            });
        }
    }
    async getAdminProblems(req, res) {
        try {
            return res.status(201).json(await problemService.getAdminProblems((0, verify_tokens_1.getIdFromToken)(req)));
        }
        catch (error) {
            return res.status(501).json({
                'error': error
            });
        }
    }
    async getApprovedProblems(req, res) {
        try {
            return res.status(201).json(await problemService.getApprovedProblems());
        }
        catch (error) {
            return res.status(501).json({
                'error': error
            });
        }
    }
    async getSingleProblem(req, res) {
        try {
            return res.status(201).json(await problemService.getSingleProblem(req.params.ProblemId));
        }
        catch (error) {
            return res.status(501).json({
                'error': error
            });
        }
    }
}
exports.ProblemController = ProblemController;
