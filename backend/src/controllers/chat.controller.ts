import { PrismaClient, Prisma, Chat } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";
import { ChatService } from "../services/chat.service";
import { Request, Response } from "express";
import { ExtendedRequest, getIdFromToken } from "../middlewares/verify.tokens";

const chatService = new ChatService();
export class ChatController {
    async createChat(req: ExtendedRequest, res:Response) {
        try {
            res.status(201).json( await chatService.createChat(getIdFromToken(req), req.body.Message ));
            
        } catch (error) {
            res.status(501).json({
                'error': error
            })
        }
    }
    async updateChat(req: ExtendedRequest, res:Response) {
        try {

            res.status(201).json( await chatService.updateChat(getIdFromToken(req), req.params.ChatId, req.body.Message ));
            
        } catch (error) {
            res.status(501).json({
                'error': error
            })
        }
    }
    async deleteChat(req: Request, res:Response) {
        try {

            res.status(201).json( await chatService.deleteChat(req.params.ChatId));
            
        } catch (error) {
            res.status(501).json({
                'error': error
            })
        }
    }
    async toggleChatPinStatus(req: ExtendedRequest, res:Response) {
        try {

            res.status(201).json( await chatService.toggleChatPinStatus(getIdFromToken(req), req.params.ChatId));
            
        } catch (error) {
            res.status(501).json({
                'error': error
            })
        }
    }
    async getSingleChat(req: Request, res:Response) {
        try {

            res.status(201).json( await chatService.getSingleChat(req.params.ChatId));
            
        } catch (error) {
            res.status(501).json({
                'error': error
            })
        }
    }
    async getChats(req: Request, res:Response) {
        try {

            res.status(201).json( await chatService.getChats());
            
        } catch (error) {
            res.status(501).json({
                'error': error
            })
        }
    }
}