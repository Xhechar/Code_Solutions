import { Router } from "express";
import { CommentController } from "../controllers/comment.controller";
import { verifyAdmin, verifyUser } from "../middlewares/verify.tokens";

export const commentRouter = Router();

const commentController = new CommentController();

commentRouter.post('/create-comment/:ProblemId', verifyUser, commentController.createComment);
commentRouter.post('/update-comment/:CommentId', verifyUser, commentController.updateComment);
commentRouter.delete('/delete-comment/:CommentId', verifyAdmin, commentController.deleteComment);
commentRouter.get('get-comment-by-problem/:ProblemId', commentController.getCommentsByProblem);