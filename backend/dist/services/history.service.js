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
                'success': false,
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
}
exports.HistoryService = HistoryService;
