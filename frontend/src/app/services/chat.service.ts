import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Chat } from '../interfaces/solutions.interfaces';
import { SharedService } from './modifiers/shared.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  // API_URL: string = 'http://localhost:3000/chats/';
  API_URL: string = `${SharedService.API_URL}chats/`;
  
  constructor(private http: HttpClient) { }
  
  createChat(Message: string): Observable<{ success: boolean, error?: string, message?: string }> {
    return this.http.post<{ success: boolean, error?: string, message?: string }>(
      `${this.API_URL}create-chat`, 
      {Message}, 
      { withCredentials: true }
    );
  }
  
  updateChat(ChatId: string, Message: string): Observable<{ success: boolean, error?: string, message?: string }> {
    return this.http.put<{ success: boolean, error?: string, message?: string }>(
      `${this.API_URL}update-chat/${ChatId}`, 
      {Message}, 
      { withCredentials: true }
    );
  }
  
  toggleChatPinStatus(ChatId: string): Observable<{ success: boolean, error?: string, message?: string }> {
    return this.http.put<{ success: boolean, error?: string, message?: string }>(
      `${this.API_URL}toggle-pin/${ChatId}`, 
      {}, 
      { withCredentials: true }
    );
  }
  
  deleteChat(ChatId: string): Observable<{ success: boolean, error?: string, message?: string }> {
    return this.http.delete<{ success: boolean, error?: string, message?: string }>(
      `${this.API_URL}delete-chat/${ChatId}`, 
      { withCredentials: true }
    );
  }
  
  getSingleChat(ChatId: string): Observable<{ success: boolean, error?: string, message?: string, chat?: Chat }> {
    return this.http.get<{ success: boolean, error?: string, message?: string, chat?: Chat }>(
      `${this.API_URL}single-chat/${ChatId}`, 
      { withCredentials: true }
    );
  }
  
  getChats(): Observable<{ success: boolean, error?: string, message?: string, chats?: Chat[] }> {
    return this.http.get<{ success: boolean, error?: string, message?: string, chats?: Chat[] }>(
      `${this.API_URL}chats`, 
      { withCredentials: true }
    );
  }
}
