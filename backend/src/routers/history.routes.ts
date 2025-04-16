import { Router } from "express";
import { HistoryController } from "../controllers/history.controller";
import { verifyToken, verifyUser } from "../middlewares/verify.tokens";

export const historyRouter = Router();

const historyController = new HistoryController();

historyRouter.post('/add-history/:ProblemId', verifyToken, verifyUser, historyController.addHistory);
historyRouter.get('/get-history-by-user', verifyToken, verifyUser, historyController.getHistoryByUser);
historyRouter.delete('/clear-history', verifyToken, verifyUser, historyController.clearHistory);
historyRouter.delete('/delete-single-history/:HistoryId', verifyToken, verifyUser, historyController.deleteSingleHistory);