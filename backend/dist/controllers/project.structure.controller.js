"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectStructureController = void 0;
const project_structure_service_1 = require("../services/project.structure.service");
const projectStructureService = new project_structure_service_1.ProjectStructureService();
class ProjectStructureController {
    async createProjectStructure(req, res) {
        try {
            res.status(201).json(await projectStructureService.createProjectStructure(req.body));
        }
        catch (error) {
            res.status(501).json({
                'error': error
            });
        }
    }
    async updateProjectStructure(req, res) {
        try {
            res.status(201).json(await projectStructureService.updateProjectStructure(req.params.ProjectId, req.body));
        }
        catch (error) {
            res.status(501).json({
                'error': error
            });
        }
    }
    async deleteProjectStructure(req, res) {
        try {
            res.status(201).json(await projectStructureService.deleteProjectStructure(req.params.ProjectId));
        }
        catch (error) {
            res.status(501).json({
                'error': error
            });
        }
    }
    async getAllProjectStructures(req, res) {
        try {
            res.status(201).json(await projectStructureService.getAllProjectStructures());
        }
        catch (error) {
            res.status(501).json({
                'error': error
            });
        }
    }
    async getSingleProjectStructure(req, res) {
        try {
            res.status(201).json(await projectStructureService.getSingleProjectStructure(req.params.ProjectId));
        }
        catch (error) {
            res.status(501).json({
                'error': error
            });
        }
    }
}
exports.ProjectStructureController = ProjectStructureController;
