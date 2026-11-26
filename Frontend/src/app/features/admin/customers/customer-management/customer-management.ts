
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CustomerService } from '../../services/customer.service';
import { Customer } from '../../models/customer';

@Component({
  selector: 'app-customer-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './customer-management.html',
  styleUrl: './customer-management.css'
})
export class CustomerManagementComponent implements OnInit {

  customers: Customer[] = [];

  isLoading = false;
  errorMessage = '';
  successMessage = '';

  searchText = '';

  pageNumber = 1;
  pageSize = 10;
  totalRecords = 0;
  totalPages = 0;

  selectedCustomer: Customer | null = null;

  constructor(
    private customerService: CustomerService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadCustomers();
  }

  // Load customers
  loadCustomers(): void {

    this.isLoading = true;
    this.errorMessage = '';

    this.customerService.getCustomers(
      this.pageNumber,
      this.pageSize,
      this.searchText
    ).subscribe({

      next: (response) => {

        this.customers = response.customers;
        this.pageNumber = response.pageNumber;
        this.totalRecords = response.totalRecords;
        this.totalPages = response.totalPages;

        this.isLoading = false;
        this.cdr.detectChanges();
      },

      error: (error) => {

        console.error('Error loading customers:', error);

        this.errorMessage =
          error.error?.message || 'Unable to load customers.';

        this.isLoading = false;
        this.cdr.detectChanges();
      }

    });
  }

  // Search customers
  searchCustomers(): void {
    this.pageNumber = 1;
    this.selectedCustomer = null;
    this.loadCustomers();
  }

  // Clear search
  clearSearch(): void {
    this.searchText = '';
    this.pageNumber = 1;
    this.loadCustomers();
  }

  // View customer details
  viewCustomer(customer: Customer): void {
    this.selectedCustomer = customer;
  }

  // Close customer details
  closeCustomerDetails(): void {
    this.selectedCustomer = null;
  }

  // Activate or deactivate customer
  toggleCustomerStatus(customer: Customer): void {

    const action = customer.isActive ? 'deactivate' : 'activate';

    const confirmed = window.confirm(
      `Are you sure you want to ${action} ${customer.fullName}?`
    );

    if (!confirmed) {
      return;
    }

    this.errorMessage = '';
    this.successMessage = '';

    this.customerService.updateCustomerStatus(
      customer.id,
      { isActive: !customer.isActive }
    ).subscribe({

      next: () => {

        this.successMessage =
          `Customer ${customer.fullName} has been ${action}d successfully.`;

        this.loadCustomers();

        if (this.selectedCustomer?.id === customer.id) {
          this.selectedCustomer.isActive = !customer.isActive;
        }

        this.cdr.detectChanges();
      },

      error: (error) => {

        console.error('Error updating customer status:', error);

        this.errorMessage =
          error.error?.message || 'Unable to update customer status.';

        this.cdr.detectChanges();
      }

    });
  }

  // Previous page
  previousPage(): void {

    if (this.pageNumber > 1) {
      this.pageNumber--;
      this.loadCustomers();
    }
  }

  // Next page
  nextPage(): void {

    if (this.pageNumber < this.totalPages) {
      this.pageNumber++;
      this.loadCustomers();
    }
  }

}
