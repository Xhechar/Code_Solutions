import { PrismaClient } from "@prisma/client";
import { UserInterface } from "../interfaces/methods.interfaces";
import { User } from "../interfaces/solutions.interfaces";
import { v4 } from "uuid";
import bcrypt from 'bcrypt';
import { UserRegisterationSchema, UserUpdateSchema } from "../validators/body.input.validators";

export class UserService implements UserInterface {
  prisma = new PrismaClient({
    log: ["error"]
  });
  async createUser(user: User): Promise<{ success: boolean; message?: string; error?: string; }> {

    let { error } = UserRegisterationSchema.validate(user);

    if (error) {
      return ({
        'success': false,
        'error': error.details[0].message
      });
    };
    
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
        }
      } else {
        return {
          'success': false,
          'error': 'Sorry, your account has been deactivated. Contact us for assistance.'
        }
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
        }
      } else {
        return {
          'success': false,
          'error': 'Sorry, your account has been deactivated. Contact us for assistance.'
        }
      }
    }

    let {UserId, Password, IsDeleted, Notified, IsSolver, IsWelcomed, DateCreated, Badge, PreviousBadge, ProblemsCount, Role, Comments, Favourites, Histories, Problems, Solutions, ...r_user} = user;

    let createUser = await this.prisma.user.create({
      data: {
        UserId: v4(),
        Password: bcrypt.hashSync(user.Password, 10),
        ...r_user
      }
    });

    if (createUser == null) {
      return {
        'success': false,
        'error': 'Unable to create account, try again later.'
      }
    } else {
      return {
        'success': true,
        'message': 'Welcome to Code Solutions, Account created successfully.'
      }
    }
  }
  async updateUser(userId: string, user: Partial<User>): Promise<{ success: boolean; message?: string; error?: string; }> {
  
    let { error } = UserUpdateSchema.validate(user);

    if (error) {
      return ({
        'success': false,
        'error': error.details[0].message
      });
    };
    
    let userExists = await this.prisma.user.findUnique({
      where: {
        UserId: userId
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
        'error': 'Sorry, your account has been deactivated. Contact us for assistance.'
      }
    }

    let {UserId, Password, IsDeleted, Notified, IsSolver, IsWelcomed, DateCreated, Badge, PreviousBadge, ProblemsCount, Role, Comments, Favourites, Histories, Problems, Solutions, ...r_user} = user;

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
      }
    } else {
      return {
        'success': true,
       'message': 'User updated successfully.'
      }
    }
  }

  public async updateProfileImage(UserId: string, ProfilePhoto: string) {
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
        }
      } else {
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
          }
        } else {
          return {
            'success': false,
            'error': 'Unable to update profile image.'
          }
        }
      }
      
    } else {
      return {
        'success': false,
        'error': 'User is not found'
      }
    }
  }

  async softDeleteUser(UserId: string): Promise<{ success: boolean; message?: string; error?: string; }> {
    
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
        'error': 'User is already soft deleted.'
      }
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
      }
    } else {
      return {
        'success': true,
       'message': 'User soft deleted successfully.'
      }
    }
  }
  async deleteUser(UserId: string): Promise<{ success: boolean; message?: string; error?: string; }> {
    
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

    let deleteUser = await this.prisma.user.delete({
      where: {
        UserId
      }
    });

    if (deleteUser == null) {
      return {
        'success': false,
        'error': 'Unable to delete account, try again later.'
      }
    } else {
      return {
        'success': true,
       'message': 'User deleted successfully.'
      }
    }
  }
  async restoreUser(UserId: string): Promise<{ success: boolean; message?: string; error?: string; }> {
    
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

    if (userExists.IsDeleted == false) {
      return {
        'success': false,
        'error': 'User is already active.'
      }
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
      }
    } else {
      return {
        'success': true,
       'message': 'User restored successfully.'
      }
    }
  }
  async getSingleUser(UserId: string): Promise<{ success: boolean; message?: string; error?: string; user?: User | unknown; }> {

    let userExists = await this.prisma.user.findUnique({
      where: {
        UserId
      },
      include: {
        Problems: true,
        Comments: true,
        Solutions: true,
        Histories: true,
        Favourites: true
      }
    });

    if (userExists == null) {
      return {
        'success': false,
        'error': 'Account not found.'
      }
    }

    if (userExists.IsDeleted) {
      return {
        'success': false,
        'error': 'Sorry, your account has been deactivated. Contact us for assistance.'
      }
    }

    return {
      'success': true,
      'message': 'User retrieved successfully.',
      'user': userExists
    }
  }
  async getAllUsers(): Promise<{ success: boolean; message?: string; error?: string; users?: User[] | unknown[]; }> {
    
    let users = await this.prisma.user.findMany({
      where: {
        Role: {
          not: 'admin'
        }
      },
      include: {
        Problems: true,
        Favourites: true,
        Solutions: true,
        Histories: true
      }
    });

    if (users == null) {
      return {
        'success': false,
        'error': 'No accounts found.'
      }
    }

    return {
      'success': true,
      'message': 'All accounts retrieved successfully.',
      'users': users
    }
  }
  async getSoftDeletedUsers(): Promise<{ success: boolean; message?: string; error?: string; users?: User[] | unknown[]; }> {
    
    let users = await this.prisma.user.findMany({
      where: {
        IsDeleted: true
      },
      include: {
        Problems: true,
        Favourites: true,
        Solutions: true,
        Histories: true
      }
    });

    if (users == null) {
      return {
        'success': false,
        'error': 'No soft deleted accounts found.'
      }
    }

    return {
      'success': true,
      'message': 'All soft deleted accounts retrieved successfully.',
      'users': users
    }
  }
  async updateUserRole(UserId: string): Promise<{ success: boolean; message?: string; error?: string; }> {
    
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

    let role = userExists.Role == 'user' ? 'admin' : 'user'

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
      }
    } else {
      return {
        'success': true,
        'message': `User role updated successfully to ${role}.`
      }
    }
  }
  async bulkDeleteUsers(UserIds: string[]): Promise<{ success: boolean; message?: string; error?: string; }> {
    
    let userExists = await this.prisma.user.findMany({
      where: {
        UserId: { in: UserIds }
      }
    });

    if (userExists.length!== UserIds.length) {
      return {
        'success': false,
        'error': 'One or more users not found.'
      }
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
      }
    } else {
      return {
        'success': true,
       'message': `${softDeleteUsers.count} user(s) soft deleted successfully.`
      }
    }
  }
}