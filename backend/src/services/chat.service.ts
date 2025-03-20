import { PrismaClient, Prisma, Chat } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";
import { ChatServiceInterface } from "../interfaces/methods.interfaces";
import { v4 } from "uuid";

export class ChatService implements ChatServiceInterface {
    prisma = new PrismaClient({
        log: ['error']
    });

    async createChat(UserId: string, Message: string): Promise<{ success: boolean; error?: string; message?: string; }> {
        let userExists = await this.prisma.user.findUnique({
            where: {
                UserId
            }
        });

        if (userExists == null) {
            return {
                'success': false,
                'error': 'You need to sign up to send message.'
            }
        }

        if (userExists.IsDeleted) {
            return {
                'success': false,
                'error': 'Sorry, your account has been deactivated. Contact us for assistance.'
            }
        }

        let createChat = await this.prisma.chat.create({
            data: {
                ChatId: v4(),
                UserId,
                Message
            }
        });

        if(createChat == null) {
            return {
                'success': false,
                'error': 'Unable to send your chat.'
            }
        } else {
            return {
                'success': true,
                'message': 'Chat sent successfully.'
            }
        }
    }
    async updateChat(UserId: string, ChatId: string, Message: string): Promise<{ success: boolean; error?: string; message?: string; }> {
        let userExists = await this.prisma.user.findUnique({
            where: {
                UserId
            }
        });

        if (userExists == null) {
            return {
                'success': false,
                'error': 'You need to sign up to send message.'
            }
        }

        if (userExists.IsDeleted) {
            return {
                'success': false,
                'error': 'Sorry, your account has been deactivated. Contact us for assistance.'
            }
        }

        let chatExist = await this.prisma.chat.findUnique({
            where: {
                ChatId,
                UserId
            }
        });

        if(chatExist == null) {
            return {
                'success': false,
                'error': 'Unable to locate your chat.'
            }
        }

        let updateChat = await this.prisma.chat.update({
            data: {
                Message
            },
            where: {
                ChatId: chatExist.ChatId
            }
        });

        if(updateChat == null) {
            return {
                'success': false,
                'error': 'Unable to update your chat.'
            }
        } else {
            return {
                'success': true,
                'message': 'Chat updated successfully.'
            }
        }
    };
    async deleteChat(ChatId: string): Promise<{ success: boolean; error?: string; message?: string; }>{
        let chatExist = await this.prisma.chat.findUnique({
            where: {
                ChatId
            }
        });

        if(chatExist == null) {
            return {
                'success': false,
                'error': 'Unable to locate your chat.'
            }
        }

        let deleteChat = await this.prisma.chat.delete({
            where: {
                ChatId: chatExist.ChatId
            }
        });

        if(deleteChat == null) {
            return {
                'success': false,
                'error': 'Unable to delete chat.'
            }
        } else {
            return {
                'success': true, 
                'message': 'Chat deleted successfully.'
            }
        }
    };
    async toggleChatPinStatus(UserId: string, ChatId: string): Promise<{ success: boolean; error?: string; message?: string; }> {
        let userExists = await this.prisma.user.findUnique({
            where: {
                UserId
            }
        });

        if (userExists == null) {
            return {
                'success': false,
                'error': 'You need to sign up to send message.'
            }
        }

        if (userExists.IsDeleted) {
            return {
                'success': false,
                'error': 'Sorry, your account has been deactivated. Contact us for assistance.'
            }
        }

        let chatExist = await this.prisma.chat.findUnique({
            where: {
                ChatId,
                UserId
            }
        });

        if(chatExist == null) {
            return {
                'success': false,
                'error': 'Unable to locate your chat.'
            }
        }

        let chatStatus: boolean = chatExist.Pinned;

        let updatePin = await this.prisma.chat.update({
            data: {
                Pinned: !chatStatus
            },
            where: {
                ChatId: chatExist.ChatId
            }
        });

        if(updatePin == null) {
            return {
                'success': false,
                'error': `${chatStatus ? "Unable to unpin chat" : "Unable to pin chat"}.`
            }
        } else {
            return {
                'success': true,
                'error': `${chatStatus ? "Chat unpinned" : "Chat pinned"} successfully.`
            }
        }
    }
    async getSingleChat(ChatId: string): Promise<{ success: boolean; error?: string; message?: string; chat?: Chat; }> {
        let chatExist = await this.prisma.chat.findUnique({
            where: {
                ChatId
            },
            include: {
                User: {
                    select: {
                        ProfileImage: true,
                        Username: true,
                        ProblemsCount: true,
                        Badge: true
                    }
                }
            }
        });

        if(chatExist == null) {
            return {
                'success': false,
                'error': 'Unable to locate your chat.'
            }
        } else {
            return {
                'success': true,
                'message': 'Chat fetched successfully.',
                'chat': chatExist
            }
        }
    }
    async getChats(): Promise<{ success: boolean; error?: string; message?: string; chats?: Chat[]; }> {
        let chatExist = await this.prisma.chat.findMany({
            include: {
                User: {
                    select: {
                        ProfileImage: true,
                        Username: true,
                        ProblemsCount: true,
                        Badge: true
                    }
                }
            }
        });

        if(chatExist == null || chatExist.length === 0) {
            return {
                'success': false,
                'error': 'There are no chats available currently.'
            }
        } else {
            return {
                'success': true,
                'message': 'Chats fetched successfully.',
                'chats': chatExist
            }
        }
    }
    
}