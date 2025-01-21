import { Router } from "express";
import { ProjectStructureController } from "../controllers/project.structure.controller";
import { verifyAdmin, verifyToken, verifyUser } from "../middlewares/verify.tokens";

export const psRouter = Router();

const psController = new ProjectStructureController();

psRouter.post("/create-project-structure", verifyToken, verifyAdmin, psController.createProjectStructure);
psRouter.put("/update-project-structure/:ProjectId", verifyToken, verifyAdmin, psController.updateProjectStructure);
psRouter.delete("/delete-project-structure/:ProjectId", verifyToken, verifyAdmin, psController.deleteProjectStructure);
psRouter.get("/get-all-project-structures", psController.getAllProjectStructures);
psRouter.get("/get-single-project-structure/:ProjectId", psController.getSingleProjectStructure);