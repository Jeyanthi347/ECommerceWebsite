
export interface CreateOrder {
  fullName: string;
  phoneNumber: string;
  deliveryAddress: string;
  city: string;
  pincode: string;
}

export interface OrderItem {
  orderItemId: number;
  productId: number;
  productName: string;
  imageUrl: string | null;
  unitPrice: number;
  quantity: number;
  subTotal: number;
}

export interface OrderResponse {
  orderId: number;
  orderNumber: string;
  fullName: string;
  phoneNumber: string;
  deliveryAddress: string;
  city: string;
  pincode: string;
  orderDate: string;
  totalAmount: number;
  orderStatus: number;
  items: OrderItem[];
}

export interface PlaceOrderResponse {
  message: string;
  order: OrderResponse;
}



export interface OrderListResponse {
  orderId: number;
  orderNumber: string;
  orderDate: string;
  totalAmount: number;
  orderStatus: number;
  totalItems: number;
}
