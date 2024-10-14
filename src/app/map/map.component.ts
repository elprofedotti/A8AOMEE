import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { RadSideDrawer } from 'nativescript-ui-sidedrawer';
import { Application } from '@nativescript/core';
import { registerElement } from '@nativescript/angular';
import { MapView, Marker, Position } from 'nativescript-google-maps-sdk';
import { GeolocationService } from '../services/geolocation.service';
import { ProductService } from '../services/product.service';

registerElement('MapView', () => MapView);

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
})
export class MapComponent implements OnInit {
  @ViewChild('mapView', { static: false }) mapView: ElementRef;

  latitude: number = 0;
  longitude: number = 0;
  zoom: number = 14;
  minZoom: number = 0;
  maxZoom: number = 22;
  bearing: number = 0;
  tilt: number = 0;
  padding: number[] = [40, 40, 40, 40];

  constructor(
    private geolocationService: GeolocationService,
    private productService: ProductService
  ) {}

  ngOnInit() {
    this.getUserLocation();
  }

  onDrawerButtonTap(): void {
    const sideDrawer = <RadSideDrawer>Application.getRootView();
    sideDrawer.showDrawer();
  }

  async getUserLocation() {
    try {
      const location = await this.geolocationService.getCurrentLocation();this.latitude = location.latitude;
      this.longitude = location.longitude;
      this.loadNearbyProducts();
    } catch (error) {
      console.error('Error getting user location:', error);
    }
  }

  onMapReady(event) {
    const mapView = event.object;
    this.addMarkers(mapView);
  }

  async loadNearbyProducts() {
    try {
      const products = await this.productService.getProducts();
      // Filter products based on proximity to user's location
      // This is a simplified example. In a real app, you'd use geospatial queries
      const nearbyProducts = products.filter(product => 
        this.isNearby(product.latitude, product.longitude)
      );
      this.addMarkers(this.mapView.nativeElement, nearbyProducts);
    } catch (error) {
      console.error('Error loading nearby products:', error);
    }
  }

  addMarkers(mapView: MapView, products: any[]) {
    products.forEach(product => {
      const marker = new Marker();
      marker.position = Position.positionFromLatLng(product.latitude, product.longitude);
      marker.title = product.name;
      marker.snippet = `$${product.price}`;
      mapView.addMarker(marker);
    });
  }

  isNearby(lat: number, lng: number): boolean {
    // Simplified proximity check (within ~10km)
    const latDiff = Math.abs(lat - this.latitude);
    const lngDiff = Math.abs(lng - this.longitude);
    return latDiff < 0.1 && lngDiff < 0.1;
  }
}