"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HistoryService = void 0;
const client_1 = require("@prisma/client");
const uuid_1 = require("uuid");
class HistoryService {
    prisma = new client_1.PrismaClient({
        log: ["error"]
    });
    async addHistory(UserId, ProblemId) {
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
        let historyExists = await this.prisma.history.findFirst({
            where: {
                UserId: userExists.UserId,
                ProblemId: problemExists.ProblemId
            }
        });
        if (historyExists != null) {
            return {
                'success': false,
                'error': 'History already exists.'
            };
        }
        let add = await this.prisma.history.create({
            data: {
                HistoryId: (0, uuid_1.v4)(),
                UserId,
                ProblemId
            }
        });
        if (add) {
            return {
                success: true,
                message: 'History added successfully.'
            };
        }
        else {
            return {
                success: false,
                error: 'Unable to add history.'
            };
        }
    }
    async getHistoryByUser(UserId) {
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
        let histories = await this.prisma.history.findMany({
            where: {
                UserId
            },
            include: {
                Problem: {
                    include: {
                        Stack: true,
                        Solutions: true,
                        Category: true,
                        Comments: true
                    }
                },
                User: true,
            }
        });
        if (histories == null) {
            return {
                'success': false,
                'error': 'No history found.'
            };
        }
        else {
            return {
                'success': true,
                'message': 'History successfully retrieved.',
                'histories': histories
            };
        }
    }
    async clearHistory(UserId) {
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
        let histories = await this.prisma.history.deleteMany({
            where: {
                UserId
            }
        });
        if (histories.count > 0) {
            return {
                success: true,
                message: 'History cleared successfully.'
            };
        }
        else {
            return {
                success: false,
                error: 'No history found to clear.'
            };
        }
    }
    async deleteSingleHistory(UserId, HistoryId) {
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
        let historyExists = await this.prisma.history.findUnique({
            where: {
                HistoryId,
                UserId: userExists.UserId
            }
        });
        if (historyExists == null) {
            return {
                'success': false,
                'error': 'History not found.'
            };
        }
        let delete_ = await this.prisma.history.delete({
            where: {
                HistoryId
            }
        });
        if (delete_ == null) {
            return {
                'success': false,
                'error': 'Unable to delete history.'
            };
        }
        else {
            return {
                'success': true,
                'message': 'History deleted successfully.'
            };
        }
    }
}
exports.HistoryService = HistoryService;
