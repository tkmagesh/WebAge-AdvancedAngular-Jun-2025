import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService, ChatMessage, User, TypingUser } from '../../services/chat.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="chat-container">
      <!-- Header -->
      <div class="chat-header">
        <h2>Chat Room</h2>
        <div class="connection-status">
          <span class="status-indicator" [class.connected]="isConnected" [class.disconnected]="!isConnected"></span>
          {{ isConnected ? 'Connected' : 'Disconnected' }}
        </div>
      </div>

      <div class="chat-content">
        <!-- Users sidebar -->
        <div class="users-sidebar">
          <h3>Online Users ({{ users.length }})</h3>
          <div class="users-list">
            @for (user of users; track user.id) {
              <div class="user-item">
                <span class="user-avatar">{{ user.username.charAt(0).toUpperCase() }}</span>
                <span class="username">{{ user.username }}</span>
                @if (user.username === currentUser) {
                  <span class="current-user-badge">You</span>
                }
              </div>
            }
          </div>
        </div>

        <!-- Chat messages area -->
        <div class="messages-container">
          <div class="messages-list" #messagesContainer>
            @for (message of messages; track message.id) {
              <div 
                class="message" 
                [class.system-message]="message.type === 'system'"
                [class.own-message]="message.username === currentUser && message.type === 'user'"
              >
                @if (message.type === 'user') {
                  <div class="message-header">
                    <span class="message-username">{{ message.username }}</span>
                    <span class="message-time">{{ formatTime(message.timestamp) }}</span>
                  </div>
                }
                <div class="message-content">{{ message.message }}</div>
              </div>
            }

            <!-- Typing indicators -->
            @if (typingUsers.length > 0) {
              <div class="typing-indicators">
                <div class="typing-message">
                  <span class="typing-text">
                    {{ getTypingText() }}
                  </span>
                  <div class="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            }
          </div>

          <!-- Message input -->
          <div class="message-input-container">
            <form (ngSubmit)="sendMessage()" class="message-form">
              <input
                type="text"
                [(ngModel)]="newMessage"
                name="message"
                placeholder="Type your message..."
                class="message-input"
                (input)="onTyping()"
                (blur)="onStopTyping()"
                maxlength="500"
                autocomplete="off"
              />
              <button 
                type="submit" 
                [disabled]="!newMessage.trim() || !isConnected"
                class="send-button"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .chat-container {
      height: 100vh;
      display: flex;
      flex-direction: column;
      background: #f5f5f5;
    }

    .chat-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 1rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }

    .chat-header h2 {
      margin: 0;
      font-weight: 600;
    }

    .connection-status {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 14px;
    }

    .status-indicator {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: #e74c3c;
    }

    .status-indicator.connected {
      background: #2ecc71;
    }

    .chat-content {
      flex: 1;
      display: flex;
      overflow: hidden;
    }

    .users-sidebar {
      width: 250px;
      background: white;
      border-right: 1px solid #e1e5e9;
      padding: 1rem;
      overflow-y: auto;
    }

    .users-sidebar h3 {
      margin: 0 0 1rem 0;
      color: #333;
      font-size: 16px;
      font-weight: 600;
    }

    .users-list {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .user-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.5rem;
      border-radius: 8px;
      background: #f8f9fa;
    }

    .user-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 14px;
    }

    .username {
      flex: 1;
      font-weight: 500;
      color: #333;
    }

    .current-user-badge {
      background: #667eea;
      color: white;
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
    }

    .messages-container {
      flex: 1;
      display: flex;
      flex-direction: column;
      background: white;
    }

    .messages-list {
      flex: 1;
      padding: 1rem;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .message {
      max-width: 70%;
      word-wrap: break-word;
    }

    .message.system-message {
      align-self: center;
      max-width: 100%;
    }

    .message.own-message {
      align-self: flex-end;
    }

    .message.system-message .message-content {
      background: #f1f3f4;
      color: #666;
      padding: 0.5rem 1rem;
      border-radius: 20px;
      font-style: italic;
      text-align: center;
      font-size: 14px;
    }

    .message-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.25rem;
    }

    .message-username {
      font-weight: 600;
      color: #667eea;
      font-size: 14px;
    }

    .message-time {
      font-size: 12px;
      color: #999;
    }

    .message-content {
      background: #f8f9fa;
      padding: 0.75rem 1rem;
      border-radius: 18px;
      line-height: 1.4;
    }

    .own-message .message-content {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .typing-indicators {
      margin-top: 0.5rem;
    }

    .typing-message {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #666;
      font-style: italic;
      font-size: 14px;
    }

    .typing-dots {
      display: flex;
      gap: 2px;
    }

    .typing-dots span {
      width: 4px;
      height: 4px;
      border-radius: 50%;
      background: #666;
      animation: typing 1.4s infinite ease-in-out;
    }

    .typing-dots span:nth-child(1) { animation-delay: -0.32s; }
    .typing-dots span:nth-child(2) { animation-delay: -0.16s; }

    @keyframes typing {
      0%, 80%, 100% { transform: scale(0); opacity: 0.5; }
      40% { transform: scale(1); opacity: 1; }
    }

    .message-input-container {
      padding: 1rem;
      border-top: 1px solid #e1e5e9;
      background: #f8f9fa;
    }

    .message-form {
      display: flex;
      gap: 0.75rem;
    }

    .message-input {
      flex: 1;
      padding: 12px 16px;
      border: 2px solid #e1e5e9;
      border-radius: 25px;
      font-size: 16px;
      outline: none;
      transition: border-color 0.3s ease;
    }

    .message-input:focus {
      border-color: #667eea;
    }

    .send-button {
      padding: 12px 24px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 25px;
      font-weight: 600;
      cursor: pointer;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .send-button:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
    }

    .send-button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      transform: none;
    }

    @media (max-width: 768px) {
      .users-sidebar {
        width: 200px;
      }
      
      .message {
        max-width: 85%;
      }
    }

    @media (max-width: 600px) {
      .chat-content {
        flex-direction: column;
      }
      
      .users-sidebar {
        width: 100%;
        height: 120px;
        border-right: none;
        border-bottom: 1px solid #e1e5e9;
      }
      
      .users-list {
        flex-direction: row;
        overflow-x: auto;
        gap: 0.5rem;
      }
      
      .user-item {
        flex-shrink: 0;
        min-width: 120px;
      }
    }
  `]
})
export class ChatComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;

  messages: ChatMessage[] = [];
  users: User[] = [];
  typingUsers: TypingUser[] = [];
  newMessage: string = '';
  currentUser: string = '';
  isConnected: boolean = false;

  private subscriptions: Subscription[] = [];
  private shouldScrollToBottom = false;

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    this.currentUser = this.chatService.getCurrentUser();
    
    // Subscribe to chat service observables
    this.subscriptions.push(
      this.chatService.messages$.subscribe(messages => {
        this.messages = messages;
        this.shouldScrollToBottom = true;
      }),
      
      this.chatService.users$.subscribe(users => {
        this.users = users;
      }),
      
      this.chatService.typingUsers$.subscribe(typingUsers => {
        this.typingUsers = typingUsers;
        this.shouldScrollToBottom = true;
      }),
      
      this.chatService.connectionStatus$.subscribe(status => {
        this.isConnected = status;
      })
    );
  }

  ngAfterViewChecked(): void {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.chatService.stopTyping();
  }

  sendMessage(): void {
    if (this.newMessage.trim()) {
      this.chatService.sendMessage(this.newMessage);
      this.newMessage = '';
      this.chatService.stopTyping();
    }
  }

  onTyping(): void {
    if (this.newMessage.trim()) {
      this.chatService.startTyping();
    } else {
      this.chatService.stopTyping();
    }
  }

  onStopTyping(): void {
    this.chatService.stopTyping();
  }

  formatTime(timestamp: Date): string {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  getTypingText(): string {
    if (this.typingUsers.length === 1) {
      return `${this.typingUsers[0].username} is typing`;
    } else if (this.typingUsers.length === 2) {
      return `${this.typingUsers[0].username} and ${this.typingUsers[1].username} are typing`;
    } else if (this.typingUsers.length > 2) {
      return `${this.typingUsers.length} people are typing`;
    }
    return '';
  }

  private scrollToBottom(): void {
    try {
      if (this.messagesContainer) {
        const element = this.messagesContainer.nativeElement;
        element.scrollTop = element.scrollHeight;
      }
    } catch (err) {
      console.error('Error scrolling to bottom:', err);
    }
  }
}
