import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';

export interface ChatMessage {
  id: number;
  type: 'user' | 'system';
  message: string;
  timestamp: Date;
  username: string;
  userId?: string;
}

export interface User {
  id: string;
  username: string;
  joinedAt: Date;
}

export interface TypingUser {
  username: string;
  isTyping: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private socket: Socket;
  private readonly SERVER_URL = 'http://localhost:3000';

  // Observables for real-time updates
  private messagesSubject = new BehaviorSubject<ChatMessage[]>([]);
  private usersSubject = new BehaviorSubject<User[]>([]);
  private typingUsersSubject = new BehaviorSubject<TypingUser[]>([]);
  private connectionStatusSubject = new BehaviorSubject<boolean>(false);

  public messages$ = this.messagesSubject.asObservable();
  public users$ = this.usersSubject.asObservable();
  public typingUsers$ = this.typingUsersSubject.asObservable();
  public connectionStatus$ = this.connectionStatusSubject.asObservable();

  private currentUser: string = '';
  private typingTimeout: any;

  constructor() {
    this.socket = io(this.SERVER_URL);
    this.setupSocketListeners();
  }

  private setupSocketListeners(): void {
    // Connection status
    this.socket.on('connect', () => {
      console.log('Connected to chat server');
      this.connectionStatusSubject.next(true);
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from chat server');
      this.connectionStatusSubject.next(false);
    });

    // Chat history when joining
    this.socket.on('chat-history', (history: ChatMessage[]) => {
      this.messagesSubject.next(history);
    });

    // New messages
    this.socket.on('message', (message: ChatMessage) => {
      const currentMessages = this.messagesSubject.value;
      this.messagesSubject.next([...currentMessages, message]);
    });

    // Users list updates
    this.socket.on('users-update', (users: User[]) => {
      this.usersSubject.next(users);
    });

    // Typing indicators
    this.socket.on('user-typing', (data: TypingUser) => {
      const currentTypingUsers = this.typingUsersSubject.value;
      const existingUserIndex = currentTypingUsers.findIndex(
        user => user.username === data.username
      );

      if (data.isTyping) {
        if (existingUserIndex === -1) {
          this.typingUsersSubject.next([...currentTypingUsers, data]);
        }
      } else {
        if (existingUserIndex !== -1) {
          const updatedUsers = currentTypingUsers.filter(
            user => user.username !== data.username
          );
          this.typingUsersSubject.next(updatedUsers);
        }
      }
    });
  }

  joinChat(username: string): void {
    this.currentUser = username;
    this.socket.emit('join', { username });
  }

  sendMessage(message: string): void {
    if (message.trim() && this.currentUser) {
      this.socket.emit('message', { message: message.trim() });
    }
  }

  startTyping(): void {
    this.socket.emit('typing', { isTyping: true });
    
    // Clear existing timeout
    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout);
    }
    
    // Stop typing after 3 seconds of inactivity
    this.typingTimeout = setTimeout(() => {
      this.stopTyping();
    }, 3000);
  }

  stopTyping(): void {
    this.socket.emit('typing', { isTyping: false });
    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout);
      this.typingTimeout = null;
    }
  }

  getCurrentUser(): string {
    return this.currentUser;
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}
