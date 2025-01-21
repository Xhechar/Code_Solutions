"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notifyAccountTermination = void 0;
const client_1 = require("@prisma/client");
const ejs_1 = __importDefault(require("ejs"));
const path_1 = __importDefault(require("path"));
const email_config_1 = require("../email_config/email.config");
const prisma = new client_1.PrismaClient({
    log: ["error"]
});
const notifyAccountTermination = async () => {
    let users = await prisma.user.findMany({
        where: {
            IsDeleted: true,
            Notified: false
        }
    });
    if (users == null) {
        console.log("Unable to locate users whose accounts are terminated");
    }
    if (users.length == 0) {
        console.log("All users recieved termination account mails");
    }
    for (let user of users) {
        let mailPath = path_1.default.resolve(__dirname, '../email_templates/notify.account.termination.ejs');
        ejs_1.default.renderFile(mailPath, { UserName: user.FullName }, async (error, data) => {
            try {
                if (error) {
                    console.log("Unable to send account deativation mail", error);
                }
                let messageOptions = ({
                    from: process.env.EMAIL,
                    to: user.Email,
                    subject: 'Account Termination',
                    html: data
                });
                await (0, email_config_1.sendMail)(messageOptions);
                let update = await prisma.user.update({
                    where: {
                        UserId: user.UserId
                    },
                    data: {
                        Notified: true
                    }
                });
                if (update == null) {
                    console.log("Unable to update user's notification status");
                }
                else {
                    console.log("Account deactivation mail sent to user", user.FullName);
                }
            }
            catch (error) {
                console.log("An error occured during sendimg acount deactivation mail to user", error);
            }
        });
    }
};
exports.notifyAccountTermination = notifyAccountTermination;
