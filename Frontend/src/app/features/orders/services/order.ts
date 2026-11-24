
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  CreateOrder,
  PlaceOrderResponse,
  OrderListResponse,
  OrderResponse
} from '../models/order';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private apiUrl = 'https://localhost:7173/api/Orders';

  constructor(private http: HttpClient) {}

  // Place a new order
  placeOrder(data: CreateOrder): Observable<PlaceOrderResponse> {
    return this.http.post<PlaceOrderResponse>(this.apiUrl, data);
  }

  // Get logged-in customer's orders
  getMyOrders(
    pageNumber: number = 1,
    pageSize: number = 10
  ): Observable<OrderListResponse[]> {

    const params = new HttpParams()
      .set('pageNumber', pageNumber)
      .set('pageSize', pageSize);

    return this.http.get<OrderListResponse[]>(
      `${this.apiUrl}/my-orders`,
      { params }
    );
  }

  // Get a particular order's details
  getMyOrderById(orderId: number): Observable<OrderResponse> {
    return this.http.get<OrderResponse>(
      `${this.apiUrl}/my-orders/${orderId}`
    );
  }
}
