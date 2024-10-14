import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  constructor(private http: HttpClient) {}

  createPaymentIntent(productId: string): Observable<{ clientSecret: string }> {
    return this.http.post<{ clientSecret: string }>(`${environment.apiUrl}/payments/create-payment-intent`, { productId });
  }

  confirmPayment(paymentIntentId: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/payments/confirm-payment`, { paymentIntentId });
  }

  getTransactions(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/payments/transactions`);
  }
}