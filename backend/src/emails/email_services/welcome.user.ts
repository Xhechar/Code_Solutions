import { PrismaClient } from "@prisma/client";
import ejs from "ejs";
import path from "path";
import { sendMail } from "../email_config/email.config";
import { MessageOptions } from "../../interfaces/solutions.interfaces";

const prisma = new PrismaClient({
  log: ["error"]
});

export const welcomeUser = async () => {
  
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

    let mailPath = path.resolve(__dirname, '../email_templates/welcome.ejs');

    ejs.renderFile(mailPath, { UserName: user.FullName }, async (err, data) => {
      try {
        if (err) {
          console.error(err);
        }
        
        let messageOptions:MessageOptions = {
          from: process.env.EMAIL as string,
          to: user.Email,
          subject: 'Welcome To Code Solutions',
          html: data
        };

        await sendMail(messageOptions);
        
        await prisma.user.update({
          where: {
            UserId: user.UserId
          },
          data: {
            IsWelcomed: true
          }
        });
        
        console.log(`Sent welcome email to ${user.FullName}`);
        
      } catch (error) {
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
        await welcomeUser();
    
      }
    });
  }
}