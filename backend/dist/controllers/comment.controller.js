"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentController = void 0;
const comment_service_1 = require("../services/comment.service");
const body_input_validators_1 = require("../validators/body.input.validators");
const verify_tokens_1 = require("../middlewares/verify.tokens");
const commentService = new comment_service_1.CommentService();
class CommentController {
    async createComment(req, res) {
        try {
            let { error } = body_input_validators_1.CommentSchema.validate(req.body);
            if (error) {
                return res.status(401).json({
                    'error': error.message
                });
            }
            ;
            return res.status(201).json(await commentService.createComment((0, verify_tokens_1.getIdFromToken)(req), req.params.problemId, req.body));
        }
        catch (error) {
            return res.status(501).json({
                'error': error
            });
        }
    }
    async updateComment(req, res) {
        try {
            let { error } = body_input_validators_1.CommentSchema.validate(req.body);
            if (error) {
                return res.status(401).json({
                    'error': error.message
                });
            }
            ;
            return res.status(201).json(await commentService.updateComment((0, verify_tokens_1.getIdFromToken)(req), req.params.commentId, req.body.content));
        }
        catch (error) {
            return res.status(501).json({
                'error': error
            });
        }
    }
    async deleteComment(req, res) {
        try {
            return res.status(201).json(await commentService.deleteComment(req.params.CommentId));
        }
        catch (error) {
            return res.status(501).json({
                'error': error
            });
        }
    }
    async getCommentsByProblem(req, res) {
        try {
            return res.status(201).json(await commentService.getCommentsByProblem(req.params.ProblemId));
        }
        catch (error) {
            return res.status(501).json({
                'error': error
            });
        }
    }
}
exports.CommentController = CommentController;
