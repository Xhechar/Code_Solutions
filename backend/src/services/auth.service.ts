import { PrismaClient, Recovery } from "@prisma/client";
import { AuthInterface } from "../interfaces/methods.interfaces";
import { LoginDetails, MessageOptions, RecoveryDetails } from "../interfaces/solutions.interfaces";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import * as crypto from 'crypto';
import { v4 } from "uuid";
import path from "path";
import { sendMail } from "../emails/email_config/email.config";
import ejs from "ejs";

export class AuthService implements AuthInterface{
  prisma = new PrismaClient({
    log: ["error"]
  });
  async loginUser(Logins: LoginDetails): Promise<{ success: boolean; error?: string; message?: string; role?: string; token?: string; }> {
    
    let userExists = await this.prisma.user.findUnique({
      where: {
        Email: Logins.Email
      }
    });

    if (userExists == null) {
      return {
        "success": false,
        'error': 'Email not found. Please register first.'
      }
    }

    if (userExists.IsDeleted == true) {
      return {
        'success': false,
        'error': 'Your account has been deactivated.'
      }
    }

    let passwordMatches: boolean = bcrypt.compareSync(Logins.Password, userExists.Password);

    if (!passwordMatches) {
      return {
        "success": false,
        'error': 'Incorrect password provided.'
      }
    }

    let { FullName, Username, Password, ProfileImage, IsDeleted, IsSolver, IsWelcomed, Notified, Badge, PreviousBadge, ProblemsCount, DateCreated, ...r_user } = userExists;

    let token = jwt.sign({ ...r_user }, process.env.SECRET_KEY as string, {
      expiresIn: '15m'
    });

    return {
      "success": true,
      "message": 'Welcome.Login was successful.',
      "role": userExists.Role,
      "token": token
    }
  }
  async changePassword(Details: RecoveryDetails): Promise<{ success: boolean; error?: string; message?: string; }> {
    
    let userExists = await this.prisma.user.findUnique({
      where: {
        Email: Details.Email
      }
    });

    if (userExists == null) {
      return {
        "success": false,
        'error': 'Email not found. Please register first.'
      }
    }

    if (userExists.IsDeleted) {
      return {
        'success': false,
        'error': 'Your account has been deactivated.'
      }
    }

    let recoveryExists = await this.prisma.recovery.findFirst({
      where: {
        Email: Details.Email,
        RecoveryCode: Details.RecoveryCode
      }
    });

    if (recoveryExists == null) {
      return {
        'success': false,
        'error': 'Invalid recovery code provided.'
      }
    }

    let changePassword = await this.prisma.user.update({
      data: {
        Password: bcrypt.hashSync(Details.NewPassword, 10)
      },
      where: {
        Email: Details.Email
      }
    });

    if (changePassword == null) {
      return {
        'success': false,
        'error': 'Failed to change password.'
      }
    } else {
      return {
        "success": true,
        "message": 'Password changed successfully. Login now.'
      }
    }
  }
  async getAllRecoveries(): Promise<{ success: boolean; error?: string; message?: string; recoveries?: Recovery[] | unknown[]; }> {
    let recoveries = await this.prisma.recovery.findMany();

    if (recoveries == null) {
      return {
        "success": false,
        'error': 'No recoveries found.'
      }
    } else {
      return {
        "success": true,
        "message": 'Recoveries found successfully.',
        "recoveries": recoveries
      }
    }
  }
  async verifyMail(Email: string): Promise<{ success: boolean; error?: string; message?: string; }> {
    
    let userExists = await this.prisma.user.findUnique({
      where: {
        Email: Email
      }
    });

    if (userExists == null) {
      return {
        'success': false,
        'error': 'Email not found. Please register first.'
      }
    }

    if (userExists.IsDeleted) {
      return {
        'success': false,
        'error': 'Your account has been deactivated.'
      }
    }

    let create_recovery = await this.prisma.recovery.create({
      data: {
        RecoveryId: v4(),
        Email: Email,
        RecoveryCode: generateRecoveryCode(8)
      }
    });

    if (create_recovery == null) {
      return {
        'success': false,
        'error': 'Unable to create recovery.'
      }
    } else {

      let mailPath = path.resolve(__dirname, '../email_templates/send.recovery.ejs');

      ejs.renderFile(mailPath, { UserName: userExists.FullName, Code: create_recovery.RecoveryCode }, async (err, data) => {
        try {

          if (err) {
            console.error(err);
            return {
              "success": false,
              'error': 'Failed to send recovery email.'
            }
          } else {

            let messageOptions: MessageOptions = ({
              from: 'no-reply@example.com',
              to: Email,
              subject: 'Password Recovery',
              html: data
            });

            await sendMail(messageOptions);
          }
          
        } catch (error) {
          console.error(error);
        }
      });

      return {
        "success": true,
        "message": 'Recovery code sent successfully. Please check your email.'
      }
    }
  }
  
}

const generateRecoveryCode = (length: number): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  return Array.from({ length }, () => {
    const randomNumber = crypto.randomInt(0, characters.length);
    return characters.charAt(randomNumber);
  }).join('');
}