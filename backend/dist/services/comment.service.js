"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentService = void 0;
const client_1 = require("@prisma/client");
const uuid_1 = require("uuid");
const body_input_validators_1 = require("../validators/body.input.validators");
class CommentService {
    prisma = new client_1.PrismaClient({
        log: ["error"]
    });
    async createComment(userId, problemId, Content) {
        let { error } = body_input_validators_1.CommentSchema.validate(Content);
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
                'error': 'User does not exist'
            };
        }
        if (userExists.IsDeleted) {
            return {
                'success': false,
                'error': 'Sorry, your account has been deactivated. Contat us for assistance.'
            };
        }
        let problemExists = await this.prisma.problem.findUnique({
            where: {
                ProblemId: problemId
            }
        });
        if (problemExists == null) {
            return {
                'success': false,
                'error': 'Problem specified does not exist'
            };
        }
        let create = await this.prisma.comment.create({
            data: {
                CommentId: (0, uuid_1.v4)(),
                ProblemId: problemExists.ProblemId,
                UserId: userExists.UserId,
                Content: Content
            }
        });
        if (create == null) {
            return {
                'success': false,
                'error': 'Unable to create comment.'
            };
        }
        else {
            return {
                'success': true,
                'message': 'Comment submitted successfully.'
            };
        }
    }
    async updateComment(UserId, CommentId, content) {
        let userExists = await this.prisma.user.findUnique({
            where: {
                UserId
            }
        });
        if (userExists == null) {
            return {
                'success': false,
                'error': 'User does not exist'
            };
        }
        if (userExists.IsDeleted) {
            return {
                'success': false,
                'error': 'Sorry, your account has been deactivated. Contat us for assistance.'
            };
        }
        let commentExists = await this.prisma.comment.findUnique({
            where: {
                CommentId,
                UserId
            }
        });
        if (commentExists == null) {
            return {
                'success': false,
                'error': 'Comment specified does not exist or you do not have permission to update it.'
            };
        }
        let update = await this.prisma.comment.update({
            where: {
                CommentId
            },
            data: {
                Content: content
            }
        });
        if (update == null) {
            return {
                'success': false,
                'error': 'Unable to update comment.'
            };
        }
        else {
            return {
                'success': true,
                'message': 'Comment updated successfully.'
            };
        }
    }
    async deleteComment(CommentId) {
        let commentExists = await this.prisma.comment.findUnique({
            where: {
                CommentId
            }
        });
        if (commentExists == null) {
            return {
                'success': false,
                'error': 'Comment specified does not exist.'
            };
        }
        let delete_ = await this.prisma.comment.delete({
            where: {
                CommentId
            }
        });
        if (delete_ == null) {
            return {
                'success': false,
                'error': 'Unable to delete comment.'
            };
        }
        else {
            return {
                'success': true,
                'message': 'Comment deleted successfully.'
            };
        }
    }
    async getCommentsByProblem(ProblemId) {
        let problemExists = await this.prisma.problem.findUnique({
            where: {
                ProblemId
            }
        });
        if (problemExists == null) {
            return {
                'success': false,
                'error': 'Problem specified does not exist.'
            };
        }
        let comments = await this.prisma.comment.findMany({
            where: {
                ProblemId
            },
            include: {
                User: true,
                Problem: true
            }
        });
        if (comments == null) {
            return {
                'success': false,
                'error': 'Unable to retrieve comments.'
            };
        }
        else {
            return {
                'success': true,
                'message': 'Comments retrieved successfully.',
                'comments': comments
            };
        }
    }
}
exports.CommentService = CommentService;
