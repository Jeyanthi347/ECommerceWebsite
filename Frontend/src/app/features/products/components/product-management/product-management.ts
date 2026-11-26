
import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ProductService } from '../../services/product';
import { CategoryService } from '../../../categories/services/category';

import {
  Product,
  CreateProduct,
  UpdateProduct
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

  deletingProductId: number | null = null;

  errorMessage = '';
  successMessage = '';

  showAddForm = false;
  isEditMode = false;
  editingProductId = 0;

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
    private categoryService: CategoryService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
  }

  // Load Products
  loadProducts(): void {

    this.isLoading = true;
    this.errorMessage = '';

    this.productService.getProducts(
      this.pageNumber,
      this.pageSize
    ).subscribe({

      next: (response) => {

        console.log('Products API Response:', response);

        this.products = response.products;
        this.pageNumber = response.pageNumber;
        this.pageSize = response.pageSize;
        this.totalPages = response.totalPages;
        this.totalRecords = response.totalRecords;

        this.isLoading = false;

        this.cdr.detectChanges();
      },

      error: (error) => {

        console.error('Product loading failed:', error);

        this.errorMessage = 'Unable to load products.';

        this.isLoading = false;

        this.cdr.detectChanges();
      }

    });
  }

  // Load Categories
  loadCategories(): void {

    this.categoryService.getCategories(1, 100, true).subscribe({

      next: (response) => {

        this.categories = response.categories;

        this.cdr.detectChanges();
      },

      error: (error) => {

        console.error('Category loading failed:', error);

        this.cdr.detectChanges();
      }

    });
  }

  // Open Add Product Form
  openAddForm(): void {

    this.isEditMode = false;
    this.editingProductId = 0;

    this.resetForm();

    this.showAddForm = true;
    this.errorMessage = '';
    this.successMessage = '';

  }

  // Open Edit Product Form
  openEditForm(product: Product): void {

    this.isEditMode = true;
    this.editingProductId = product.productId;

    this.newProduct = {
      productName: product.productName,
      description: product.description || '',
      price: product.price,
      stockQuantity: product.stockQuantity,
      imageUrl: product.imageUrl || '',
      brand: product.brand || '',
      categoryId: product.categoryId
    };

    this.showAddForm = true;
    this.errorMessage = '';
    this.successMessage = '';

  }

  // Cancel Form
  cancelAdd(): void {

    this.showAddForm = false;
    this.isEditMode = false;
    this.editingProductId = 0;

    this.resetForm();

    this.errorMessage = '';

  }

  // Reset Form
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

  // Add or Update Product
  saveProduct(): void {

    if (
      !this.newProduct.productName.trim() ||
      this.newProduct.price <= 0 ||
      this.newProduct.stockQuantity < 0 ||
      this.newProduct.categoryId <= 0
    ) {

      this.errorMessage =
        'Please enter valid product details and select a category.';

      return;
    }

    this.isSaving = true;
    this.errorMessage = '';
    this.successMessage = '';

    if (this.isEditMode) {

      const updateProduct: UpdateProduct = {
        productName: this.newProduct.productName,
        description: this.newProduct.description,
        price: this.newProduct.price,
        stockQuantity: this.newProduct.stockQuantity,
        imageUrl: this.newProduct.imageUrl,
        brand: this.newProduct.brand,
        categoryId: this.newProduct.categoryId,
        isActive: true
      };

      this.productService.updateProduct(
        this.editingProductId,
        updateProduct
      ).subscribe({

        next: () => {

          this.isSaving = false;
          this.showAddForm = false;
          this.isEditMode = false;
          this.editingProductId = 0;

          this.resetForm();

          this.successMessage = 'Product updated successfully!';

          this.loadProducts();

          this.cdr.detectChanges();
        },

        error: (error) => {

          console.error('Update product failed:', error);

          this.isSaving = false;

          this.errorMessage =
            error.status === 409
              ? 'This product already exists.'
              : 'Unable to update product. Please try again.';

          this.cdr.detectChanges();
        }

      });

    } else {

      this.productService.createProduct(this.newProduct).subscribe({

        next: () => {

          this.isSaving = false;
          this.showAddForm = false;

          this.resetForm();

          this.successMessage = 'Product added successfully!';

          this.pageNumber = 1;

          this.loadProducts();

          this.cdr.detectChanges();
        },

        error: (error) => {

          console.error('Add product failed:', error);

          this.isSaving = false;

          this.errorMessage =
            error.status === 409
              ? 'This product already exists.'
              : 'Unable to add product. Please try again.';

          this.cdr.detectChanges();
        }

      });

    }

  }

  // Delete Product
  deleteProduct(product: Product): void {

    const confirmed = window.confirm(
      `Are you sure you want to delete "${product.productName}"?`
    );

    if (!confirmed) {
      return;
    }

    this.deletingProductId = product.productId;
    this.errorMessage = '';
    this.successMessage = '';

    this.productService.deleteProduct(product.productId).subscribe({

      next: () => {

        this.deletingProductId = null;

        this.successMessage = 'Product deleted successfully!';

        // Move to previous page if current page becomes empty
        if (this.products.length === 1 && this.pageNumber > 1) {
          this.pageNumber--;
        }

        this.loadProducts();

        this.cdr.detectChanges();

      },

      error: (error) => {

        console.error('Delete product failed:', error);

        this.deletingProductId = null;

        this.errorMessage =
          'Unable to delete product. Please try again.';

        this.cdr.detectChanges();

      }

    });

  }

  // Previous Page
  previousPage(): void {

    if (this.pageNumber > 1) {

      this.pageNumber--;

      this.loadProducts();

    }

  }

  // Next Page
  nextPage(): void {

    if (this.pageNumber < this.totalPages) {

      this.pageNumber++;

      this.loadProducts();

    }

  }

}
