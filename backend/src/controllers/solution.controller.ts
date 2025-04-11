import { Response } from "express";
import { ExtendedRequest, getIdFromToken } from "../middlewares/verify.tokens";
import { SolutionService } from "../services/solution.service";
import { SolutionSchema } from "../validators/body.input.validators";

const solutionService = new SolutionService();

export class SolutionController {
  async createSolution(req: ExtendedRequest, res: Response) {
    try {

      let { error } = SolutionSchema.validate(req.body);

      if (error) {
        res.status(401).json({
          'error': error.message
        });
      };

      res.status(201).json(await solutionService.createSolution(getIdFromToken(req), req.params.ProblemId, req.body));
      
    } catch (error) {
      res.status(501).json({
        'error': error
      });
    }
  }
  async updateSolution(req: ExtendedRequest, res: Response) {
    try {

      let { error } = SolutionSchema.validate(req.body);

      if (error) {
        res.status(401).json({
          'error': error.message
        });
      };

      res.status(201).json(await solutionService.updateSolution(getIdFromToken(req), req.params.SolutionId, req.body));
      
    } catch (error) {
      res.status(501).json({
        'error': error
      });
    }
  }
  async deleteSolution(req: ExtendedRequest, res: Response) {
    try {

      res.status(201).json(await solutionService.deleteSolution(getIdFromToken(req), req.params.SolutionId));
      
    } catch (error) {
      res.status(501).json({
        'error': error
      });
    }
  }
  async getAllSolutions(req: ExtendedRequest, res: Response) {
    try {

      res.status(201).json(await solutionService.getAllSolutions());
      
    } catch (error) {
      res.status(501).json({
        'error': error
      });
    }
  }
  async getSolutionsByProblem(req: ExtendedRequest, res: Response) {
    try {

      res.status(201).json(await solutionService.getSolutionsByProblem(req.params.ProblemId));
      
    } catch (error) {
      res.status(501).json({
        'error': error
      });
    }
  }
  
}