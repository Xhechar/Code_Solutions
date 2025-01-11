import { PrismaClient, Prisma } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";
import { HistoryInterface } from "../interfaces/methods.interfaces";
import { v4 } from "uuid";

export class HistoryService implements HistoryInterface {
  prisma = new PrismaClient({
    log: ["error"]
  });

  async addHistory(UserId: string, ProblemId: string): Promise<{ success: boolean; message?: string; error?: string; }> {
    
    let userExists = await this.prisma.user.findUnique({
      where: {
        UserId
      }
    });

    if (userExists == null) {
      return {
        'success': false,
        'error': 'User not found.'
      }
    }

    if (userExists.IsDeleted) {
      return {
        'success': false,
        'error': 'Sorry, the user account has been deactivated.'
      }
    }

    let problemExists = await this.prisma.problem.findUnique({
      where: {
        ProblemId
      }
    });

    if (problemExists == null) {
      return {
        'success': false,
        'error': 'Problem not found.'
      }
    }

    let add = await this.prisma.history.create({
      data: {
        HistoryId: v4(),
        UserId,
        ProblemId
      }
    });

    if (add) {
      return {
        success: true,
        message: 'History added successfully.'
      };
    } else {
      return {
        success: false,
        error: 'Unable to add history.'
      };
    }
  }
  async getHistoryByUser(UserId: string): Promise<{ success: boolean; message?: string; error?: string; histories?: History[] | unknown[]; }> {
    
    let userExists = await this.prisma.user.findUnique({
      where: {
        UserId
      }
    });

    if (userExists == null) {
      return {
        'success': false,
        'error': 'User not found.'
      }
    }

    if (userExists.IsDeleted) {
      return {
        'success': false,
        'error': 'Sorry, the user account has been deactivated.'
      }
    }

    let histories = await this.prisma.history.findMany({
      where: {
        UserId
      }
    });

    if (histories == null) {
      return {
        'success': false,
        'error': 'No history found.'
      }
    } else {
      return {
        'success': false,
        'message': 'History successfully retrieved.',
        'histories': histories
      };
    }
  }
  async clearHistory(UserId: string): Promise<{ success: boolean; message?: string; error?: string; }> {
    
    let userExists = await this.prisma.user.findUnique({
      where: {
        UserId
      }
    });

    if (userExists == null) {
      return {
        'success': false,
        'error': 'User not found.'
      }
    }

    if (userExists.IsDeleted) {
      return {
        'success': false,
        'error': 'Sorry, the user account has been deactivated.'
      }
    }

    let histories = await this.prisma.history.deleteMany({
      where: {
        UserId
      }
    });

    if (histories.count > 0) {
      return {
        success: true,
        message: 'History cleared successfully.'
      };
    } else {
      return {
        success: false,
        error: 'No history found to clear.'
      };
    }
  }
}