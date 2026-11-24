
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { OrderService } from '../../services/order';
import { OrderResponse } from '../../models/order';

@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './order-details.html',
  styleUrl: './order-details.css'
})
export class OrderDetails implements OnInit {

  order: OrderResponse | null = null;
  isLoading = false;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const orderId = Number(this.route.snapshot.paramMap.get('orderId'));

    if (!orderId || orderId <= 0) {
      this.errorMessage = 'Invalid order ID.';
      return;
    }

    this.loadOrderDetails(orderId);
  }

  loadOrderDetails(orderId: number): void {

    this.isLoading = true;
    this.errorMessage = '';

    this.orderService.getMyOrderById(orderId)
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: (response: OrderResponse) => {
          this.order = response;
          this.cdr.detectChanges();
        },
        error: (error: any) => {
          console.error('Order Details API Error:', error);

          this.errorMessage =
            error.error?.message || 'Unable to load order details.';

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
