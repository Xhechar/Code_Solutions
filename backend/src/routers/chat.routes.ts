import { Router } from "express";
import { ChatController } from "../controllers/chat.controller";
import { verifyAdmin, verifyToken, verifyUser } from "../middlewares/verify.tokens";

export const chatRouter = Router();
const chatController = new ChatController();

chatRouter.post('/create-chat', verifyToken, verifyUser, chatController.createChat);
chatRouter.put('/update-chat/:ChatId', verifyToken, verifyUser, chatController.updateChat);
chatRouter.put('/toggle-pin/:ChatId', verifyToken, verifyUser, chatController.toggleChatPinStatus);
chatRouter.delete('/delete-chat/:ChatId', verifyToken, verifyAdmin, chatController.deleteChat);
chatRouter.get('/single-chat/:ChatId', verifyToken, verifyUser, chatController.getSingleChat);
chatRouter.get('/chats', async(req, res) => {
    await chatController.getChats(req, res)
});