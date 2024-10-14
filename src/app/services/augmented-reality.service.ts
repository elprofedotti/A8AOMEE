import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AugmentedRealityService {
  constructor(private http: HttpClient) {}

  getARModel(productId: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/ar/model/${productId}`);
  }

  saveARSession(sessionData: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/ar/save-session`, sessionData);
  }
}