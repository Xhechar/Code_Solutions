import { Router } from "express";
import { SolutionController } from "../controllers/solution.controller";
import { verifyAdmin, verifyToken, verifyUser } from "../middlewares/verify.tokens";

export const solutionRouter = Router();

const solutionController = new SolutionController();

solutionRouter.post("/create-solution", verifyToken, verifyUser, solutionController.createSolution);
solutionRouter.put("/update-solution/:SolutionId", verifyToken, verifyUser, solutionController.updateSolution);
solutionRouter.delete("/delete-solution/:SolutionId", verifyToken, verifyAdmin, solutionController.deleteSolution);
solutionRouter.get("/get-all-solutions", verifyToken, verifyUser, solutionController.getAllSolutions);
solutionRouter.get("/get-solution-by-problem/:ProblemId", verifyToken, verifyUser, solutionController.getSolutionsByProblem);