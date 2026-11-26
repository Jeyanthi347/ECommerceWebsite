
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  Customer,
  CustomerListResponse,
  UpdateCustomerStatus
} from '../models/customer';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  private apiUrl = 'https://localhost:7173/api/Customer';

  constructor(private http: HttpClient) { }

  // Get all customers with pagination and search
  getCustomers(
    pageNumber: number = 1,
    pageSize: number = 10,
    search?: string
  ): Observable<CustomerListResponse> {

    let params = new HttpParams()
      .set('pageNumber', pageNumber)
      .set('pageSize', pageSize);

    if (search && search.trim() !== '') {
      params = params.set('search', search.trim());
    }

    return this.http.get<CustomerListResponse>(
      this.apiUrl,
      { params }
    );
  }

  // Get customer by ID
  getCustomerById(customerId: string): Observable<Customer> {
    return this.http.get<Customer>(
      `${this.apiUrl}/${customerId}`
    );
  }

  // Activate or deactivate customer
  updateCustomerStatus(
    customerId: string,
    status: UpdateCustomerStatus
  ): Observable<any> {

    return this.http.put(
      `${this.apiUrl}/${customerId}/status`,
      status
    );
  }

}
