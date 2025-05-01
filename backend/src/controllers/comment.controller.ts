import { Request, Response } from "express";
import { CommentService } from "../services/comment.service";
import { ExtendedRequest, getIdFromToken } from "../middlewares/verify.tokens";

export const commentService = new CommentService();

export class CommentController {
  async createComment(req: ExtendedRequest, res: Response) {
    try {

      res.status(201).json(await commentService.createComment(getIdFromToken(req), req.params.ProblemId, req.body.Content));
      
    } catch (error) {
      res.status(501).json({
        'error': error
      });
    }
  }
  async updateComment(req: ExtendedRequest, res: Response) {
    try {

      res.status(201).json(await commentService.updateComment(getIdFromToken(req), req.params.CommentId, req.body.content));
      
    } catch (error) {
      res.status(501).json({
        'error': error
      });
    }
  }
  async deleteComment(req: Request, res: Response) {
    try {

      res.status(201).json(await commentService.deleteComment(req.params.CommentId));
      
    } catch (error) {
      res.status(501).json({
        'error': error
      });
    }
  }
  async getCommentsByProblem(req: Request, res: Response) {
    try {

      res.status(201).json(await commentService.getCommentsByProblem(req.params.ProblemId));
      
    } catch (error) {
      res.status(501).json({
        'error': error
      });
    }
  }
  
}