import { PrismaClient, PSG } from "@prisma/client";
import { PSGInterface } from "../interfaces/methods.interfaces";
import { v4 } from "uuid";
import { PSGSchema } from "../validators/body.input.validators";

export class PSGService implements PSGInterface {
  prisma = new PrismaClient({
    log: ["error"]
  });

  async createPSG(ProjectId: string, psg: PSG): Promise<{ success: boolean; message?: string; error?: string; psg?: PSG }> {

    let { error } = PSGSchema.validate(psg);

    if (error) {
      return ({
        'success': false,
        'error': error.message
      });
    };
    
    let projectExists = await this.prisma.projectStructure.findUnique({
      where: {
        ProjectId
      }
    });

    if (projectExists == null) {
      return {
        'success': false,
        'message': 'Project not found'
      };
    }

    let {PSGId, ...r_psg } = psg;

    let create = await this.prisma.pSG.create({
      data: {
        ...r_psg,
        PSGId: v4(),
        ProjectId: projectExists.ProjectId
      }
    });

    if (create == null) {
      return {
        'success': false,
        'error': 'Unable to create structure guide.'
      };
    } else {
      return {
        'success': true,
        'message': 'Structure guide created successfully.',
        'psg': create
      };
    }
  }
  async updatePSG(pSGId: string, psg: Partial<PSG>): Promise<{ success: boolean; message?: string; error?: string; }> {

    let { error } = PSGSchema.validate(psg);

    if (error) {
      return ({
        'success': false,
        'error': error.message
      });
    };
    
    let psgExists = await this.prisma.pSG.findUnique({
      where: {
        PSGId: pSGId
      }
    });

    if (psgExists == null) {
      return {
        'success': false,
        'error': 'Structure guide not found'
      };
    }

    let {PSGId, ProjectId, ...r_psg} = psg;

    let update = await this.prisma.pSG.update({
      where: {
        PSGId: psgExists.PSGId
      },
      data: {
       ...psg
      }
    });

    if (update == null) {
      return {
        'success': false,
        'error': 'Unable to update structure guide.'
      };
    } else {
      return {
        'success': true,
        'message': 'Structure guide updated successfully.'
      };
    }
  }
  async deletePSG(PSGId: string): Promise<{ success: boolean; message?: string; error?: string; }> {
    
    let psgExists = await this.prisma.pSG.findUnique({
      where: {
        PSGId
      }
    });

    if (psgExists == null) {
      return {
        'success': false,
        'error': 'Structure guide not found'
      };
    }

    let delete_ = await this.prisma.pSG.delete({
      where: {
        PSGId: psgExists.PSGId
      }
    });

    if (!delete_) {
      return {
        'success': false,
        'error': 'Unable to remove structure guide.'
      };
    } else {
      return {
        'success': true,
        'message': 'Structure guide removed successfully.'
      };
    }
  }
  async getPSGsByProject(ProjectId: string): Promise<{ success: boolean; message?: string; error?: string; psgs?: PSG[]; }> {
    
    let projectExists = await this.prisma.projectStructure.findUnique({
      where: {
        ProjectId
      }
    });

    if (projectExists == null) {
      return {
        'success': false,
        'error': 'Project not found'
      }
    }

    let psgs = await this.prisma.pSG.findMany({
      where: {
        ProjectId: projectExists.ProjectId
      },
      include: {
        Project: true,
        RelatedProblems: true,
        RelatedSolutions: true
      }
    });

    if (psgs == null) {
      return {
        'success': false,
        'error': 'No structure guides found for this project'
      }
    } else {
      return {
        'success': true,
        'message': 'Structure guides retrieved successfully.',
        'psgs': psgs
      }
    }
  }
  
}