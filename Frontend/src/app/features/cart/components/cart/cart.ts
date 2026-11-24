
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { CartService } from '../../services/cart';
import { Cart as CartModel, CartItem } from '../../models/cart';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cart.html',
  styleUrl: './cart.css'
})
export class Cart implements OnInit {

  cart: CartModel | null = null;

  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private cartService: CartService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.cartService.getCart()
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: (response) => {
          console.log('Cart API Response:', response);

          this.cart = response;
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Cart loading error:', error);

          this.errorMessage =
            error.error?.message || 'Unable to load your cart.';

          this.cdr.detectChanges();
        }
      });
  }

  increaseQuantity(item: CartItem): void {
    this.updateQuantity(item, item.quantity + 1);
  }

  decreaseQuantity(item: CartItem): void {
    if (item.quantity > 1) {
      this.updateQuantity(item, item.quantity - 1);
    }
  }

  updateQuantity(item: CartItem, quantity: number): void {
    this.clearMessages();

    this.cartService.updateCartItem(item.cartItemId, { quantity })
      .subscribe({
        next: (response) => {
          this.cart = response.cart;
          this.successMessage = 'Cart updated successfully.';
        },
        error: (error) => {
          this.errorMessage =
            error.error?.message || 'Unable to update cart quantity.';
        }
      });
  }

  removeItem(cartItemId: number): void {
    this.clearMessages();

    this.cartService.removeCartItem(cartItemId)
      .subscribe({
        next: (response) => {
          this.cart = response.cart;
          this.successMessage = 'Product removed from cart.';
        },
        error: (error) => {
          this.errorMessage =
            error.error?.message || 'Unable to remove product.';
        }
      });
  }

  clearCart(): void {
    if (!this.cart || this.cart.items.length === 0) {
      return;
    }

    const confirmed = confirm(
      'Are you sure you want to clear your cart?'
    );

    if (!confirmed) {
      return;
    }

    this.clearMessages();

    this.cartService.clearCart()
      .subscribe({
        next: (response) => {
          this.cart = response.cart;
          this.successMessage = 'Your cart has been cleared.';
        },
        error: (error) => {
          this.errorMessage =
            error.error?.message || 'Unable to clear your cart.';
        }
      });
  }

  clearMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }
}
