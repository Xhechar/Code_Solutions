import { Response } from "express";
import { ExtendedRequest, getIdFromToken } from "../middlewares/verify.tokens";
import { ProblemService } from "../services/problem.service";
import { ProblemSchema } from "../validators/body.input.validators";

const problemService = new ProblemService();

export class ProblemController {
  async createProblem(req: ExtendedRequest, res: Response) {
    try {

      let { error } = ProblemSchema.validate(req.body);

      if (error) {
        res.status(401).json({
          'error': error.message
        });
      }
      
      res.status(201).json(await problemService.createProblem(getIdFromToken(req), req.body));
      
    } catch (error) {
      res.status(501).json({
        'error': error
      });
    }
  }
  async updateProblem(req: ExtendedRequest, res: Response) {
    try {

      let { error } = ProblemSchema.validate(req.body);

      if (error) {
        res.status(401).json({
          'error': error.message
        });
      }
      
      res.status(201).json(await problemService.updateProblem(getIdFromToken(req), req.params.ProblemId, req.body));
      
    } catch (error) {
      res.status(501).json({
        'error': error
      });
    }
  }
  async approveProblem(req: ExtendedRequest, res: Response) {
    try {

      res.status(201).json(await problemService.approveProblem(getIdFromToken(req), req.params.ProblemId));
      
    } catch (error) {
      res.status(501).json({
        'error': error
      });
    }
  }
  async deleteProblem(req: ExtendedRequest, res: Response) {
    try {

      res.status(201).json(await problemService.deleteProblem(getIdFromToken(req), req.params.ProblemId));
      
    } catch (error) {
      res.status(501).json({
        'error': error
      });
    }
  }
  async getUserProblems(req: ExtendedRequest, res: Response) {
    try {

      res.status(201).json(await problemService.getUserProblems(getIdFromToken(req)));
      
    } catch (error) {
      res.status(501).json({
        'error': error
      });
    }
  }
  async getAllProblems(req: ExtendedRequest, res: Response) {
    try {

      res.status(201).json(await problemService.getAllProblems());
      
    } catch (error) {
      res.status(501).json({
        'error': error
      });
    }
  }
  async getAdminProblems(req: ExtendedRequest, res: Response) {
    try {

      res.status(201).json(await problemService.getAdminProblems(getIdFromToken(req)));
      
    } catch (error) {
      res.status(501).json({
        'error': error
      });
    }
  }
  async getApprovedProblems(req: ExtendedRequest, res: Response) {
    try {

      res.status(201).json(await problemService.getApprovedProblems());
      
    } catch (error) {
      res.status(501).json({
        'error': error
      });
    }
  }
  async getSingleProblem(req: ExtendedRequest, res: Response) {
    try {

      res.status(201).json(await problemService.getSingleProblem(req.params.ProblemId));
      
    } catch (error) {
      res.status(501).json({
        'error': error
      });
    }
  }
  
}