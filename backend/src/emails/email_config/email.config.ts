
import nodemailer from 'nodemailer';
import { MailConfigurations, MessageOptions } from '../../interfaces/solutions.interfaces';

let mailConfigurations: MailConfigurations = ({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  requireTLS: true,
  auth: {
    user: process.env.EMAIL as string,
    pass: process.env.PASSWORD as string
  }
});

function createTransporter(config: MailConfigurations) {
  return nodemailer.createTransport({
    service: config.service,
    host: config.host,
    port: config.port,
    secure: config.requireTLS,
    auth: config.auth
  });
}

export const sendMail = async (messageOptions: MessageOptions) => {
  
  const transporter = createTransporter(mailConfigurations);

  try {

    await transporter.verify();

    transporter.sendMail(messageOptions, (err, info) => {
      if (err) {
        console.error('Error sending email:', err);
      } else {
        console.log('Email sent:', info.response);
      }
    });
  } catch (error) {
    console.error('Error creating transporter:', error);
    throw error;
  }
}