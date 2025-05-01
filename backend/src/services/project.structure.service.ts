import { PrismaClient, ProjectStructure } from "@prisma/client";
import { ProjectStructureInterface } from "../interfaces/methods.interfaces";
import { v4 } from "uuid";
import { ProjectStructureDto } from "../interfaces/solutions.interfaces";

export class ProjectStructureService implements ProjectStructureInterface {
  prisma = new PrismaClient({
    log: ["error"]
  });

  async createProjectStructure(project: ProjectStructureDto): Promise<{ success: boolean; message?: string; error?: string; project?: ProjectStructure }> {
    
    let create = await this.prisma.projectStructure.create({
      data: {
        ...project,
        ProjectId: v4(),
        DateCreated: new Date(),
        LastUpdated: new Date()
      }
    });

    if (create == null) {
      return {
        'success': false,
        'error': 'Unable to create project structure'
      }
    } else {
      return {
        'success': true,
        'message': 'Project structure created successfully',
        'project': create
      }
    } 
  }
  async updateProjectStructure(ProjectId: string, project: ProjectStructureDto): Promise<{ success: boolean; message?: string; error?: string; }> {
    
    let projectExists = await this.prisma.projectStructure.findUnique({
      where: {
        ProjectId
      }
    });

    if (projectExists == null) {
      return {
        'success': false,
        'error': 'Project structure not found'
      }
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
      }
    } else {
      return {
        'success': true,
        'message': 'Project structure updated successfully'
      }
    } 
  }
  async deleteProjectStructure(ProjectId: string): Promise<{ success: boolean; message?: string; error?: string; }> {
    
    let projectExists = await this.prisma.projectStructure.findUnique({
      where: {
        ProjectId
      }
    });

    if (projectExists == null) {
      return {
        'success': false,
        'error': 'Project structure not found'
      }
    }

    let delete_ = await this.prisma.projectStructure.delete({
      where: { ProjectId }
    });

    if (!delete_) {
      return {
        'success': false,
        'error': 'Unable to delete project structure'
      }
    } else {
      return {
        'success': true,
        'message': 'Project structure deleted successfully'
      }
    }
  }
  async getAllProjectStructures(): Promise<{ success: boolean; message?: string; error?: string; projects?: ProjectStructure[]; }> {
    
    let projects = await this.prisma.projectStructure.findMany({
      include: {
        PSG: true
      }
    });

    if (projects == null) {
      return {
        'success': false,
        'error': 'No project structures found'
      }
    } else {
      return {
        'success': true,
        'message': 'Project structures retrieved successfully',
        'projects': projects
      }
    } 
  }
  async getSingleProjectStructure(ProjectId: string): Promise<{ success: boolean; message?: string; error?: string; project?: ProjectStructure; }> {
    
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
      }
    } else {
      return {
        'success': true,
        'message': 'Project structure retrieved successfully',
        'project': project
      }
    }
  }
}