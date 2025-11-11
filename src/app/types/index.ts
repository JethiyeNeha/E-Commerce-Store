export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Cart {
  userId: string;
  items: CartItem[];
}

export interface Order {
  orderId: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
  discountApplied: number;
  discountCode?: string;
  orderNumber: number;
  timestamp: Date;
}

export interface DiscountCode {
  code: string;
  discountPercentage: number;
  isUsed: boolean;
  generatedForOrderNumber: number;
  usedByOrderId?: string;
}

export interface AdminStats {
  totalOrders: number;
  totalItemsPurchased: number;
  totalPurchaseAmount: number;
  totalDiscountAmount: number;
  discountCodes: DiscountCode[];
  orders: Order[];
}