"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolutionService = void 0;
const client_1 = require("@prisma/client");
const uuid_1 = require("uuid");
const body_input_validators_1 = require("../validators/body.input.validators");
class SolutionService {
    prisma = new client_1.PrismaClient({
        log: ["error"]
    });
    async createSolution(userId, problemId, solution) {
        let { error } = body_input_validators_1.SolutionSchema.validate(solution);
        if (error) {
            return ({
                'success': false,
                'error': error.details[0].message
            });
        }
        ;
        let userExists = await this.prisma.user.findUnique({
            where: {
                UserId: userId
            }
        });
        if (userExists == null) {
            return {
                'success': false,
                'error': 'User not found.'
            };
        }
        if (userExists.IsDeleted) {
            return {
                'success': false,
                'error': 'Sorry, the user account has been deactivated.'
            };
        }
        let problemExists = await this.prisma.problem.findUnique({
            where: {
                ProblemId: problemId,
                UserId: userId
            }
        });
        if (problemExists == null) {
            return {
                'success': false,
                'error': 'You do not have permission to create solution for this problem.'
            };
        }
        let create = await this.prisma.solution.create({
            data: {
                SolutionId: (0, uuid_1.v4)(),
                Description: solution.Description,
                Steps: solution.Steps,
                CodeSamples: solution.CodeSamples,
                ImagePath: solution.ImagePath,
                VideoLink: solution.VideoLink,
                ProblemId: problemId,
                UserId: userId
            }
        });
        if (create == null) {
            return {
                'success': false,
                'error': 'Failed to create solution.'
            };
        }
        else {
            return {
                'success': true,
                'message': 'Solution created successfully.'
            };
        }
    }
    async updateSolution(UserId, SolutionId, solution) {
        let { error } = body_input_validators_1.SolutionSchema.validate(solution);
        if (error) {
            return ({
                'success': false,
                'error': error.details[0].message
            });
        }
        ;
        let userExists = await this.prisma.user.findUnique({
            where: {
                UserId
            }
        });
        if (userExists == null) {
            return {
                'success': false,
                'error': 'User not found.'
            };
        }
        if (userExists.IsDeleted) {
            return {
                'success': false,
                'error': 'Sorry, the user account has been deactivated.'
            };
        }
        let solutionExists = await this.prisma.solution.findUnique({
            where: {
                SolutionId: SolutionId,
                UserId
            }
        });
        if (solutionExists == null) {
            return {
                'success': false,
                'error': 'Solution not found.'
            };
        }
        if (userExists.Role == 'user' && solutionExists.IsApproved) {
            return {
                'success': false,
                'error': 'You cannot update an approved solution.'
            };
        }
        let update = await this.prisma.solution.update({
            where: {
                SolutionId: SolutionId,
                UserId
            },
            data: {
                Description: solution.Description ?? solutionExists.Description,
                Steps: solution.Steps ?? solutionExists.Steps,
                CodeSamples: solution.CodeSamples ?? solutionExists.CodeSamples,
                ImagePath: solution.ImagePath ?? solutionExists.ImagePath,
                VideoLink: solution.VideoLink ?? solutionExists.VideoLink,
                UpdatedAt: new Date()
            }
        });
        if (update == null) {
            return {
                'success': false,
                'error': 'Failed to update solution.'
            };
        }
        else {
            return {
                'success': true,
                'message': 'Solution updated successfully.'
            };
        }
    }
    async deleteSolution(UserId, SolutionId) {
        let userExists = await this.prisma.user.findUnique({
            where: {
                UserId
            }
        });
        if (userExists == null) {
            return {
                'success': false,
                'error': 'User not found.'
            };
        }
        if (userExists.IsDeleted) {
            return {
                'success': false,
                'error': 'Sorry, the user account has been deactivated.'
            };
        }
        let solutionExists = await this.prisma.solution.findUnique({
            where: {
                SolutionId: SolutionId,
                UserId
            }
        });
        if (solutionExists == null) {
            return {
                'success': false,
                'error': 'Solution not found.'
            };
        }
        if (userExists.Role == 'user' && solutionExists.IsApproved) {
            return {
                'success': false,
                'error': 'You cannot delete an approved solution.'
            };
        }
        let deleteSolution = await this.prisma.solution.delete({
            where: {
                SolutionId: SolutionId,
                UserId
            }
        });
        if (deleteSolution == null) {
            return {
                'success': false,
                'error': 'Unable to delete solution.'
            };
        }
        else {
            return {
                'success': true,
                'message': 'Solution deleted successfully.'
            };
        }
    }
    async getAllSolutions() {
        let solutions = await this.prisma.solution.findMany({
            include: {
                Problem: true,
                User: true
            }
        });
        if (solutions == null) {
            return {
                'success': false,
                'error': 'Failed to retrieve solutions.'
            };
        }
        else {
            return {
                'success': true,
                'message': 'Solutions retrieved successfully.',
                'solutions': solutions
            };
        }
    }
    async getSolutionsByProblem(ProblemId) {
        let problemExists = await this.prisma.problem.findUnique({
            where: {
                ProblemId
            }
        });
        if (problemExists == null) {
            return {
                'success': false,
                'error': 'Problem not found.'
            };
        }
        let solutions = await this.prisma.solution.findMany({
            where: {
                ProblemId
            },
            include: {
                Problem: true,
                User: true
            }
        });
        if (solutions == null) {
            return {
                'success': false,
                'error': 'Failed to retrieve solutions for the given problem.'
            };
        }
        else {
            return {
                'success': true,
                'message': 'Solutions retrieved successfully for the given problem.',
                'solutions': solutions
            };
        }
    }
}
exports.SolutionService = SolutionService;
