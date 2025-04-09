"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProblemService = void 0;
const client_1 = require("@prisma/client");
const uuid_1 = require("uuid");
class ProblemService {
    prisma = new client_1.PrismaClient({
        log: ["error"]
    });
    async createProblem(userId, problem) {
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
        let { ProblemId, DateCreated, UserId, ...r_problem } = problem;
        if (userExists.Role == 'user') {
            let create = await this.prisma.problem.create({
                data: {
                    ProblemId: (0, uuid_1.v4)(),
                    ...r_problem,
                    UserId: userId,
                    ErrorCode: problem.ErrorCode || "",
                    Context: problem.Context || "",
                    Environment: problem.Environment || "",
                    Tags: problem.Tags || "",
                    Logs: problem.Logs || "",
                    PriorityLevel: problem.PriorityLevel || 0,
                    ImagePath: problem.ImagePath || "",
                }
            });
            if (create == null) {
                return {
                    'success': false,
                    'error': "Unable to create problem."
                };
            }
            else {
                return {
                    'success': true,
                    'message': "Problem created successfully."
                };
            }
        }
        else {
            let create = await this.prisma.problem.create({
                data: {
                    ProblemId: (0, uuid_1.v4)(),
                    ...r_problem,
                    UserId: userId,
                    ErrorCode: problem.ErrorCode || "",
                    Context: problem.Context || "",
                    Environment: problem.Environment || "",
                    Tags: problem.Tags || "",
                    Logs: problem.Logs || "",
                    PriorityLevel: problem.PriorityLevel || 0,
                    ImagePath: problem.ImagePath || ""
                }
            });
            if (create == null) {
                return {
                    'success': false,
                    'error': "Unable to create problem."
                };
            }
            else {
                return {
                    'success': true,
                    'message': "Problem created successfully."
                };
            }
        }
    }
    async updateProblem(userId, problemId, problem) {
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
                'error': 'Problem not found.'
            };
        }
        if (userExists.Role == 'user' && problemExists.IsApproved) {
            return {
                'success': false,
                'error': 'Cannot update a problem that has been approved.'
            };
        }
        let update = await this.prisma.problem.update({
            where: {
                ProblemId: problemExists.ProblemId,
                UserId: problemExists.UserId
            },
            data: {
                ...problem
            }
        });
        if (update == null) {
            return {
                'success': false,
                'error': "Unable to update problem."
            };
        }
        else {
            return {
                'success': true,
                'message': "Problem updated successfully."
            };
        }
    }
    async approveProblem(UserId, ProblemId) {
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
        if (userExists.Role != 'admin') {
            return {
                'success': false,
                'error': 'Only admin users can approve problems.'
            };
        }
        let problemExists = await this.prisma.problem.findUnique({
            where: {
                ProblemId: ProblemId
            }
        });
        if (problemExists == null) {
            return {
                'success': false,
                'error': 'Problem not found.'
            };
        }
        let update = await this.prisma.problem.update({
            where: {
                ProblemId: problemExists.ProblemId
            },
            data: {
                IsApproved: true
            }
        });
        if (update == null) {
            return {
                'success': false,
                'error': "Unable to approve problem."
            };
        }
        else {
            return {
                'success': true,
                'message': "Problem approved successfully."
            };
        }
    }
    async deleteProblem(UserId, ProblemId) {
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
        if (userExists.Role != 'admin') {
            return {
                'success': false,
                'error': 'Only admin users can delete problems.'
            };
        }
        let problemExists = await this.prisma.problem.findUnique({
            where: {
                ProblemId: ProblemId
            }
        });
        if (problemExists == null) {
            return {
                'success': false,
                'error': 'Problem not found.'
            };
        }
        let delete_ = await this.prisma.problem.delete({
            where: {
                ProblemId: problemExists.ProblemId
            }
        });
        if (delete_ == null) {
            return {
                'success': false,
                'error': "Unable to delete problem."
            };
        }
        else {
            return {
                'success': true,
                'message': "Problem deleted successfully."
            };
        }
    }
    async getUserProblems(UserId) {
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
        let problems = await this.prisma.problem.findMany({
            where: {
                UserId: UserId
            },
            include: {
                Stack: true,
                Category: true,
                Solutions: true,
                Comments: true,
                User: true
            }
        });
        if (problems == null) {
            return {
                'success': false,
                'error': "No problems found."
            };
        }
        else {
            return {
                'success': true,
                'message': 'Problems retrieved successfully.',
                'problems': problems
            };
        }
    }
    async getAllProblems() {
        let problems = await this.prisma.problem.findMany({
            include: {
                Stack: true,
                Category: true,
                Solutions: true,
                Comments: true,
                User: true
            }
        });
        if (problems == null) {
            return {
                'success': false,
                'error': "No problems found."
            };
        }
        else {
            return {
                'success': true,
                'message': 'Problems retrieved successfully.',
                'problems': problems
            };
        }
    }
    async getAdminProblems(UserId) {
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
        if (userExists.Role != 'admin') {
            return {
                'success': false,
                'error': 'Only admin users can view problems.'
            };
        }
        let problems = await this.prisma.problem.findMany({
            where: {
                IsApproved: true
            },
            include: {
                Stack: true,
                Category: true,
                Solutions: true,
                Comments: true,
                User: true
            }
        });
        if (problems == null) {
            return {
                'success': false,
                'error': "No approved problems found."
            };
        }
        else {
            return {
                'success': true,
                'message': 'Approved problems retrieved successfully.',
                'problems': problems
            };
        }
    }
    async getApprovedProblems() {
        let problems = await this.prisma.problem.findMany({
            where: {
                IsApproved: true
            },
            include: {
                Stack: true,
                Category: true,
                Solutions: true,
                Comments: true,
                User: true
            }
        });
        if (problems == null) {
            return {
                'success': false,
                'error': "No approved problems found."
            };
        }
        else {
            return {
                'success': true,
                'message': 'Approved problems retrieved successfully.',
                'problems': problems
            };
        }
    }
    async getSingleProblem(ProblemId) {
        let problem = await this.prisma.problem.findUnique({
            where: {
                ProblemId: ProblemId
            },
            include: {
                Stack: true,
                Category: true,
                Solutions: true,
                Comments: true,
                User: true
            }
        });
        if (problem == null) {
            return {
                'success': false,
                'error': 'Problem not found.'
            };
        }
        else {
            return {
                'success': true,
                'message': 'Problem retrieved successfully.',
                'problem': problem
            };
        }
    }
}
exports.ProblemService = ProblemService;
