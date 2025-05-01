"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentController = exports.commentService = void 0;
const comment_service_1 = require("../services/comment.service");
const verify_tokens_1 = require("../middlewares/verify.tokens");
exports.commentService = new comment_service_1.CommentService();
class CommentController {
    async createComment(req, res) {
        try {
            res.status(201).json(await exports.commentService.createComment((0, verify_tokens_1.getIdFromToken)(req), req.params.ProblemId, req.body.Content));
        }
        catch (error) {
            res.status(501).json({
                'error': error
            });
        }
    }
    async updateComment(req, res) {
        try {
            res.status(201).json(await exports.commentService.updateComment((0, verify_tokens_1.getIdFromToken)(req), req.params.CommentId, req.body.content));
        }
        catch (error) {
            res.status(501).json({
                'error': error
            });
        }
    }
    async deleteComment(req, res) {
        try {
            res.status(201).json(await exports.commentService.deleteComment(req.params.CommentId));
        }
        catch (error) {
            res.status(501).json({
                'error': error
            });
        }
    }
    async getCommentsByProblem(req, res) {
        try {
            res.status(201).json(await exports.commentService.getCommentsByProblem(req.params.ProblemId));
        }
        catch (error) {
            res.status(501).json({
                'error': error
            });
        }
    }
}
exports.CommentController = CommentController;
