"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProblemController = exports.problemService = void 0;
const verify_tokens_1 = require("../middlewares/verify.tokens");
const problem_service_1 = require("../services/problem.service");
exports.problemService = new problem_service_1.ProblemService();
class ProblemController {
    async createProblem(req, res) {
        try {
            res.status(201).json(await exports.problemService.createProblem((0, verify_tokens_1.getIdFromToken)(req), req.body));
        }
        catch (error) {
            res.status(501).json({
                'error': error
            });
        }
    }
    async updateProblem(req, res) {
        try {
            res.status(201).json(await exports.problemService.updateProblem((0, verify_tokens_1.getIdFromToken)(req), req.params.ProblemId, req.body));
        }
        catch (error) {
            res.status(501).json({
                'error': error
            });
        }
    }
    async approveProblem(req, res) {
        try {
            res.status(201).json(await exports.problemService.approveProblem((0, verify_tokens_1.getIdFromToken)(req), req.params.ProblemId));
        }
        catch (error) {
            res.status(501).json({
                'error': error
            });
        }
    }
    async deleteProblem(req, res) {
        try {
            res.status(201).json(await exports.problemService.deleteProblem((0, verify_tokens_1.getIdFromToken)(req), req.params.ProblemId));
        }
        catch (error) {
            res.status(501).json({
                'error': error
            });
        }
    }
    async getUserProblems(req, res) {
        try {
            res.status(201).json(await exports.problemService.getUserProblems((0, verify_tokens_1.getIdFromToken)(req)));
        }
        catch (error) {
            res.status(501).json({
                'error': error
            });
        }
    }
    async getAllProblems(req, res) {
        try {
            res.status(201).json(await exports.problemService.getAllProblems());
        }
        catch (error) {
            res.status(501).json({
                'error': error
            });
        }
    }
    async getAdminProblems(req, res) {
        try {
            res.status(201).json(await exports.problemService.getAdminProblems((0, verify_tokens_1.getIdFromToken)(req)));
        }
        catch (error) {
            res.status(501).json({
                'error': error
            });
        }
    }
    async getApprovedProblems(req, res) {
        try {
            res.status(201).json(await exports.problemService.getApprovedProblems());
        }
        catch (error) {
            res.status(501).json({
                'error': error
            });
        }
    }
    async getSingleProblem(req, res) {
        try {
            res.status(201).json(await exports.problemService.getSingleProblem(req.params.ProblemId));
        }
        catch (error) {
            res.status(501).json({
                'error': error
            });
        }
    }
}
exports.ProblemController = ProblemController;
