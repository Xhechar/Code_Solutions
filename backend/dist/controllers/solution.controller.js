"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolutionController = void 0;
const verify_tokens_1 = require("../middlewares/verify.tokens");
const solution_service_1 = require("../services/solution.service");
const solutionService = new solution_service_1.SolutionService();
class SolutionController {
    async createSolution(req, res) {
        try {
            res.status(201).json(await solutionService.createSolution((0, verify_tokens_1.getIdFromToken)(req), req.params.ProblemId, req.body));
        }
        catch (error) {
            res.status(501).json({
                'error': error
            });
        }
    }
    async updateSolution(req, res) {
        try {
            res.status(201).json(await solutionService.updateSolution((0, verify_tokens_1.getIdFromToken)(req), req.params.SolutionId, req.body));
        }
        catch (error) {
            res.status(501).json({
                'error': error
            });
        }
    }
    async deleteSolution(req, res) {
        try {
            res.status(201).json(await solutionService.deleteSolution((0, verify_tokens_1.getIdFromToken)(req), req.params.SolutionId));
        }
        catch (error) {
            res.status(501).json({
                'error': error
            });
        }
    }
    async getAllSolutions(req, res) {
        try {
            res.status(201).json(await solutionService.getAllSolutions());
        }
        catch (error) {
            res.status(501).json({
                'error': error
            });
        }
    }
    async getSolutionsByProblem(req, res) {
        try {
            res.status(201).json(await solutionService.getSolutionsByProblem(req.params.ProblemId));
        }
        catch (error) {
            res.status(501).json({
                'error': error
            });
        }
    }
}
exports.SolutionController = SolutionController;
