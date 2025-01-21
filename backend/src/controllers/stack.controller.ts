import { Response } from "express";
import { ExtendedRequest } from "../middlewares/verify.tokens";
import { StackService } from "../services/stack.service";
import { StackSchema } from "../validators/body.input.validators";

const stackService = new StackService();

export class StackController {
  async createStack(req: ExtendedRequest, res: Response) {
    try {

      let { error } = StackSchema.validate(req.body);

      if (error) {
        res.status(400).json({
          'error': error.message
        });
      };

      res.status(201).json(await stackService.createStack(req.body));
      
    } catch (error) {
      res.status(501).json({
        'error': error
      });
    }
  }
  async updateStack(req: ExtendedRequest, res: Response) {
    try {

      let { error } = StackSchema.validate(req.body);

      if (error) {
        res.status(400).json({
          'error': error.message
        });
      };

      res.status(201).json(await stackService.updateStack(req.params.StackId, req.body));
      
    } catch (error) {
      res.status(501).json({
        'error': error
      });
    }
  }
  async deleteStack(req: ExtendedRequest, res: Response) {
    try {

      res.status(201).json(await stackService.deleteStack(req.params.StackId));
      
    } catch (error) {
      res.status(501).json({
        'error': error
      });
    }
  }
  async getAllStacks(req: ExtendedRequest, res: Response) {
    try {

      res.status(201).json(await stackService.getAllStacks());
      
    } catch (error) {
      res.status(501).json({
        'error': error
      });
    }
  }
  async getSingleStack(req: ExtendedRequest, res: Response) {
    try {

      res.status(201).json(await stackService.getSingleStack(req.params.StackId));
      
    } catch (error) {
      res.status(501).json({
        'error': error
      });
    }
  }
  
}