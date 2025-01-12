
import Express, { json, NextFunction, Request, Response } from "express";
import cors from 'cors';
import dotenv from 'dotenv';
import cron from 'node-cron';
import { updateUserBadge } from "./emails/email_services/notify.badge.status";
import { welcomeUser } from "./emails/email_services/welcome.user";
import { notifyAccountTermination } from "./emails/email_services/account.termination";
import { notifyAccountDeactivation } from "./emails/email_services/account.retrieval";

dotenv.config();

const app = Express();

app.use(json());
app.use(cors());

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({ message: err.message });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
})

const email = Express();

email.listen(3001, async () => {
  console.log("Email server is running on port 3001");

  cron.schedule('*/5 * * * * *', async () => {
    console.log("Checking the database");
    
    await updateUserBadge();
    
    console.log("Badge check completed");

    await welcomeUser();
    
    console.log("Welcome email sent");

    await notifyAccountTermination();
    
    console.log("Account termination notification sent");

    await notifyAccountDeactivation();

    console.log("Account retrieval notification sent");
  });
});