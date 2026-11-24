
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';

import { CartService } from '../../../cart/services/cart';
import { Cart as CartModel } from '../../../cart/models/cart';

import { OrderService } from '../../../orders/services/order';
import {
  CreateOrder,
  OrderResponse
} from '../../../orders/models/order';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css'
})
export class Checkout implements OnInit {

  cart: CartModel | null = null;

  isLoading = false;
  isPlacingOrder = false;

  errorMessage = '';
  placedOrder: OrderResponse | null = null;

  orderData: CreateOrder = {
    fullName: '',
    phoneNumber: '',
    deliveryAddress: '',
    city: '',
    pincode: ''
  };

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadCart();
  }

  // Load cart details
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
        next: (response: CartModel) => {
          this.cart = response;
          this.cdr.detectChanges();
        },
        error: (error: any) => {
          this.errorMessage =
            error.error?.message || 'Unable to load checkout details.';

          this.cdr.detectChanges();
        }
      });
  }

  // Place customer order
  placeOrder(): void {

    if (!this.cart || this.cart.items.length === 0) {
      this.errorMessage = 'Your cart is empty.';
      return;
    }

    this.errorMessage = '';
    this.isPlacingOrder = true;

    this.orderService.placeOrder(this.orderData)
      .pipe(
        finalize(() => {
          this.isPlacingOrder = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: (response) => {

          this.placedOrder = response.order;

          // Backend already clears the cart after successful order placement.
          this.cart = null;

          this.cdr.detectChanges();
        },
        error: (error: any) => {

          this.errorMessage =
            error.error?.message || 'Unable to place your order. Please try again.';

          this.cdr.detectChanges();
        }
      });
  }
}
