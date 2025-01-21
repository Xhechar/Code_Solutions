import { Response } from "express";
import { ExtendedRequest } from "../middlewares/verify.tokens";
import { PSGService } from "../services/psg.service";
import { PSGSchema } from "../validators/body.input.validators";

const psgService = new PSGService();

export class PSGController {
  async createPSG(req: ExtendedRequest, res: Response) {
    try {

      let { error } = PSGSchema.validate(req.body);

      if (error) {
        res.status(401).json({
          'error': error.message
        });
      };

      res.status(201).json(await psgService.createPSG(req.params.ProjectId, req.body));
      
    } catch (error) {
      res.status(501).json({
        'error': error
      });
    }
  }
  async updatePSG(req: ExtendedRequest, res: Response) {
    try {

      let { error } = PSGSchema.validate(req.body);

      if (error) {
        res.status(401).json({
          'error': error.message
        });
      };

      res.status(201).json(await psgService.updatePSG(req.params.PSGId, req.body));
      
    } catch (error) {
      res.status(501).json({
        'error': error
      });
    }
  }
  async deletePSG(req: ExtendedRequest, res: Response) {
    try {

      res.status(201).json(await psgService.deletePSG(req.params.PSGId));
      
    } catch (error) {
      res.status(501).json({
        'error': error
      });
    }
  }
  async getPSGsByProject(req: ExtendedRequest, res: Response) {
    try {

      res.status(201).json(await psgService.getPSGsByProject(req.params.ProjectId));
      
    } catch (error) {
      res.status(501).json({
        'error': error
      });
    }
  }
  
}