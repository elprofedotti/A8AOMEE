import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AIService {
  constructor(private http: HttpClient) {}

  getSmartRecommendations(userId: string): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/ai/recommendations/${userId}`);
  }

  getImageAnalysis(imageUrl: string): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/ai/image-analysis`, { imageUrl });
  }

  getPriceSuggestion(productDetails: any): Observable<{suggestedPrice: number}> {
    return this.http.post<{suggestedPrice: number}>(`${environment.apiUrl}/ai/price-suggestion`, productDetails);
  }

  getChatbotResponse(message: string): Observable<{response: string}> {
    return this.http.post<{response: string}>(`${environment.apiUrl}/ai/chatbot`, { message });
  }
}