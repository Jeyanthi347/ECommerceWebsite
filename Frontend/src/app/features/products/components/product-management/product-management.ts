
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ProductService } from '../../services/product';
import { CategoryService } from '../../../categories/services/category';

import {
  Product,
  CreateProduct
} from '../../models/product';

import { Category } from '../../../categories/models/category';

@Component({
  selector: 'app-product-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-management.html',
  styleUrl: './product-management.css'
})
export class ProductManagementComponent implements OnInit {

  products: Product[] = [];
  categories: Category[] = [];

  isLoading = false;
  isSaving = false;

  errorMessage = '';
  successMessage = '';

  showAddForm = false;

  newProduct: CreateProduct = {
    productName: '',
    description: '',
    price: 0,
    stockQuantity: 0,
    imageUrl: '',
    brand: '',
    categoryId: 0
  };

  pageNumber = 1;
  pageSize = 10;
  totalPages = 0;
  totalRecords = 0;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService
  ) { }

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
  }

  loadProducts(): void {

    this.isLoading = true;
    this.errorMessage = '';

    this.productService.getProducts(
      this.pageNumber,
      this.pageSize
    ).subscribe({

      next: (response) => {
        this.products = response.products;
        this.pageNumber = response.pageNumber;
        this.pageSize = response.pageSize;
        this.totalPages = response.totalPages;
        this.totalRecords = response.totalRecords;

        this.isLoading = false;
      },

      error: (error) => {
        console.error('Product loading failed:', error);
        this.errorMessage = 'Unable to load products.';
        this.isLoading = false;
      }

    });
  }

  loadCategories(): void {

    this.categoryService.getCategories(1, 100, true).subscribe({

      next: (response) => {
        this.categories = response.categories;
      },

      error: (error) => {
        console.error('Category loading failed:', error);
      }

    });

  }

  openAddForm(): void {
    this.showAddForm = true;
    this.errorMessage = '';
    this.successMessage = '';
  }

  cancelAdd(): void {
    this.showAddForm = false;
    this.resetForm();
  }

  resetForm(): void {
    this.newProduct = {
      productName: '',
      description: '',
      price: 0,
      stockQuantity: 0,
      imageUrl: '',
      brand: '',
      categoryId: 0
    };
  }

  addProduct(): void {

    if (
      !this.newProduct.productName.trim() ||
      this.newProduct.price <= 0 ||
      this.newProduct.stockQuantity < 0 ||
      this.newProduct.categoryId <= 0
    ) {
      this.errorMessage = 'Please enter valid product details and select a category.';
      return;
    }

    this.isSaving = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.productService.createProduct(this.newProduct).subscribe({

      next: () => {
        this.isSaving = false;
        this.showAddForm = false;
        this.resetForm();

        this.successMessage = 'Product added successfully!';

        this.pageNumber = 1;
        this.loadProducts();
      },

      error: (error) => {
        console.error('Add product failed:', error);

        this.isSaving = false;

        this.errorMessage =
          error.status === 409
            ? 'This product already exists.'
            : 'Unable to add product. Please try again.';
      }

    });

  }

  previousPage(): void {
    if (this.pageNumber > 1) {
      this.pageNumber--;
      this.loadProducts();
    }
  }

  nextPage(): void {
    if (this.pageNumber < this.totalPages) {
      this.pageNumber++;
      this.loadProducts();
    }
  }

}
