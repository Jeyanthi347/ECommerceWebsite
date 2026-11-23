
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { Category, CategoryListResponse } from '../../models/category';
import { CategoryService } from '../../services/category';

@Component({
  selector: 'app-customer-category-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './customer-category-list.html',
  styleUrl: './customer-category-list.css'
})
export class CustomerCategoryListComponent implements OnInit {

  categories: Category[] = [];

  pageNumber: number = 1;
  pageSize: number = 10;

  totalRecords: number = 0;
  totalPages: number = 0;

  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(
    private categoryService: CategoryService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {

    this.isLoading = true;
    this.errorMessage = '';

    this.categoryService
      .getCategories(this.pageNumber, this.pageSize, true)
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.cdr.markForCheck();
        })
      )
      .subscribe({

        next: (response: CategoryListResponse) => {

          this.categories = response.categories;
          this.totalRecords = response.totalRecords;
          this.totalPages = response.totalPages;

          this.cdr.markForCheck();
        },

        error: (error) => {

          console.error('Error loading categories:', error);

          this.errorMessage =
            'Unable to load categories. Please try again.';

          this.cdr.markForCheck();
        }

      });
  }

  previousPage(): void {

    if (this.pageNumber > 1) {
      this.pageNumber--;
      this.loadCategories();
    }
  }

  nextPage(): void {

    if (this.pageNumber < this.totalPages) {
      this.pageNumber++;
      this.loadCategories();
    }
  }

}
