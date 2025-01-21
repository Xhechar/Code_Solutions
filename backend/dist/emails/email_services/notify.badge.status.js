"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserBadge = void 0;
const client_1 = require("@prisma/client");
const enum_1 = require("../../enums/enum");
const ejs_1 = __importDefault(require("ejs"));
const path_1 = __importDefault(require("path"));
const email_config_1 = require("../email_config/email.config");
const prisma = new client_1.PrismaClient({
    log: ["error"]
});
const updateUserBadge = async () => {
    let users = await prisma.user.findMany({
        where: {
            IsDeleted: false,
            ProblemsCount: {
                gt: 0
            }
        }
    });
    if (users == null) {
        console.log("No users available to notify about badge change");
    }
    let updatedCount = 0;
    for (let user of users) {
        let badge = user.ProblemsCount > 100 ? enum_1.Badge.GOLD : (user.ProblemsCount >= 50 ? enum_1.Badge.SILVER : enum_1.Badge.NORMAL);
        let updateUser = await prisma.user.update({
            where: {
                UserId: user.UserId
            },
            data: {
                Badge: badge,
                PreviousBadge: user.Badge
            }
        });
        if (updateUser == null) {
            return {
                'success': false,
                'error': 'Unable to update user badge, try again later.'
            };
        }
        else {
            updatedCount++;
            let file = path_1.default.resolve(__dirname, '../email_templates/notify.badge.change.ejs');
            ejs_1.default.renderFile(file, { UserName: user.FullName, BadgeName: updateUser.Badge }, async (err, data) => {
                try {
                    let messageOptions = ({
                        from: process.env.Email,
                        to: user.Email,
                        subject: 'Badge Update Notification',
                        html: data
                    });
                    await (0, email_config_1.sendMail)(messageOptions);
                }
                catch (error) {
                    console.log("Error sending badge change mail");
                    throw err;
                }
            });
        }
    }
};
exports.updateUserBadge = updateUserBadge;
