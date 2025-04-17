"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FavouriteService = void 0;
const client_1 = require("@prisma/client");
const uuid_1 = require("uuid");
class FavouriteService {
    prisma = new client_1.PrismaClient({
        log: ["error"]
    });
    async addFavourite(UserId, ProblemId) {
        let userExists = await this.prisma.user.findUnique({
            where: {
                UserId
            }
        });
        if (userExists == null) {
            return {
                'success': false,
                'error': 'User not found.'
            };
        }
        if (userExists.IsDeleted) {
            return {
                'success': false,
                'error': 'Sorry, the user account has been deactivated.'
            };
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
            };
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
            };
        }
        let create = await this.prisma.favourite.create({
            data: {
                FavouriteId: (0, uuid_1.v4)(),
                UserId: userExists.UserId,
                ProblemId: problemExists.ProblemId
            }
        });
        if (!create) {
            return {
                'success': false,
                'error': 'Failed to add favourite.'
            };
        }
        else {
            return {
                'success': true,
                'message': 'added successfully to favourites.'
            };
        }
    }
    async removeFavourite(FavouriteId) {
        let favouriteExists = await this.prisma.favourite.findUnique({
            where: {
                FavouriteId
            }
        });
        if (favouriteExists == null) {
            return {
                'success': false,
                'error': 'Favourite not found.'
            };
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
            };
        }
        else {
            return {
                'success': true,
                'message': 'Item removed successfully from favourites.'
            };
        }
    }
    async getFavouritesByUser(UserId) {
        let userExists = await this.prisma.user.findUnique({
            where: {
                UserId
            }
        });
        if (userExists == null) {
            return {
                'success': false,
                'error': 'User not found.'
            };
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
            };
        }
        else {
            return {
                'success': true,
                'message': 'Favourites fetched successfully.',
                'favourites': favourites
            };
        }
    }
}
exports.FavouriteService = FavouriteService;
