import { Router } from "express";
import { PSGController } from "../controllers/psg.controller";
import { verifyAdmin, verifyToken } from "../middlewares/verify.tokens";

export const psgRouter = Router();

const psgController = new PSGController();

psgRouter.post('/create-psg/ProjectId', verifyToken, verifyAdmin, psgController.createPSG);
psgRouter.put('/update-psg/:PSGId', verifyToken, verifyAdmin, psgController.updatePSG);
psgRouter.delete('/delete-psg/:PSGId', verifyToken, verifyAdmin, psgController.deletePSG);
psgRouter.get('/get-psg-by-project/:ProjectId', psgController.getPSGsByProject);