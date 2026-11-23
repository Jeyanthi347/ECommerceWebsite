import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { Product } from '../../models/product';
import { ProductService } from '../../services/product';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css'
})
export class ProductDetailsComponent implements OnInit {

  product: Product | null = null;

  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadProductDetails();
  }

  loadProductDetails(): void {

    const productId = Number(this.route.snapshot.paramMap.get('id'));

    if (!productId || productId <= 0) {
      this.errorMessage = 'Invalid product ID.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.productService
      .getProductById(productId)
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.cdr.markForCheck();
        })
      )
      .subscribe({

        next: (response: Product) => {
          this.product = response;
          this.cdr.markForCheck();
        },

        error: (error) => {
          console.error('Error loading product details:', error);

          this.errorMessage =
            'Unable to load product details. Please try again.';

          this.cdr.markForCheck();
        }

      });
  }

}