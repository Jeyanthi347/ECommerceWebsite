
export interface Product {
  productId: number;
  productName: string;
  description: string;
  price: number;
  stockQuantity: number;
  imageUrl: string;
  brand: string;
  categoryId: number;
  categoryName: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string | null;
}

export interface ProductListResponse {
  products: Product[];
  pageNumber: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
}

export interface CreateProduct {
  productName: string;
  description: string | null;
  price: number;
  stockQuantity: number;
  imageUrl: string | null;
  brand: string | null;
  categoryId: number;
}

export interface UpdateProduct {
  productName: string;
  description: string | null;
  price: number;
  stockQuantity: number;
  imageUrl: string | null;
  brand: string | null;
  categoryId: number;
  isActive: boolean;
}
