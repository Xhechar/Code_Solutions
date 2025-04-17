import { Favourite, PrismaClient } from "@prisma/client";
import { FavouriteInterface } from "../interfaces/methods.interfaces";
import { v4 } from "uuid";

export class FavouriteService implements FavouriteInterface {
  prisma = new PrismaClient({
    log: ["error"]
  });

  async addFavourite(UserId: string, ProblemId: string): Promise<{ success: boolean; message?: string; error?: string; }> {

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

    let favouriteExists = await this.prisma.favourite.findFirst({
      where: {
        UserId: userExists.UserId,
        ProblemId: problemExists.ProblemId
      }
    });

    if (favouriteExists != null) {
      return {
        'success': false,
        'error': 'Problem already in favourites.'
      }
    }

    let create = await this.prisma.favourite.create({
      data: {
        FavouriteId: v4(),
        UserId: userExists.UserId,
        ProblemId: problemExists.ProblemId
      }
    });

    if (!create) {
      return {
        'success': false,
        'error': 'Failed to add favourite.'
      }
    } else {
      return {
        'success': true,
        'message': 'added successfully to favourites.'
      }
    }
  }
  async removeFavourite(FavouriteId: string): Promise<{ success: boolean; message?: string; error?: string; }> {
    
    let favouriteExists = await this.prisma.favourite.findUnique({
      where: {
        FavouriteId
      }
    });

    if (favouriteExists == null) {
      return {
        'success': false,
        'error': 'Favourite not found.'
      }
    }

    let delete_ = await this.prisma.favourite.delete({
      where: {
        FavouriteId: favouriteExists.FavouriteId
      }
    });

    if (!delete_) {
      return {
        'success': false,
        'error': 'Unable to remove from favourite.'
      }
    } else {
      return {
        'success': true,
        'message': 'Item removed successfully from favourites.'
      }
    }
  }
  async getFavouritesByUser(UserId: string): Promise<{ success: boolean; message?: string; error?: string; favourites?: Favourite[]; }> {
    
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

    let favourites = await this.prisma.favourite.findMany({
      where: {
        UserId: userExists.UserId
      },
      include: {
        Problem: true
      }
    });

    if (favourites == null) {
      return {
        'success': false,
        'error': 'No favourites found.'
      }
    } else {
      return {
        'success': true,
        'message': 'Favourites fetched successfully.',
        'favourites': favourites
      }
    }
  }
  
}