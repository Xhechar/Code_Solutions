import { PrismaClient } from "@prisma/client";
import { Badge } from "../../enums/enum";
import ejs from "ejs";
import path from "path";
import { log } from "console";
import { MessageOptions } from "../../interfaces/solutions.interfaces";
import { sendMail } from "../email_config/email.config";

const prisma = new PrismaClient({
  log: ["error"]
});

export const updateUserBadge = async() => {
    
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

  let updatedCount: number = 0;

  for (let user of users) {
    let badge: string = user.ProblemsCount > 100? Badge.GOLD : (user.ProblemsCount >= 50? Badge.SILVER : Badge.NORMAL);
    
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
      }
    } else {
      updatedCount++;

      let file = path.resolve(__dirname, '../email_templates/notify.badge.change.ejs');

      ejs.renderFile(file, { UserName: user.FullName, BadgeName: updateUser.Badge }, async (err, data) => {
        try {

          let messageOptions: MessageOptions = ({
            from: process.env.Email as string,
            to: user.Email,
            subject: 'Badge Update Notification',
            html: data
          });

          await sendMail(messageOptions);
          
        } catch (error) {
          console.log("Error sending badge change mail");
          throw err
        }
      });
    }
  }
}