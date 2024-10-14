import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GeolocationService {
  constructor(private http: HttpClient) {}

  getCurrentPosition(): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
  }

  getNearbyProducts(latitude: number, longitude: number, radius: number): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/products/nearby`, {
      params: { latitude: latitude.toString(), longitude: longitude.toString(), radius: radius.toString() }
    });
  }

  getAddressFromCoordinates(latitude: number, longitude: number): Observable<string> {
    return this.http.get<any>(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`)
      .pipe(
        map(response => response.display_name)
      );
  }
}