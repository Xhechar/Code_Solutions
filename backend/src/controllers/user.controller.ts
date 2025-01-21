import { Response } from "express";
import { ExtendedRequest, getIdFromToken } from "../middlewares/verify.tokens";
import { UserService } from "../services/user.service";
import { UserRegisterationSchema } from "../validators/body.input.validators";

const userService = new UserService();

export class UserController {
  async createUser(req: ExtendedRequest, res: Response) {
    try {

      let { error } = UserRegisterationSchema.validate(req.body);

      if (error) {
        res.status(400).json({
          'error': error.message
        });
      };
      
      res.status(201).json(await userService.createUser(req.body));
      
    } catch (error) {
      res.status(501).json({
        'error': error
      });
    }
  }
  async updateUser(req: ExtendedRequest, res: Response) {
    try {

      let { error } = UserRegisterationSchema.validate(req.body);

      if (error) {
        res.status(400).json({
          'error': error.message
        });
      };

      res.status(201).json(await userService.updateUser(getIdFromToken(req), req.body));
      
    } catch (error) {
      res.status(501).json({
        'error': error
      });
    }
  }
  async softDeleteUser(req: ExtendedRequest, res: Response) {
    try {

      res.status(201).json(await userService.softDeleteUser(req.params.UserId));
      
    } catch (error) {
      res.status(501).json({
        'error': error
      });
    }
  }
  async deleteUser(req: ExtendedRequest, res: Response) {
    try {

      res.status(201).json(await userService.deleteUser(req.params.UserId));
      
    } catch (error) {
      res.status(501).json({
        'error': error
      });
    }
  }
  async restoreUser(req: ExtendedRequest, res: Response) {
    try {

      res.status(201).json(await userService.restoreUser(req.params.UserId));
      
    } catch (error) {
      res.status(501).json({
        'error': error
      });
    }
  }
  async getSingleUser(req: ExtendedRequest, res: Response) {
    try {

      res.status(201).json(await userService.getSingleUser(getIdFromToken(req)));
      
    } catch (error) {
      res.status(501).json({
        'error': error
      });
    }
  }
  async getAllUsers(req: ExtendedRequest, res: Response) {
    try {

      res.status(201).json(await userService.getAllUsers());
      
    } catch (error) {
      res.status(501).json({
        'error': error
      });
    }
  }
  async getSoftDeletedUsers(req: ExtendedRequest, res: Response) {
    try {

      res.status(201).json(await userService.getSoftDeletedUsers());
      
    } catch (error) {
      res.status(501).json({
        'error': error
      });
    }
  }
  async updateUserRole(req: ExtendedRequest, res: Response) {
    try {

      res.status(201).json(await userService.updateUserRole(req.params.UserId));
      
    } catch (error) {
      res.status(501).json({
        'error': error
      });
    }
  }
  async bulkDeleteUsers(req: ExtendedRequest, res: Response) {
    try {

      res.status(201).json(await userService.bulkDeleteUsers(req.body.UserIds));
      
    } catch (error) {
      res.status(501).json({
        'error': error
      });
    }
  }
  
}