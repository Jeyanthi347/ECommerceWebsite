
export interface Category {
  categoryId: number;
  categoryName: string;
  description: string;
  imageUrl: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string | null;
  productCount: number;
}

export interface CategoryListResponse {
  categories: Category[];
  pageNumber: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
}

export interface CreateCategory {
  categoryName: string;
  description: string;
  imageUrl: string;
}

export interface UpdateCategory {
  categoryName: string;
  description: string;
  imageUrl: string;
  isActive: boolean;
}
