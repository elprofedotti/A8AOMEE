import { Component, OnInit } from '@angular/core';
import { RouterExtensions } from '@nativescript/angular';
import { RadSideDrawer } from 'nativescript-ui-sidedrawer';
import { Application } from '@nativescript/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  constructor(private routerExtensions: RouterExtensions) {}

  ngOnInit() {}

  onDrawerButtonTap(): void {
    const sideDrawer = <RadSideDrawer>Application.getRootView();
    sideDrawer.showDrawer();
  }

  onSearchTap(): void {
    this.routerExtensions.navigate(['/products']);
  }

  onNearbyOffersTap(): void {
    this.routerExtensions.navigate(['/map']);
  }

  onPostProductTap(): void {
    this.routerExtensions.navigate(['/profile']);
  }
}