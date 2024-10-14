import { Injectable } from '@angular/core';
import { getString, setString } from '@nativescript/core/application-settings';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private currentLanguage: string;

  constructor() {
    this.currentLanguage = getString('language', 'es');
  }

  setLanguage(lang: string) {
    this.currentLanguage = lang;
    setString('language', lang);
  }

  getCurrentLanguage(): string {
    return this.currentLanguage;
  }

  translate(key: string): string {
    const translations = {
      es: {
        welcome: 'Bienvenido a OFFER ME',
        search: 'Buscar Productos',
        nearbyOffers: 'Ver Ofertas Cercanas',
        postProduct: 'Publicar Producto'
      },
      en: {
        welcome: 'Welcome to OFFER ME',
        search: 'Search Products',
        nearbyOffers: 'View Nearby Offers',
        postProduct: 'Post Product'
      },
      zh: {
        welcome: '欢迎来到 OFFER ME',
        search: '搜索产品',
        nearbyOffers: '查看附近优惠',
        postProduct: '发布产品'
      }
    };

    return translations[this.currentLanguage][key] || key;
  }
}