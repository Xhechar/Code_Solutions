import { PrismaClient } from "@prisma/client";
import ejs from "ejs";
import { date } from "joi";
import path from "path";
import { MessageOptions } from "../../interfaces/solutions.interfaces";
import { sendMail } from "../email_config/email.config";

const prisma = new PrismaClient({
  log: ["error"]
});

export const notifyAccountTermination = async () => {

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
    let mailPath = path.resolve(__dirname, '../email_templates/notify.account.termination.ejs');

    ejs.renderFile(mailPath, { UserName: user.FullName }, async (error, data) => {
      try {

        if (error) {
          console.log("Unable to send account deativation mail", error);
        }

        let messageOptions: MessageOptions = ({
          from: process.env.EMAIL as string,
          to: user.Email,
          subject: 'Account Termination',
          html: data
        });

        await sendMail(messageOptions);
        
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
        } else {
          console.log("Account deactivation mail sent to user", user.FullName);
        }
      } catch (error) {
        console.log("An error occured during sendimg acount deactivation mail to user", error);
      }
    });
  }
}