import { Router } from "express";
import { CommentController } from "../controllers/comment.controller";
import { verifyAdmin, verifyToken, verifyUser } from "../middlewares/verify.tokens";

export const commentRouter = Router();

const commentController = new CommentController();

commentRouter.post('/create-comment/:ProblemId', verifyToken, verifyUser, commentController.createComment);
commentRouter.post('/update-comment/:CommentId', verifyToken, verifyUser, commentController.updateComment);
commentRouter.delete('/delete-comment/:CommentId', verifyToken, verifyAdmin, commentController.deleteComment);
commentRouter.get('get-comment-by-problem/:ProblemId', commentController.getCommentsByProblem);