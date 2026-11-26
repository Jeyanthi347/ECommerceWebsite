
export interface Customer {
  id: string;
  fullName: string;
  email: string;
  phoneNumber?: string | null;
  isActive: boolean;
  createdAt: string;
}

export interface CustomerListResponse {
  customers: Customer[];
  pageNumber: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
}

export interface UpdateCustomerStatus {
  isActive: boolean;
}
