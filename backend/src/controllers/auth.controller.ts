import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { LoginDetailsSchema, RecoveryDetailsSchema } from "../validators/body.input.validators";
import { TokenDetails } from "../interfaces/solutions.interfaces";
import { rest } from "lodash";

const authService = new AuthService();

export class AuthController {
  async loginUser(req: Request, res: Response) {
    try {
      let { error } = LoginDetailsSchema.validate(req.body);
      if (error) {
        return res.status(401).json({
          'error': error.message
        });
      }
      
      let result = await authService.loginUser(req.body);
      
      if(result.success) {
        res.cookie('token', result.token as string, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production', // Use secure in production
          sameSite: 'strict',
          maxAge: 15*60*1000,
          signed: true
        });
        
        let {token, ...rest} = result;
        return res.status(201).json(rest);
      }
      
      return res.status(201).json(result);
    } catch (error) {
      return res.status(501).json({
        error: error
      });
    }
  }

  async logoutUser(req: Request, res: Response) {
    try {
      res.clearCookie('token', {signed: true});

      return res.status(201).json({
        'success': true,
        'message': 'Logout successfull. You are always welcomed.'
      })
    } catch(error) {
      return res.status(501).json({
        'error': error
      })
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