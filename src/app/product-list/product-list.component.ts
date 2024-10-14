import { Component, OnInit } from '@angular/core';
import { RouterExtensions } from '@nativescript/angular';
import { RadSideDrawer } from 'nativescript-ui-sidedrawer';
import { Application } from '@nativescript/core';
import { ProductService } from '../services/product.service';
import { trigger, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms', style({ opacity: 1 })),
      ]),
    ]),
  ],
})
export class ProductListComponent implements OnInit {
  products: any[] = [];
  categories: string[] = ['Todas', 'Electrónica', 'Ropa', 'Hogar', 'Otros'];
  selectedCategory: string = 'Todas';
  sortOptions: string[] = ['Nombre', 'Precio', 'Fecha'];
  selectedSortOption: string = 'Nombre';
  sortOrder: 'asc' | 'desc' = 'asc';

  constructor(
    private routerExtensions: RouterExtensions,
    private productService: ProductService
  ) {}

  ngOnInit() {
    this.loadProducts();
  }

  onDrawerButtonTap(): void {
    const sideDrawer = <RadSideDrawer>Application.getRootView();
    sideDrawer.showDrawer();
  }

  async loadProducts() {
    try {
      const category = this.selectedCategory !== 'Todas' ? this.selectedCategory : undefined;
      const sortBy = this.getSortByField();
      this.products = await this.productService.getProducts(category, sortBy, this.sortOrder);
    } catch (error) {
      console.error('Error loading products:', error);
    }
  }

  onSearch(event: any) {
    const searchTerm = event.object.text.toLowerCase();
    this.products = this.products.filter(product =>
      product.name.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm)
    );
  }

  onCategoryChange(args: any) {
    this.selectedCategory = this.categories[args.newIndex];
    this.loadProducts();
  }

  onSortChange(args: any) {
    this.selectedSortOption = this.sortOptions[args.newIndex];
    this.loadProducts();
  }

  toggleSortOrder() {
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    this.loadProducts();
  }

  getSortByField(): string {
    switch (this.selectedSortOption) {
      case 'Nombre':
        return 'name';
      case 'Precio':
        return 'price';
      case 'Fecha':
        return 'createdAt';
      default:
        return 'name';
    }
  }

  onProductTap(event: any) {
    const tappedProduct = this.products[event.index];
    this.routerExtensions.navigate(['/product', tappedProduct.id]);
  }
}