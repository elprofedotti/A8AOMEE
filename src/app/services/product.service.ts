import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(private http: HttpClient) {}

  getProducts(params: any): Observable<any> {
    let httpParams = new HttpParams();
    Object.keys(params).forEach(key => {
      if (params[key] !== null && params[key] !== undefined) {
        httpParams = httpParams.append(key, params[key]);
      }
    });
    return this.http.get<any>(`${environment.apiUrl}/products`, { params: httpParams });
  }

  getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(`${environment.apiUrl}/products/${id}`);
  }

  createProduct(product: FormData): Observable<Product> {
    return this.http.post<Product>(`${environment.apiUrl}/products`, product);
  }

  updateProduct(id: string, product: Partial<Product>): Observable<Product> {
    return this.http.put<Product>(`${environment.apiUrl}/products/${id}`, product);
  }

  deleteProduct(id: string): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/products/${id}`);
  }

  likeProduct(id: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/products/${id}/like`, {});
  }

  searchProducts(query: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${environment.apiUrl}/products/search`, { params: { q: query } });
  }
}