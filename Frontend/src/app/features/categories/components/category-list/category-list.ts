
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CategoryService } from '../../services/category';
import { Category, CreateCategory } from '../../models/category';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './category-list.html',
  styleUrl: './category-list.css'
})
export class CategoryListComponent implements OnInit {

  categories: Category[] = [];

  isLoading = false;
  isSaving = false;
  errorMessage = '';
  successMessage = '';

  showAddForm = false;

  newCategory: CreateCategory = {
    categoryName: '',
    description: '',
    imageUrl: ''
  };

  pageNumber = 1;
  pageSize = 10;
  totalPages = 0;
  totalRecords = 0;

  constructor(
    private categoryService: CategoryService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {

    this.isLoading = true;
    this.errorMessage = '';

    this.categoryService.getCategories(
      this.pageNumber,
      this.pageSize,
      false
    ).subscribe({

      next: (response) => {
        this.categories = response.categories;
        this.pageNumber = response.pageNumber;
        this.pageSize = response.pageSize;
        this.totalPages = response.totalPages;
        this.totalRecords = response.totalRecords;

        this.isLoading = false;
        this.cdr.detectChanges();
      },

      error: (error) => {
        console.error('Category loading failed:', error);
        this.errorMessage = 'Unable to load categories.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }

    });
  }

  openAddForm(): void {
    this.showAddForm = true;
    this.successMessage = '';
    this.errorMessage = '';
  }

  cancelAdd(): void {
    this.showAddForm = false;
    this.resetForm();
  }

  resetForm(): void {
    this.newCategory = {
      categoryName: '',
      description: '',
      imageUrl: ''
    };
  }

  addCategory(): void {

    if (
      !this.newCategory.categoryName.trim() ||
      !this.newCategory.description.trim() ||
      !this.newCategory.imageUrl.trim()
    ) {
      this.errorMessage = 'Please fill in all category fields.';
      return;
    }

    this.isSaving = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.categoryService.createCategory(this.newCategory).subscribe({

      next: () => {
        this.isSaving = false;
        this.showAddForm = false;
        this.resetForm();

        this.successMessage = 'Category added successfully!';

        this.pageNumber = 1;
        this.loadCategories();
      },

      error: (error) => {
        console.error('Add category failed:', error);

        this.isSaving = false;

        this.errorMessage =
          error.status === 409
            ? 'This category already exists.'
            : 'Unable to add category. Please try again.';

        this.cdr.detectChanges();
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
