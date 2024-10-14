import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BlockchainService {
  constructor(private http: HttpClient) {}

  createNFT(productId: string): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/blockchain/create-nft`, { productId });
  }

  verifyOwnership(nftId: string): Observable<boolean> {
    return this.http.get<boolean>(`${environment.apiUrl}/blockchain/verify-ownership/${nftId}`);
  }

  transferNFT(nftId: string, toAddress: string): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/blockchain/transfer-nft`, { nftId, toAddress });
  }
}