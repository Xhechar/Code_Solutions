"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
let mailConfigurations = ({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    requireTLS: true,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
});
function createTransporter(config) {
    return nodemailer_1.default.createTransport(config);
}
const sendMail = async (messageOptions) => {
    const transporter = createTransporter(mailConfigurations);
    try {
        await transporter.verify();
        transporter.sendMail(messageOptions, (err, info) => {
            if (err) {
                console.error('Error sending email:', err);
            }
            else {
                console.log('Email sent:', info.response);
            }
        });
    }
    catch (error) {
        console.error('Error creating transporter:', error);
        throw error;
    }
};
exports.sendMail = sendMail;
