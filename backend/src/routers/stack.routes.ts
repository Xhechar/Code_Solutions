import { Router } from "express";
import { StackController } from "../controllers/stack.controller";
import { verifyAdmin, verifyToken } from "../middlewares/verify.tokens";

export const stackRouter = Router();

const stackController = new StackController();

stackRouter.post('/create-stack', verifyToken, verifyAdmin, stackController.createStack);
stackRouter.put('/update-stack/:StackId', verifyToken, verifyAdmin, stackController.updateStack);
stackRouter.delete('/delete-stack/:StackId', verifyToken, verifyAdmin, stackController.deleteStack);
stackRouter.get('/get-single-stack/:StackId', verifyToken, verifyAdmin, stackController.getSingleStack);
stackRouter.get('/get-all-stacks', stackController.getAllStacks);
