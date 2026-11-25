
import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { AdminDashboardService } from '../../services/admin-dashboard.service';
import { DashboardStats } from '../../models/dashboard-stats';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css'
})
export class AdminDashboardComponent implements OnInit {

  dashboardCards = [
    {
      title: 'Total Products',
      value: 0,
      icon: 'bi-box-seam',
      color: 'primary',
      description: 'Products in your store'
    },
    {
      title: 'Total Categories',
      value: 0,
      icon: 'bi-grid',
      color: 'success',
      description: 'Available categories'
    },
    {
      title: 'Total Customers',
      value: 0,
      icon: 'bi-people',
      color: 'warning',
      description: 'Registered customers'
    },
    {
      title: 'Total Orders',
      value: 0,
      icon: 'bi-cart-check',
      color: 'info',
      description: 'Orders received'
    }
  ];

  isLoading = true;
  errorMessage = '';

  constructor(
    private adminDashboardService: AdminDashboardService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadDashboardStats();
  }

  loadDashboardStats(): void {

    this.isLoading = true;
    this.errorMessage = '';

    this.cdr.markForCheck();

    this.adminDashboardService.getDashboardStats().subscribe({

      next: (stats: DashboardStats) => {

        console.log('Dashboard API Response:', stats);

        this.dashboardCards[0].value = stats.totalProducts;
        this.dashboardCards[1].value = stats.totalCategories;
        this.dashboardCards[2].value = stats.totalCustomers;
        this.dashboardCards[3].value = stats.totalOrders;

        this.isLoading = false;

        // Notify Angular to update the dashboard view
        this.cdr.detectChanges();

        console.log('Dashboard Cards Updated:', this.dashboardCards);

      },

      error: (error) => {

        console.error('Dashboard Statistics Error:', error);

        this.errorMessage =
          'Unable to load dashboard statistics. Please try again.';

        this.isLoading = false;

        this.cdr.detectChanges();

      }

    });
  }
}
