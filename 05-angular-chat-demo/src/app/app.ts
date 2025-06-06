import { Component, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { ChatComponent } from './components/chat/chat.component';
import { ChatService } from './services/chat.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LoginComponent, ChatComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnDestroy {
  protected title = 'angular-chat-demo';
  isLoggedIn = false;

  constructor(private chatService: ChatService) {}

  onUserJoined(username: string): void {
    this.chatService.joinChat(username);
    this.isLoggedIn = true;
  }

  ngOnDestroy(): void {
    this.chatService.disconnect();
  }
}
