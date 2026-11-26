
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CategoryService } from '../../services/category';
import {
  Category,
  CreateCategory,
  UpdateCategory
} from '../../models/category';

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
  isEditMode = false;

  editingCategoryId: number | null = null;
  editingCategoryIsActive = true;

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

  // Load Categories
  loadCategories(): void {

    this.isLoading = true;
    this.errorMessage = '';

    this.categoryService
      .getCategories(this.pageNumber, this.pageSize, false)
      .subscribe({

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

          console.error('Loading categories failed:', error);

          this.errorMessage = 'Unable to load categories.';
          this.isLoading = false;

          this.cdr.detectChanges();
        }

      });
  }

  // Open Add Category Form
  openAddForm(): void {

    this.showAddForm = true;
    this.isEditMode = false;
    this.editingCategoryId = null;

    this.resetForm();

    this.errorMessage = '';
    this.successMessage = '';

    this.cdr.detectChanges();
  }

  // Open Edit Category Form
  openEditForm(category: Category): void {

    // Test whether Edit button is clicked
    alert('Edit button clicked!');

    console.log('Selected category:', category);

    this.showAddForm = true;
    this.isEditMode = true;

    this.editingCategoryId = category.categoryId;
    this.editingCategoryIsActive = category.isActive;

    this.newCategory = {
      categoryName: category.categoryName,
      description: category.description,
      imageUrl: category.imageUrl
    };

    this.errorMessage = '';
    this.successMessage = '';

    this.cdr.detectChanges();
  }

  // Cancel Add/Edit Form
  cancelAdd(): void {

    this.showAddForm = false;
    this.isEditMode = false;
    this.editingCategoryId = null;

    this.resetForm();

    this.errorMessage = '';

    this.cdr.detectChanges();
  }

  // Reset Form
  resetForm(): void {

    this.newCategory = {
      categoryName: '',
      description: '',
      imageUrl: ''
    };
  }

  // Save Category - Add or Update
  saveCategory(): void {

    if (
      !this.newCategory.categoryName.trim() ||
      !this.newCategory.description.trim() ||
      !this.newCategory.imageUrl.trim()
    ) {

      this.errorMessage = 'Please fill in all category fields.';
      return;
    }

    this.errorMessage = '';
    this.successMessage = '';
    this.isSaving = true;

    // Update Existing Category
    if (this.isEditMode && this.editingCategoryId !== null) {

      const updateData: UpdateCategory = {
        categoryName: this.newCategory.categoryName.trim(),
        description: this.newCategory.description.trim(),
        imageUrl: this.newCategory.imageUrl.trim(),
        isActive: this.editingCategoryIsActive
      };

      this.categoryService
        .updateCategory(this.editingCategoryId, updateData)
        .subscribe({

          next: () => {

            this.isSaving = false;
            this.showAddForm = false;
            this.isEditMode = false;
            this.editingCategoryId = null;

            this.resetForm();

            this.successMessage = 'Category updated successfully!';

            this.loadCategories();
          },

          error: (error) => {

            console.error('Updating category failed:', error);

            this.isSaving = false;

            this.errorMessage =
              error.error?.message ||
              'Unable to update category. Please try again.';

            this.cdr.detectChanges();
          }

        });

    } else {

      // Add New Category
      this.addCategory();
    }
  }

  // Add Category
  addCategory(): void {

    this.categoryService
      .createCategory(this.newCategory)
      .subscribe({

        next: () => {

          this.isSaving = false;
          this.showAddForm = false;

          this.resetForm();

          this.pageNumber = 1;

          this.successMessage = 'Category added successfully!';

          this.loadCategories();
        },

        error: (error) => {

          console.error('Adding category failed:', error);

          this.isSaving = false;

          if (error.status === 409) {

            this.errorMessage = 'Category name already exists.';

          } else {

            this.errorMessage =
              error.error?.message ||
              'Unable to add category. Please try again.';
          }

          this.cdr.detectChanges();
        }

      });
  }

  // Delete / Deactivate Category
  deleteCategory(category: Category): void {

    const confirmDelete = confirm(
      `Are you sure you want to deactivate "${category.categoryName}"?`
    );

    if (!confirmDelete) {
      return;
    }

    this.errorMessage = '';
    this.successMessage = '';

    this.categoryService
      .deleteCategory(category.categoryId)
      .subscribe({

        next: () => {

          this.successMessage = 'Category deactivated successfully!';

          if (
            this.categories.length === 1 &&
            this.pageNumber > 1
          ) {
            this.pageNumber--;
          }

          this.loadCategories();
        },

        error: (error) => {

          console.error('Category deletion failed:', error);

          this.errorMessage =
            error.error?.message ||
            'Unable to deactivate category. Please try again.';

          this.cdr.detectChanges();
        }

      });
  }

  // Previous Page
  previousPage(): void {

    if (this.pageNumber > 1) {

      this.pageNumber--;
      this.loadCategories();
    }
  }

  // Next Page
  nextPage(): void {

    if (this.pageNumber < this.totalPages) {

      this.pageNumber++;
      this.loadCategories();
    }
  }

}
