"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const client_1 = require("@prisma/client");
const uuid_1 = require("uuid");
const bcrypt_1 = __importDefault(require("bcrypt"));
class UserService {
    prisma = new client_1.PrismaClient({
        log: ["error"]
    });
    async createUser(user) {
        let emailExists = await this.prisma.user.findUnique({
            where: {
                Email: user.Email
            }
        });
        if (emailExists) {
            if (emailExists.IsDeleted == false) {
                return {
                    'success': false,
                    'error': 'The email provided exists, Login instead.'
                };
            }
            else {
                return {
                    'success': false,
                    'error': 'Sorry, your account has been deactivated. Contact us for assistance.'
                };
            }
        }
        let usernameExists = await this.prisma.user.findUnique({
            where: {
                Username: user.Username
            }
        });
        if (usernameExists) {
            if (usernameExists.IsDeleted == false) {
                return {
                    'success': false,
                    'error': 'The username provided exists, Login instead.'
                };
            }
            else {
                return {
                    'success': false,
                    'error': 'Sorry, your account has been deactivated. Contact us for assistance.'
                };
            }
        }
        let { UserId, Password, IsDeleted, Notified, IsSolver, IsWelcomed, DateCreated, Badge, PreviousBadge, ProblemsCount, Role, Comments, Favourites, Histories, Problems, Solutions, ...r_user } = user;
        let createUser = await this.prisma.user.create({
            data: {
                UserId: (0, uuid_1.v4)(),
                Password: bcrypt_1.default.hashSync(user.Password, 10),
                ...r_user
            }
        });
        if (createUser == null) {
            return {
                'success': false,
                'error': 'Unable to create account, try again later.'
            };
        }
        else {
            return {
                'success': true,
                'message': 'Welcome to Code Solutions, Account created successfully.'
            };
        }
    }
    async updateUser(userId, user) {
        let userExists = await this.prisma.user.findUnique({
            where: {
                UserId: userId
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
                'error': 'Sorry, your account has been deactivated. Contact us for assistance.'
            };
        }
        let { UserId, Password, IsDeleted, Notified, IsSolver, IsWelcomed, DateCreated, Badge, PreviousBadge, ProblemsCount, Role, Comments, Favourites, Histories, Problems, Solutions, ...r_user } = user;
        let updateUser = await this.prisma.user.update({
            where: {
                UserId: userExists.UserId
            },
            data: {
                ...r_user
            }
        });
        if (updateUser == null) {
            return {
                'success': false,
                'error': 'Unable to update your account, try again later.'
            };
        }
        else {
            return {
                'success': true,
                'message': 'User updated successfully.'
            };
        }
    }
    async updateProfileImage(UserId, ProfilePhoto) {
        let userExists = await this.prisma.user.findUnique({
            where: {
                UserId
            }
        });
        if (userExists) {
            if (userExists.IsDeleted) {
                return {
                    'success': false,
                    'error': 'Update failed because account is terminated. Contact admin'
                };
            }
            else {
                let updateProfileImage = await this.prisma.user.update({
                    data: {
                        ProfileImage: ProfilePhoto
                    },
                    where: {
                        UserId
                    }
                });
                if (updateProfileImage) {
                    return {
                        'success': true,
                        'message': 'Profile updated successfully'
                    };
                }
                else {
                    return {
                        'success': false,
                        'error': 'Unable to update profile image.'
                    };
                }
            }
        }
        else {
            return {
                'success': false,
                'error': 'User is not found'
            };
        }
    }
    async softDeleteUser(UserId) {
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
                'error': 'User is already soft deleted.'
            };
        }
        let softDeleteUser = await this.prisma.user.update({
            where: {
                UserId
            },
            data: {
                IsDeleted: true
            }
        });
        if (softDeleteUser == null) {
            return {
                'success': false,
                'error': 'Unable to soft delete account, try again later.'
            };
        }
        else {
            return {
                'success': true,
                'message': 'User soft deleted successfully.'
            };
        }
    }
    async deleteUser(UserId) {
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
        let deleteUser = await this.prisma.user.delete({
            where: {
                UserId
            }
        });
        if (deleteUser == null) {
            return {
                'success': false,
                'error': 'Unable to delete account, try again later.'
            };
        }
        else {
            return {
                'success': true,
                'message': 'User deleted successfully.'
            };
        }
    }
    async restoreUser(UserId) {
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
        if (userExists.IsDeleted == false) {
            return {
                'success': false,
                'error': 'User is already active.'
            };
        }
        let restoreUser = await this.prisma.user.update({
            where: {
                UserId
            },
            data: {
                IsDeleted: false
            }
        });
        if (restoreUser == null) {
            return {
                'success': false,
                'error': 'Unable to restore account, try again later.'
            };
        }
        else {
            return {
                'success': true,
                'message': 'User restored successfully.'
            };
        }
    }
    async getSingleUser(UserId) {
        let userExists = await this.prisma.user.findUnique({
            where: {
                UserId
            }
        });
        if (userExists == null) {
            return {
                'success': false,
                'error': 'Account not found.'
            };
        }
        if (userExists.IsDeleted) {
            return {
                'success': false,
                'error': 'Sorry, your account has been deactivated. Contact us for assistance.'
            };
        }
        return {
            'success': true,
            'message': 'User retrieved successfully.',
            'user': userExists
        };
    }
    async getAllUsers() {
        let users = await this.prisma.user.findMany({
            where: {
                Role: {
                    not: 'admin'
                }
            }
        });
        if (users == null) {
            return {
                'success': false,
                'error': 'No accounts found.'
            };
        }
        return {
            'success': true,
            'message': 'All accounts retrieved successfully.',
            'users': users
        };
    }
    async getSoftDeletedUsers() {
        let users = await this.prisma.user.findMany({
            where: {
                IsDeleted: true
            }
        });
        if (users == null) {
            return {
                'success': false,
                'error': 'No soft deleted accounts found.'
            };
        }
        return {
            'success': true,
            'message': 'All soft deleted accounts retrieved successfully.',
            'users': users
        };
    }
    async updateUserRole(UserId) {
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
        let role = userExists.Role == 'user' ? 'admin' : 'user';
        let updateUserRole = await this.prisma.user.update({
            where: {
                UserId
            },
            data: {
                Role: role
            }
        });
        if (updateUserRole == null) {
            return {
                'success': false,
                'error': 'Unable to update user role, try again later.'
            };
        }
        else {
            return {
                'success': true,
                'message': `User role updated successfully to ${role}.`
            };
        }
    }
    async bulkDeleteUsers(UserIds) {
        let userExists = await this.prisma.user.findMany({
            where: {
                UserId: { in: UserIds }
            }
        });
        if (userExists.length !== UserIds.length) {
            return {
                'success': false,
                'error': 'One or more users not found.'
            };
        }
        let softDeleteUsers = await this.prisma.user.updateMany({
            where: {
                UserId: { in: UserIds }
            },
            data: {
                IsDeleted: true
            }
        });
        if (softDeleteUsers.count === 0) {
            return {
                'success': false,
                'error': 'Unable to soft delete accounts, try again later.'
            };
        }
        else {
            return {
                'success': true,
                'message': `${softDeleteUsers.count} user(s) soft deleted successfully.`
            };
        }
    }
}
exports.UserService = UserService;
