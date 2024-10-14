import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouterExtensions } from '@nativescript/angular';
import { ProductService } from '../services/product.service';
import { ChatService } from '../services/chat.service';
import * as SocialShare from '@nativescript/social-share';
import { DialogService } from '../services/dialog.service';
import { AIService } from '../services/ai.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  product: any;
  suggestedPrice: number;

  constructor(
    private route: ActivatedRoute,
    private routerExtensions: RouterExtensions,
    private productService: ProductService,
    private chatService: ChatService,
    private dialogService: DialogService,
    private aiService: AIService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.params.id;
    this.loadProduct(id);
  }

  async loadProduct(id: string) {
    try {
      this.product = await this.productService.getProductById(id).toPromise();
      this.getSuggestedPrice();
    } catch (error) {
      console.error('Error loading product:', error);
    }
  }

  onBackTap(): void {
    this.routerExtensions.back();
  }

  onContactSellerTap(): void {
    this.routerExtensions.navigate(['/chat', this.product.sellerId]);
  }

  async onMakeOfferTap(): void {
    const result = await this.dialogService.prompt(
      'Hacer una oferta',
      'Ingresa el monto que quieres ofrecer:',
      this.suggestedPrice.toString()
    );
    if (result.result) {
      const offerAmount = parseFloat(result.text);
      if (!isNaN(offerAmount)) {
        this.sendOffer(offerAmount);
      } else {
        this.dialogService.alert('Error', 'Por favor ingresa un monto válido.');
      }
    }
  }

  async sendOffer(amount: number) {
    try {
      const chatId = await this.chatService.createChat(this.product.sellerId, this.product.id).toPromise();
      await this.chatService.makeOffer(chatId, amount).toPromise();
      this.dialogService.alert('Éxito', 'Tu oferta ha sido enviada al vendedor.');
    } catch (error) {
      console.error('Error sending offer:', error);
      this.dialogService.alert('Error', 'No se pudo enviar la oferta. Por favor intenta de nuevo.');
    }
  }

  onShareTap(): void {
    SocialShare.shareText(`Check out this product: ${this.product.name} - $${this.product.price}`);
  }

  async getSuggestedPrice() {
    try {
      const response = await this.aiService.getPriceSuggestion(this.product).toPromise();
      this.suggestedPrice = response.suggestedPrice;
    } catch (error) {
      console.error('Error getting price suggestion:', error);
    }
  }
}