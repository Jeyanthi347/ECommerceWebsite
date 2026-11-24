
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { OrderService } from '../../services/order';
import { OrderListResponse } from '../../models/order';

@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './my-orders.html',
  styleUrl: './my-orders.css'
})
export class MyOrders implements OnInit {

  orders: OrderListResponse[] = [];
  isLoading = false;
  errorMessage = '';

  constructor(
    private orderService: OrderService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.orderService.getMyOrders(1, 10)
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: (response: OrderListResponse[]) => {
          this.orders = response;
          this.cdr.detectChanges();
        },
        error: (error: any) => {
          console.error('My Orders API Error:', error);
          this.errorMessage =
            error.error?.message || 'Unable to load your orders.';
          this.cdr.detectChanges();
        }
      });
  }

  getOrderStatus(status: number): string {
    switch (status) {
      case 1: return 'Pending';
      case 2: return 'Confirmed';
      case 3: return 'Shipped';
      case 4: return 'Delivered';
      case 5: return 'Cancelled';
      default: return 'Unknown';
    }
  }

  getStatusClass(status: number): string {
    switch (status) {
      case 1: return 'bg-warning text-dark';
      case 2: return 'bg-primary';
      case 3: return 'bg-info text-dark';
      case 4: return 'bg-success';
      case 5: return 'bg-danger';
      default: return 'bg-secondary';
    }
  }
}
