import { PrismaClient } from "@prisma/client";
import { ProjectStructureInterface } from "../interfaces/methods.interfaces";
import { ProjectStructure } from "../interfaces/solutions.interfaces";

export class ProjectStructureService implements ProjectStructureInterface {
  prisma = new PrismaClient({
    log: ["error"]
  });

  async createProjectStructure(project: ProjectStructure): Promise<{ success: boolean; message?: string; error?: string; }> {
    throw new Error("Method not implemented.");
  }
  async updateProjectStructure(ProjectId: string, project: Partial<ProjectStructure>): Promise<{ success: boolean; message?: string; error?: string; }> {
    throw new Error("Method not implemented.");
  }
  async deleteProjectStructure(ProjectId: string): Promise<{ success: boolean; message?: string; error?: string; }> {
    throw new Error("Method not implemented.");
  }
  async getAllProjectStructures(): Promise<{ success: boolean; message?: string; error?: string; projects?: ProjectStructure[]; }> {
    throw new Error("Method not implemented.");
  }
  async getSingleProjectStructure(ProjectId: string): Promise<{ success: boolean; message?: string; error?: string; project?: ProjectStructure; }> {
    throw new Error("Method not implemented.");
  }
  
}