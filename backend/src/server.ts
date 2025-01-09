
import Express, { json, NextFunction, Request, Response } from "express";
import cors from 'cors';
import dotenv from 'dotenv';

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