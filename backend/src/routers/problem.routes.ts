import { Router } from "express";
import { ProblemController } from "../controllers/problem.controller";
import { verifyAdmin, verifyToken, verifyUser } from "../middlewares/verify.tokens";

export const problemRouter = Router();

const problemController = new ProblemController();

problemRouter.post('/create-problem', verifyToken, verifyUser, problemController.createProblem);
problemRouter.post('/update-problem/:ProblemId', verifyToken, verifyUser, problemController.updateProblem);
problemRouter.put('/approve-problem/:ProblemId', verifyToken, verifyAdmin, problemController.approveProblem);
problemRouter.delete('/delete-problem/:ProblemId', verifyToken, verifyAdmin, problemController.deleteProblem);
problemRouter.get('/get-user-problems', verifyToken, verifyUser, problemController.getUserProblems);
problemRouter.get('/get-all-problems', verifyToken, verifyAdmin, problemController.getAllProblems);
problemRouter.get('/get-admin-problems', verifyToken, verifyAdmin, problemController.getAdminProblems);
problemRouter.get('/get-approved-problems', problemController.getApprovedProblems);
problemRouter.get('/get-single-problem/:ProblemId', problemController.getSingleProblem);