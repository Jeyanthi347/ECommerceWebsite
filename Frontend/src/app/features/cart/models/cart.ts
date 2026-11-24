
export interface CartItem {
  cartItemId: number;
  productId: number;
  productName: string;
  imageUrl: string | null;
  price: number;
  quantity: number;
  subTotal: number;
}

export interface Cart {
  cartId: number;
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
}

export interface AddToCart {
  productId: number;
  quantity: number;
}

export interface UpdateCartItem {
  quantity: number;
}
