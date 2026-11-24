
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Cart, AddToCart, UpdateCartItem } from '../models/cart';

interface CartApiResponse {
  message: string;
  cart: Cart;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private apiUrl = 'https://localhost:7173/api/Cart';

  constructor(private http: HttpClient) {}

  // Get customer cart
  getCart(): Observable<Cart> {
    return this.http.get<Cart>(this.apiUrl);
  }

  // Add product to cart
  addToCart(data: AddToCart): Observable<CartApiResponse> {
    return this.http.post<CartApiResponse>(
      `${this.apiUrl}/items`,
      data
    );
  }

  // Update cart item quantity
  updateCartItem(
    cartItemId: number,
    data: UpdateCartItem
  ): Observable<CartApiResponse> {
    return this.http.put<CartApiResponse>(
      `${this.apiUrl}/items/${cartItemId}`,
      data
    );
  }

  // Remove one product from cart
  removeCartItem(cartItemId: number): Observable<CartApiResponse> {
    return this.http.delete<CartApiResponse>(
      `${this.apiUrl}/items/${cartItemId}`
    );
  }

  // Clear entire cart
  clearCart(): Observable<CartApiResponse> {
    return this.http.delete<CartApiResponse>(
      `${this.apiUrl}/clear`
    );
  }
}
