import { Component, OnInit } from '@angular/core';
import { AIService } from '../services/ai.service';

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent implements OnInit {
  messages: {text: string, isUser: boolean}[] = [];
  userInput: string = '';

  constructor(private aiService: AIService) {}

  ngOnInit() {
    this.addBotMessage('¡Hola! Soy el asistente de OFFER ME. ¿En qué puedo ayudarte?');
  }

  sendMessage() {
    if (this.userInput.trim()) {
      this.addUserMessage(this.userInput);
      this.aiService.getChatbotResponse(this.userInput).subscribe(
        response => {
          this.addBotMessage(response.response);
        },
        error => {
          console.error('Error getting chatbot response:', error);
          this.addBotMessage('Lo siento, hubo un error. Por favor, intenta de nuevo más tarde.');
        }
      );
      this.userInput = '';
    }
  }

  private addUserMessage(message: string) {
    this.messages.push({text: message, isUser: true});
  }

  private addBotMessage(message: string) {
    this.messages.push({text: message, isUser: false});
  }
}