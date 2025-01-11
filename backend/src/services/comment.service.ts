import { Comment, PrismaClient } from "@prisma/client";
import { CommentInterface } from "../interfaces/methods.interfaces";
import { v4 } from "uuid";

export class CommentService implements CommentInterface{
  prisma = new PrismaClient({
    log: ["error"]
  });

  async createComment(userId: string, problemId: string, comment: Comment): Promise<{ success: boolean; message?: string; error?: string; }> {

    let userExists = await this.prisma.user.findUnique({
      where: {
        UserId: userId
      }
    });

    if (userExists == null) {
      return {
        'success': false,
        'error': 'User does not exist'
      }
    }

    if (userExists.IsDeleted) {
      return {
        'success': false,
        'error': 'Sorry, your account has been deactivated. Contat us for assistance.'
      }
    }

    let problemExists = await this.prisma.problem.findUnique({
      where: {
        ProblemId: problemId
      }
    });

    if (problemExists == null) {
      return {
        'success': false,
        'error': 'Problem specified does not exist'
      }
    }
 
    let {CommentId, UserId, ProblemId, DatePosted, ...r_comment} = comment;

    let create = await this.prisma.comment.create({
      data: {
        CommentId: v4(),
        ProblemId: problemExists.ProblemId,
        UserId: userExists.UserId,
        ...r_comment
      }
    });

    if (create == null) {
      return {
        'success': false,
        'error': 'Unable to create comment.'
      }
    } else {
      return {
        'success': true,
        'message': 'Comment submitted successfully.'
      }
    }
  }
  async updateComment(UserId: string, CommentId: string, content: string): Promise<{ success: boolean; message?: string; error?: string; }> {
    
    let userExists = await this.prisma.user.findUnique({
      where: {
        UserId
      }
    });

    if (userExists == null) {
      return {
        'success': false,
        'error': 'User does not exist'
      }
    }

    if (userExists.IsDeleted) {
      return {
        'success': false,
        'error': 'Sorry, your account has been deactivated. Contat us for assistance.'
      }
    }

    let commentExists = await this.prisma.comment.findUnique({
      where: {
        CommentId,
        UserId
      }
    });

    if (commentExists == null) {
      return {
        'success': false,
        'error': 'Comment specified does not exist or you do not have permission to update it.'
      }
    }

    let update = await this.prisma.comment.update({
      where: {
        CommentId
      },
      data: {
        Content: content
      }
    });

    if (update == null) {
      return {
        'success': false,
        'error': 'Unable to update comment.'
      }
    } else {
      return {
        'success': true,
        'message': 'Comment updated successfully.'
      }
    }
  }
  async deleteComment(CommentId: string): Promise<{ success: boolean; message?: string; error?: string; }> {
    
    let commentExists = await this.prisma.comment.findUnique({
      where: {
        CommentId
      }
    });

    if (commentExists == null) {
      return {
        'success': false,
        'error': 'Comment specified does not exist.'
      }
    }

    let delete_ = await this.prisma.comment.delete({
      where: {
        CommentId
      }
    });

    if (delete_ == null) {
      return {
        'success': false,
        'error': 'Unable to delete comment.'
      }
    } else {
      return {
        'success': true,
        'message': 'Comment deleted successfully.'
      }
    }
  }
  async getCommentsByProblem(ProblemId: string): Promise<{ success: boolean; message?: string; error?: string; comments?: Comment[]; }> {
    
    let problemExists = await this.prisma.problem.findUnique({
      where: {
        ProblemId
      }
    });

    if (problemExists == null) {
      return {
        'success': false,
        'error': 'Problem specified does not exist.'
      }
    }

    let comments = await this.prisma.comment.findMany({
      where: {
        ProblemId
      },
      include: {
        User: true,
        Problem: true
      }
    });

    if (comments == null) {
      return {
        'success': false,
        'error': 'Unable to retrieve comments.'
      }
    } else {
      return {
        'success': true,
        'message': 'Comments retrieved successfully.',
        'comments': comments
      }
    }
  }
  
}