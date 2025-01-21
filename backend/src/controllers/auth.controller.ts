import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { LoginDetailsSchema, RecoveryDetailsSchema } from "../validators/body.input.validators";

const authService = new AuthService();

export class AuthController {
  async loginUser(req: Request, res: Response) {
    try {

      let { error } = LoginDetailsSchema.validate(req.body);

      if (error) {
        res.status(401).json({
          'error': error.message
        });
      } else {

        let result = await authService.loginUser(req.body);
  
        res.status(201).json(result);
      }
      
    } catch (error) {
      res.status(501).json({
        error: error
      });
    }
  }
  async changePassword(req: Request, res: Response) {
    try {

      let { error } = RecoveryDetailsSchema.validate(req.body);

      if (error) {
        res.status(401).json({
          'error': error.message
        });
      };

      let result = await authService.changePassword(req.body);

      res.status(201).json(result);
      
    } catch (error) {
      res.status(501).json({
        error: error
      });
    }
  }
  async getAllRecoveries(res: Response) {
    try {

      res.status(201).json(await authService.getAllRecoveries());
      
    } catch (error) {
      res.status(501).json({
        error: error
      });
    }
  }
  async verifyMail(req: Request, res: Response) {
    try {

      res.status(201).json(await authService.verifyMail(req.body.Email));
      
    } catch (error) {
      res.status(501).json({
        error: error
      });
    }
  }

}