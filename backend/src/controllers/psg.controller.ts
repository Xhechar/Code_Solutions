import { Response } from "express";
import { ExtendedRequest } from "../middlewares/verify.tokens";
import { PSGService } from "../services/psg.service";

const psgService = new PSGService();

export class PSGController {
  async createPSG(req: ExtendedRequest, res: Response) {
    try {

      res.status(201).json(await psgService.createPSG(req.params.ProjectId, req.body));
      
    } catch (error) {
      res.status(501).json({
        'error': error
      });
    }
  }
  async updatePSG(req: ExtendedRequest, res: Response) {
    try {

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