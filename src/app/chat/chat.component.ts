import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouterExtensions } from '@nativescript/angular';
import { ChatService } from '../services/chat.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
})
export class ChatComponent implements OnInit, OnDestroy {
  messages: any[] = [];
  messageText: string = '';
  chatId: string;
  currentUserId: string;
  private unsubscribe: () => void;

  constructor(
    private route: ActivatedRoute,
    private routerExtensions: RouterExtensions,
    private chatService: ChatService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.chatId = this.route.snapshot.params.id;
    this.currentUserId = this.authService.getCurrentUser().uid;
    this.loadMessages();
  }

  ngOnDestroy() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  loadMessages() {
    this.unsubscribe = this.chatService.listenToMessages(this.chatId, (messages) => {
      this.messages = messages;
    });
  }

  async onSendTap() {
    if (this.messageText.trim()) {
      try {
        await this.chatService.sendMessage(this.chatId, {
          text: this.messageText,
          senderId: this.currentUserId,
        });
        this.messageText = '';
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  }

  onBackTap(): void {
    this.routerExtensions.back();
  }
}