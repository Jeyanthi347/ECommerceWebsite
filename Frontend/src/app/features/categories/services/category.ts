
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  Category,
  CategoryListResponse,
  CreateCategory,
  UpdateCategory
} from '../models/category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private apiUrl = 'https://localhost:7173/api/Categories';

  constructor(private http: HttpClient) { }

  getCategories(
    pageNumber: number = 1,
    pageSize: number = 10,
    activeOnly: boolean = true
  ): Observable<CategoryListResponse> {

    const params = new HttpParams()
      .set('pageNumber', pageNumber)
      .set('pageSize', pageSize)
      .set('activeOnly', activeOnly);

    return this.http.get<CategoryListResponse>(this.apiUrl, { params });
  }

  getCategoryById(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.apiUrl}/${id}`);
  }

  createCategory(category: CreateCategory): Observable<Category> {
    return this.http.post<Category>(this.apiUrl, category);
  }

  updateCategory(
    id: number,
    category: UpdateCategory
  ): Observable<Category> {
    return this.http.put<Category>(`${this.apiUrl}/${id}`, category);
  }

  deleteCategory(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
