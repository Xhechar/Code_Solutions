import { PrismaClient } from "@prisma/client";
import { ProblemInterface } from "../interfaces/methods.interfaces";
import { Problem } from "../interfaces/solutions.interfaces";

export class ProblemService implements ProblemInterface {
  prisma = new PrismaClient({
    log: ["error"]
  });

  async createProblem(problem: Problem): Promise<{ success: boolean; message?: string; error?: string; }> {
    throw new Error("Method not implemented.");
  }
  async updateProblem(ProblemId: string, problem: Partial<Problem>): Promise<{ success: boolean; message?: string; error?: string; }> {
    throw new Error("Method not implemented.");
  }
  async deleteProblem(ProblemId: string): Promise<{ success: boolean; message?: string; error?: string; }> {
    throw new Error("Method not implemented.");
  }
  async getAllProblems(): Promise<{ success: boolean; message?: string; error?: string; problems?: Problem[]; }> {
    throw new Error("Method not implemented.");
  }
  async getSingleProblem(ProblemId: string): Promise<{ success: boolean; message?: string; error?: string; problem?: Problem; }> {
    throw new Error("Method not implemented.");
  }
  
}