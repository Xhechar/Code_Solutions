"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notifyAccountDeactivation = void 0;
const client_1 = require("@prisma/client");
const ejs_1 = __importDefault(require("ejs"));
const path_1 = __importDefault(require("path"));
const email_config_1 = require("../email_config/email.config");
const prisma = new client_1.PrismaClient({
    log: ["error"]
});
const notifyAccountDeactivation = async () => {
    const activatedUsers = await prisma.user.findMany({
        where: {
            IsDeleted: false,
            Notified: true
        }
    });
    if (!activatedUsers) {
        console.log("No users found with unnotified activation.");
    }
    if (activatedUsers.length == 0) {
        console.log("All users have been notified about their activation.");
    }
    for (let user of activatedUsers) {
        let mailPath = path_1.default.resolve(__dirname, '../email_templates/notify.account.activation.ejs');
        ejs_1.default.renderFile(mailPath, { UserName: user.FullName }, async (error, data) => {
            try {
                if (error) {
                    console.log("Unable to render email template. ", error);
                }
                let messageOptions = {
                    from: process.env.EMAIL,
                    to: user.Email,
                    subject: "Account Activation",
                    html: data
                };
                await (0, email_config_1.sendMail)(messageOptions);
                let update = await prisma.user.update({
                    where: {
                        UserId: user.UserId
                    },
                    data: {
                        Notified: false
                    }
                });
                if (!update) {
                    console.log("Unable to mark user as notified about activation.");
                }
                else {
                    console.log("Notified user about their activation: ", user.FullName);
                }
            }
            catch (error) {
                console.log("Unable to send activation mail to user. ", error);
            }
        });
    }
};
exports.notifyAccountDeactivation = notifyAccountDeactivation;
