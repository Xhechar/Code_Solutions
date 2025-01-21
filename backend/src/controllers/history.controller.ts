import { Response } from "express";
import { ExtendedRequest, getIdFromToken } from "../middlewares/verify.tokens";
import { HistoryService } from "../services/history.service";

const historyService = new HistoryService();

export class HistoryController {
  async addHistory(req: ExtendedRequest, res: Response) {
    try {

      res.status(201).json(await historyService.addHistory(getIdFromToken(req), req.params.ProblemId));
      
    } catch (error) {
      res.status(501).json({
        'error': error
      });
    }
  }
  async getHistoryByUser(req: ExtendedRequest, res: Response) {
    try {

      res.status(201).json(await historyService.getHistoryByUser(getIdFromToken(req)));
      
    } catch (error) {
      res.status(501).json({
        'error': error
      });
    }
  }
  async clearHistory(req: ExtendedRequest, res: Response) {
    try {

      res.status(201).json(await historyService.clearHistory(getIdFromToken(req)));
      
    } catch (error) {
      res.status(501).json({
        'error': error
      });
    }
  }
  
}