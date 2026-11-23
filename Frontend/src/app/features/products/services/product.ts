
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  Product,
  ProductListResponse,
  CreateProduct,
  UpdateProduct
} from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiUrl = 'https://localhost:7173/api/Products';

  constructor(private http: HttpClient) {}

  // Get all products or filter products by category
  getProducts(
    pageNumber: number = 1,
    pageSize: number = 10,
    categoryId?: number
  ): Observable<ProductListResponse> {

    let params = new HttpParams()
      .set('pageNumber', pageNumber)
      .set('pageSize', pageSize);

    if (categoryId !== undefined && categoryId !== null) {
      params = params.set('categoryId', categoryId);
    }

    return this.http.get<ProductListResponse>(
      this.apiUrl,
      { params }
    );
  }

  // Get product by ID
  getProductById(productId: number): Observable<Product> {
    return this.http.get<Product>(
      `${this.apiUrl}/${productId}`
    );
  }

  // Add product
  createProduct(product: CreateProduct): Observable<Product> {
    return this.http.post<Product>(
      this.apiUrl,
      product
    );
  }

  // Update product
  updateProduct(
    productId: number,
    product: UpdateProduct
  ): Observable<Product> {
    return this.http.put<Product>(
      `${this.apiUrl}/${productId}`,
      product
    );
  }

  // Delete product
  deleteProduct(productId: number): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/${productId}`
    );
  }

}
