import { Request, Response } from "express";
import { FavouriteService } from "../services/favourite.service";
import { ExtendedRequest, getIdFromToken } from "../middlewares/verify.tokens";

const favouriteService = new FavouriteService();

export class FavouriteController {
  async addFavourite(req: ExtendedRequest, res: Response) {
    try {
      
      res.status(201).json(await favouriteService.addFavourite(getIdFromToken(req), req.params.ProblemId));
      
    } catch (error) {
      res.status(501).json({
        'error': error
      });
    }
  }
  async removeFavourite(req: ExtendedRequest, res: Response) {
    try {
      
      res.status(201).json(await favouriteService.removeFavourite(req.params.FavouriteId));
      
    } catch (error) {
      res.status(501).json({
        'error': error
      });
    }
  }
  async getFavouritesByUser(req: ExtendedRequest, res: Response) {
    try {
      
      res.status(201).json(await favouriteService.getFavouritesByUser(getIdFromToken(req)));
      
    } catch (error) {
      res.status(501).json({
        'error': error
      });
    }
  }
  
}