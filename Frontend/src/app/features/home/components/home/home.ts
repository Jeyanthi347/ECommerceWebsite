
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { ProductService } from '../../../products/services/product';
import { CategoryService } from '../../../categories/services/category';

import { Product } from '../../../products/models/product';
import { Category } from '../../../categories/models/category';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {

  products: Product[] = [];
  categories: Category[] = [];

  isLoadingProducts = false;
  isLoadingCategories = false;

  errorMessage = '';

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
  }

  loadProducts(): void {
    this.isLoadingProducts = true;

    this.productService.getProducts(1, 8)
      .pipe(
        finalize(() => {
          this.isLoadingProducts = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: (response: any) => {
          this.products = Array.isArray(response)
            ? response
            : response.items ?? response.products ?? [];

          this.cdr.detectChanges();
        },
        error: (error: any) => {
          console.error('Home Products API Error:', error);
          this.errorMessage = 'Unable to load products.';
          this.cdr.detectChanges();
        }
      });
  }

  loadCategories(): void {
    this.isLoadingCategories = true;

    this.categoryService.getCategories(1, 8, true)
      .pipe(
        finalize(() => {
          this.isLoadingCategories = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: (response: any) => {
          this.categories = Array.isArray(response)
            ? response
            : response.items ?? response.categories ?? [];

          this.cdr.detectChanges();
        },
        error: (error: any) => {
          console.error('Home Categories API Error:', error);
          this.cdr.detectChanges();
        }
      });
  }
}
