import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Chat, Message } from '../models/chat.model';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  constructor(private http: HttpClient, private socket: Socket) {}

  getChats(): Observable<Chat[]> {
    return this.http.get<Chat[]>(`${environment.apiUrl}/chats`);
  }

  getChatById(chatId: string): Observable<Chat> {
    return this.http.get<Chat>(`${environment.apiUrl}/chats/${chatId}`);
  }

  sendMessage(chatId: string, content: string): Observable<Message> {
    return this.http.post<Message>(`${environment.apiUrl}/chats/${chatId}/messages`, { content });
  }

  makeOffer(chatId: string, amount: number): Observable<any> {
    return this.http.post(`${environment.apiUrl}/chats/${chatId}/offer`, { amount });
  }

  respondToOffer(chatId: string, status: 'accepted' | 'rejected'): Observable<any> {
    return this.http.put(`${environment.apiUrl}/chats/${chatId}/offer`, { status });
  }

  joinChatRoom(chatId: string) {
    this.socket.emit('join_room', chatId);
  }

  leaveChatRoom(chatId: string) {
    this.socket.emit('leave_room', chatId);
  }

  onNewMessage(): Observable<Message> {
    return this.socket.fromEvent<Message>('new_message');
  }
}