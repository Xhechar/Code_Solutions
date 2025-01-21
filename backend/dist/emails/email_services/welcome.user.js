"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.welcomeUser = void 0;
const client_1 = require("@prisma/client");
const ejs_1 = __importDefault(require("ejs"));
const path_1 = __importDefault(require("path"));
const email_config_1 = require("../email_config/email.config");
const prisma = new client_1.PrismaClient({
    log: ["error"]
});
const welcomeUser = async () => {
    let users = await prisma.user.findMany({
        where: {
            IsWelcomed: false
        }
    });
    if (users == null) {
        console.log("Unable to locate users inorder to send mail");
    }
    if (users.length === 0) {
        console.log("All users have recieved mails");
    }
    for (let user of users) {
        let mailPath = path_1.default.resolve(__dirname, '../email_templates/welcome.ejs');
        ejs_1.default.renderFile(mailPath, { UserName: user.FullName }, async (err, data) => {
            try {
                if (err) {
                    console.error(err);
                }
                let messageOptions = {
                    from: process.env.EMAIL,
                    to: user.Email,
                    subject: 'Welcome To Code Solutions',
                    html: data
                };
                await (0, email_config_1.sendMail)(messageOptions);
                await prisma.user.update({
                    where: {
                        UserId: user.UserId
                    },
                    data: {
                        IsWelcomed: true
                    }
                });
                console.log(`Sent welcome email to ${user.FullName}`);
            }
            catch (error) {
                console.error(`Failed to send welcome email to ${user.FullName}: ${error}`);
                await prisma.user.update({
                    where: {
                        UserId: user.UserId
                    },
                    data: {
                        IsWelcomed: false
                    }
                });
                console.error(`Retrying email sending for ${user.FullName}`);
                await (0, exports.welcomeUser)();
            }
        });
    }
};
exports.welcomeUser = welcomeUser;
