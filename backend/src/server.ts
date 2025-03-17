
import Express, { json, NextFunction, Request, Response } from "express";
import cors from 'cors';
import dotenv from 'dotenv';
import cron from 'node-cron';
import { updateUserBadge } from "./emails/email_services/notify.badge.status";
import { welcomeUser } from "./emails/email_services/welcome.user";
import { notifyAccountTermination } from "./emails/email_services/account.termination";
import { notifyAccountDeactivation } from "./emails/email_services/account.retrieval";
import { authRouter } from "./routers/auth.routes";
import { categoryRouter } from "./routers/category.routes";
import { commentRouter } from "./routers/comment.routes";
import { favouriteRouter } from "./routers/favourite.routes";
import { historyRouter } from "./routers/history.routes";
import { problemRouter } from "./routers/problem.routes";
import { psRouter } from "./routers/project.structure.routes";
import { psgRouter } from "./routers/psg.routes";
import { solutionRouter } from "./routers/solution.routes";
import { stackRouter } from "./routers/stack.routes";
import { userRouter } from "./routers/user.routes";
import cookieParser from 'cookie-parser'

dotenv.config();

const app = Express();

app.use(json());
app.use(cors());
app.use(cookieParser(process.env.SECRET as string));

app.use('/auth', authRouter);
app.use('/category', categoryRouter);
app.use('/comment', commentRouter);
app.use('/favourite', favouriteRouter);
app.use('/history', historyRouter);
app.use('/p_structure', psRouter);
app.use('/psg', psgRouter);
app.use('/solution', solutionRouter);
app.use('/stack', stackRouter);
app.use('/user', userRouter);
app.use('/problem', problemRouter);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(501).json({ message: err.message });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
})

// const email = Express();

// email.listen(3001, async () => {
//   console.log("Email server is running on port 3001");

//   cron.schedule('*/5 * * * * *', async () => {
//     console.log("Checking the database");
    
//     await updateUserBadge();
    
//     console.log("Badge check completed");

//     await welcomeUser();
    
//     console.log("Welcome email sent");

//     await notifyAccountTermination();
    
//     console.log("Account termination notification sent");

//     await notifyAccountDeactivation();

//     console.log("Account retrieval notification sent");
//   });
// });