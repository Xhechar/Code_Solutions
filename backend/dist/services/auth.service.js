"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto = __importStar(require("crypto"));
const uuid_1 = require("uuid");
const path_1 = __importDefault(require("path"));
const email_config_1 = require("../emails/email_config/email.config");
const ejs_1 = __importDefault(require("ejs"));
class AuthService {
    prisma = new client_1.PrismaClient({
        log: ["error"]
    });
    async loginUser(Logins) {
        let userExists = await this.prisma.user.findUnique({
            where: {
                Email: Logins.Email
            }
        });
        if (userExists == null) {
            return {
                "success": false,
                'error': 'Email not found. Please register first.'
            };
        }
        if (userExists.IsDeleted == true) {
            return {
                'success': false,
                'error': 'Your account has been deactivated.'
            };
        }
        let passwordMatches = bcrypt_1.default.compareSync(Logins.Password, userExists.Password);
        if (!passwordMatches) {
            return {
                "success": false,
                'error': 'Incorrect password provided.'
            };
        }
        let { FullName, Username, Password, ProfileImage, IsDeleted, IsSolver, IsWelcomed, Notified, Badge, PreviousBadge, ProblemsCount, DateCreated, ...r_user } = userExists;
        let token = jsonwebtoken_1.default.sign({ ...r_user }, process.env.SECRET_KEY, {
            expiresIn: '15m'
        });
        return {
            "success": true,
            "message": 'Welcome.Login was successful.',
            "role": userExists.Role,
            "token": token
        };
    }
    async changePassword(Details) {
        let userExists = await this.prisma.user.findUnique({
            where: {
                Email: Details.Email
            }
        });
        if (userExists == null) {
            return {
                "success": false,
                'error': 'Email not found. Please register first.'
            };
        }
        if (userExists.IsDeleted) {
            return {
                'success': false,
                'error': 'Your account has been deactivated.'
            };
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
            };
        }
        let changePassword = await this.prisma.user.update({
            data: {
                Password: bcrypt_1.default.hashSync(Details.NewPassword, 10)
            },
            where: {
                Email: Details.Email
            }
        });
        if (changePassword == null) {
            return {
                'success': false,
                'error': 'Failed to change password.'
            };
        }
        else {
            return {
                "success": true,
                "message": 'Password changed successfully. Login now.'
            };
        }
    }
    async getAllRecoveries() {
        let recoveries = await this.prisma.recovery.findMany();
        if (recoveries == null) {
            return {
                "success": false,
                'error': 'No recoveries found.'
            };
        }
        else {
            return {
                "success": true,
                "message": 'Recoveries found successfully.',
                "recoveries": recoveries
            };
        }
    }
    async verifyMail(Email) {
        let userExists = await this.prisma.user.findUnique({
            where: {
                Email: Email
            }
        });
        if (userExists == null) {
            return {
                'success': false,
                'error': 'Email not found. Please register first.'
            };
        }
        if (userExists.IsDeleted) {
            return {
                'success': false,
                'error': 'Your account has been deactivated.'
            };
        }
        let create_recovery = await this.prisma.recovery.create({
            data: {
                RecoveryId: (0, uuid_1.v4)(),
                Email: Email,
                RecoveryCode: generateRecoveryCode(6)
            }
        });
        if (create_recovery == null) {
            return {
                'success': false,
                'error': 'Unable to create recovery.'
            };
        }
        else {
            let mailPath = path_1.default.resolve(__dirname, '../../email_templates/send.recovery.ejs');
            ejs_1.default.renderFile(mailPath, { UserName: userExists.FullName, Code: create_recovery.RecoveryCode }, async (err, data) => {
                try {
                    if (err) {
                        console.error(err);
                        return {
                            "success": false,
                            'error': 'Failed to send recovery email.'
                        };
                    }
                    else {
                        let messageOptions = ({
                            from: 'no-reply@example.com',
                            to: Email,
                            subject: 'Password Recovery',
                            html: data
                        });
                        await (0, email_config_1.sendMail)(messageOptions);
                    }
                }
                catch (error) {
                    console.error(error);
                }
            });
            return {
                "success": true,
                "message": 'Recovery code sent successfully. Please check your email.'
            };
        }
    }
}
exports.AuthService = AuthService;
const generateRecoveryCode = (length) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    return Array.from({ length }, () => {
        const randomNumber = crypto.randomInt(0, characters.length);
        return characters.charAt(randomNumber);
    }).join('');
};
