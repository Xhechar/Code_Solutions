import { PrismaClient, Prisma } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";
import { StackInterface } from "../interfaces/methods.interfaces";
import { Stack, StackDto } from "../interfaces/solutions.interfaces";
import { v4 } from "uuid";

export class StackService implements StackInterface {
  prisma = new PrismaClient({
    log: ["error"]
  });

  async createStack(stack: Stack): Promise<{ success: boolean; message?: string; error?: string; }> {

    let stackExists = await this.prisma.stack.findUnique({ where: { Name: stack.Name.toLocaleLowerCase() } });

    if (stackExists) {
      return {
        'success': false,
        'error': 'Stack already exists.'
      }
    }
    
    let { StackId, Problems, ProjectStructures, Name, ...r_stack } = stack;

    let create = await this.prisma.stack.create({
      data: {
        StackId: v4(),
        ...r_stack,
        Name: stack.Name.toLocaleLowerCase()
      }
    });

    if (create == null) {
      return {
        'success': false,
        'error': 'Unable to create stack'
      }
    } else {
      return {
        'success': true,
       'message': 'Stack created successfully'
      }
    }
  }
  async updateStack(StackId: string, stack: StackDto): Promise<{ success: boolean; message?: string; error?: string; }> {
    
    let stackExists = await this.prisma.stack.findUnique({ where: { StackId } });

    if (stackExists == null) {
      return {
        'success': false,
        'error': 'Stack not found'
      }
    } else {

      let update = await this.prisma.stack.update({
        where: { StackId },
        data: {
          ...stack
        }
      });

      if (update == null) {
        return {
          'success': false,
          'error': 'Unable to update stack'
        }
      } else {
        return {
          'success': true,
          'message': 'Stack updated successfully'
        }
      }
    }
  }
  async deleteStack(StackId: string): Promise<{ success: boolean; message?: string; error?: string; }> {
    
    let stackExists = await this.prisma.stack.findUnique({ where: { StackId } });

    if (stackExists == null) {
      return {
        'success': false,
        'error': 'Stack not found'
      }
    } else {
      let delete_ = await this.prisma.stack.delete({
        where: { StackId }
      });

      if (delete_ == null) {
        return {
          'success': false,
          'error': 'Unable to delete stack'
        }
      } else {
        return {
          'success': true,
          'message': 'Stack deleted successfully'
        }
      }
    }
  }
  async getAllStacks(): Promise<{ success: boolean; message?: string; error?: string; stacks?: Stack[] }> {
    
    let stacks = await this.prisma.stack.findMany();

    if (stacks == null) {
      return {
        'success': false,
        'error': 'No stacks found'
      }
    } else {
      return {
        'success': true,
        'message': 'Stacks retrieved successfully.',
        'stacks': stacks
      }
    }
  }
  async getSingleStack(StackId: string): Promise<{ success: boolean; message?: string; error?: string; stack?: Stack; }> {
    
    let stackExists = await this.prisma.stack.findUnique({ where: { StackId } });

    if (stackExists == null) {
      return {
        'success': false,
        'error': 'Stack not found'
      }
    }

    return {
      'success': true,
      'message': 'Stack retrieved successfully.',
      'stack': stackExists
    }
  }
  
}