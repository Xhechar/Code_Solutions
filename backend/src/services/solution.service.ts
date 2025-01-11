import { PrismaClient } from "@prisma/client";
import { SolutionInterface } from "../interfaces/methods.interfaces";
import { Solution } from "../interfaces/solutions.interfaces";

export class SolutionService implements SolutionInterface {
  prisma = new PrismaClient({
    log: ["error"]
  });

  async createSolution(ProblemId: string, solution: Solution): Promise<{ success: boolean; message?: string; error?: string; }> {
    throw new Error("Method not implemented.");
  }
  async updateSolution(SolutionId: string, solution: Partial<Solution>): Promise<{ success: boolean; message?: string; error?: string; }> {
    throw new Error("Method not implemented.");
  }
  async deleteSolution(SolutionId: string): Promise<{ success: boolean; message?: string; error?: string; }> {
    throw new Error("Method not implemented.");
  }
  async getAllSolutions(): Promise<{ success: boolean; message?: string; error?: string; solutions?: Solution[]; }> {
    throw new Error("Method not implemented.");
  }
  async getSolutionsByProblem(ProblemId: string): Promise<{ success: boolean; message?: string; error?: string; solutions?: Solution[]; }> {
    throw new Error("Method not implemented.");
  }
  
}