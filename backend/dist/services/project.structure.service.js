"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectStructureService = void 0;
const client_1 = require("@prisma/client");
const uuid_1 = require("uuid");
class ProjectStructureService {
    prisma = new client_1.PrismaClient({
        log: ["error"]
    });
    async createProjectStructure(project) {
        let create = await this.prisma.projectStructure.create({
            data: {
                ...project,
                ProjectId: (0, uuid_1.v4)(),
                DateCreated: new Date(),
                LastUpdated: new Date()
            }
        });
        if (create == null) {
            return {
                'success': false,
                'error': 'Unable to create project structure'
            };
        }
        else {
            return {
                'success': true,
                'message': 'Project structure created successfully'
            };
        }
    }
    async updateProjectStructure(ProjectId, project) {
        let projectExists = await this.prisma.projectStructure.findUnique({
            where: {
                ProjectId
            }
        });
        if (projectExists == null) {
            return {
                'success': false,
                'error': 'Project structure not found'
            };
        }
        let update = await this.prisma.projectStructure.update({
            where: {
                ProjectId
            },
            data: {
                ...project,
                LastUpdated: new Date()
            }
        });
        if (update == null) {
            return {
                'success': false,
                'error': 'Unable to update project structure'
            };
        }
        else {
            return {
                'success': true,
                'message': 'Project structure updated successfully'
            };
        }
    }
    async deleteProjectStructure(ProjectId) {
        let projectExists = await this.prisma.projectStructure.findUnique({
            where: {
                ProjectId
            }
        });
        if (projectExists == null) {
            return {
                'success': false,
                'error': 'Project structure not found'
            };
        }
        let delete_ = await this.prisma.projectStructure.delete({
            where: { ProjectId }
        });
        if (!delete_) {
            return {
                'success': false,
                'error': 'Unable to delete project structure'
            };
        }
        else {
            return {
                'success': true,
                'message': 'Project structure deleted successfully'
            };
        }
    }
    async getAllProjectStructures() {
        let projects = await this.prisma.projectStructure.findMany({
            include: {
                PSG: true
            }
        });
        if (projects == null) {
            return {
                'success': false,
                'error': 'No project structures found'
            };
        }
        else {
            return {
                'success': true,
                'message': 'Project structures retrieved successfully',
                'projects': projects
            };
        }
    }
    async getSingleProjectStructure(ProjectId) {
        let project = await this.prisma.projectStructure.findUnique({
            where: {
                ProjectId
            },
            include: {
                PSG: true
            }
        });
        if (project == null) {
            return {
                'success': false,
                'error': 'Project structure not found'
            };
        }
        else {
            return {
                'success': true,
                'message': 'Project structure retrieved successfully',
                'project': project
            };
        }
    }
}
exports.ProjectStructureService = ProjectStructureService;
