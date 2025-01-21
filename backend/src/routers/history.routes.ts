import { Router } from "express";
import { HistoryController } from "../controllers/history.controller";
import { verifyUser } from "../middlewares/verify.tokens";

export const historyRouter = Router();

const historyController = new HistoryController();

historyRouter.post('/add-history', verifyUser, historyController.addHistory);
historyRouter.get('/get-history-by-user', verifyUser, historyController.getHistoryByUser);
historyRouter.delete('/clear-history', verifyUser, historyController.clearHistory);