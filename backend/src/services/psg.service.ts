import { PrismaClient } from "@prisma/client";
import { PSGInterface } from "../interfaces/methods.interfaces";
import { PSG } from "../interfaces/solutions.interfaces";

export class PSGService implements PSGInterface {
  prisma = new PrismaClient({
    log: ["error"]
  });

  async createPSG(psg: PSG): Promise<{ success: boolean; message?: string; error?: string; }> {
    throw new Error("Method not implemented.");
  }
  async updatePSG(PSGId: string, psg: Partial<PSG>): Promise<{ success: boolean; message?: string; error?: string; }> {
    throw new Error("Method not implemented.");
  }
  async deletePSG(PSGId: string): Promise<{ success: boolean; message?: string; error?: string; }> {
    throw new Error("Method not implemented.");
  }
  async getPSGsByProject(ProjectId: string): Promise<{ success: boolean; message?: string; error?: string; psgs?: PSG[]; }> {
    throw new Error("Method not implemented.");
  }
  
}