
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { Product, ProductListResponse } from '../../models/product';
import { ProductService } from '../../services/product';
import { CartService } from '../../../cart/services/cart';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css'
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];

  pageNumber: number = 1;
  pageSize: number = 10;

  totalRecords: number = 0;
  totalPages: number = 0;

  categoryId: number | null = null;

  isLoading: boolean = false;
  errorMessage: string = '';

  // Add to Cart properties
  addingProductId: number | null = null;
  cartSuccessMessage: string = '';
  cartErrorMessage: string = '';

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {

    this.route.queryParamMap.subscribe(params => {

      const selectedCategoryId = params.get('categoryId');

      this.categoryId = selectedCategoryId
        ? Number(selectedCategoryId)
        : null;

      this.pageNumber = 1;

      this.loadProducts();

    });
  }

  // Load Products
  loadProducts(): void {

    this.isLoading = true;
    this.errorMessage = '';

    this.productService
      .getProducts(
        this.pageNumber,
        this.pageSize,
        this.categoryId ?? undefined
      )
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.cdr.markForCheck();
        })
      )
      .subscribe({

        next: (response: ProductListResponse) => {

          this.products = response.products;
          this.totalRecords = response.totalRecords;
          this.totalPages = response.totalPages;

          this.cdr.markForCheck();
        },

        error: (error) => {

          console.error('Error loading products:', error);

          this.errorMessage =
            'Unable to load products. Please try again.';

          this.cdr.markForCheck();
        }

      });
  }

  // Navigate to Product Details
  viewProduct(productId: number): void {

    this.router.navigate(['/products', productId]);

  }

  // Add Product to Cart
  addToCart(product: Product): void {

    this.addingProductId = product.productId;

    this.cartSuccessMessage = '';
    this.cartErrorMessage = '';

    this.cartService.addToCart({
      productId: product.productId,
      quantity: 1
    }).subscribe({

      next: (response) => {

        this.cartSuccessMessage =
          product.productName + ' added to cart successfully!';

        this.addingProductId = null;

        this.cdr.markForCheck();

      },

      error: (error) => {

        console.error('Add to cart error:', error);

        this.cartErrorMessage =
          error.error?.message ||
          'Unable to add product to cart. Please try again.';

        this.addingProductId = null;

        this.cdr.markForCheck();

      }

    });

  }

  // Previous Page
  previousPage(): void {

    if (this.pageNumber > 1) {

      this.pageNumber--;

      this.loadProducts();

    }

  }

  // Next Page
  nextPage(): void {

    if (this.pageNumber < this.totalPages) {

      this.pageNumber++;

      this.loadProducts();

    }

  }

}
