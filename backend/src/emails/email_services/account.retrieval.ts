import { PrismaClient } from "@prisma/client";
import ejs from "ejs";
import path from "path";
import { MessageOptions } from "../../interfaces/solutions.interfaces";
import { sendMail } from "../email_config/email.config";

const prisma = new PrismaClient({
  log: ["error"]
});

export const notifyAccountDeactivation = async () => {
  
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
    
    let mailPath = path.resolve(__dirname, '../email_templates/notify.account.activation.ejs');

    ejs.renderFile(mailPath, { UserName: user.FullName }, async (error, data) => {
      try {

        if (error) {
          console.log("Unable to render email template. ", error);
        }

        let messageOptions: MessageOptions = {
          from: process.env.EMAIL as string,
          to: user.Email,
          subject: "Account Activation",
          html: data
        };

        await sendMail(messageOptions);

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
        } else {
          console.log("Notified user about their activation: ", user.FullName);
        }
        
      } catch (error) {
        console.log("Unable to send activation mail to user. ", error);
      }
    })
  }
}