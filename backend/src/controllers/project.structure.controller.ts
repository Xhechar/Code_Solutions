import { Response } from "express";
import { ExtendedRequest } from "../middlewares/verify.tokens";
import { ProjectStructureService } from "../services/project.structure.service";

const projectStructureService = new ProjectStructureService();

export class ProjectStructureController {
  async createProjectStructure(req: ExtendedRequest, res: Response) {
    try {

      res.status(201).json(await projectStructureService.createProjectStructure(req.body));
      
    } catch (error) {
      res.status(501).json({
        'error': error
      });
    }
  }
  async updateProjectStructure(req: ExtendedRequest, res: Response) {
    try {

      res.status(201).json(await projectStructureService.updateProjectStructure(req.params.ProjectId, req.body));
      
    } catch (error) {
      res.status(501).json({
        'error': error
      });
    }
  }
  async deleteProjectStructure(req: ExtendedRequest, res: Response) {
    try {

      res.status(201).json(await projectStructureService.deleteProjectStructure(req.params.ProjectId));
      
    } catch (error) {
      res.status(501).json({
        'error': error
      });
    }
  }
  async getAllProjectStructures(req: ExtendedRequest, res: Response) {
    try {

      res.status(201).json(await projectStructureService.getAllProjectStructures());
      
    } catch (error) {
      res.status(501).json({
        'error': error
      });
    }
  }
  async getSingleProjectStructure(req: ExtendedRequest, res: Response) {
    try {
      
      res.status(201).json(await projectStructureService.getSingleProjectStructure(req.params.ProjectId));
      
    } catch (error) {
      res.status(501).json({
        'error': error
      });
    }
  }
  
}