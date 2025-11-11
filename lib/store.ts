// lib/store.ts
// In-memory data store for the e-commerce application

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
  orderNumber: number; // Sequential order number
  timestamp: Date;
}

export interface DiscountCode {
  code: string;
  discountPercentage: number;
  isUsed: boolean;
  generatedForOrderNumber: number;
  usedByOrderId?: string;
}

// In-memory storage
class Store {
  private carts: Map<string, Cart> = new Map();
  private orders: Order[] = [];
  private discountCodes: Map<string, DiscountCode> = new Map();
  private orderCounter: number = 0;
  
  // Configuration
  private readonly NTH_ORDER = 5; // Every 5th order gets a discount code
  private readonly DISCOUNT_PERCENTAGE = 10;

  // Cart operations
  addToCart(userId: string, item: CartItem): Cart {
    let cart = this.carts.get(userId);
    
    if (!cart) {
      cart = { userId, items: [] };
      this.carts.set(userId, cart);
    }

    // Check if item already exists in cart
    const existingItem = cart.items.find(i => i.productId === item.productId);
    
    if (existingItem) {
      existingItem.quantity += item.quantity;
    } else {
      cart.items.push(item);
    }

    return cart;
  }

  getCart(userId: string): Cart | null {
    return this.carts.get(userId) || null;
  }

  removeFromCart(userId: string, productId: string): Cart | null {
    const cart = this.carts.get(userId);
    if (!cart) return null;

    cart.items = cart.items.filter(item => item.productId !== productId);
    return cart;
  }

  clearCart(userId: string): void {
    this.carts.delete(userId);
  }

  // Order operations
  checkout(userId: string, discountCode?: string): { success: boolean; order?: Order; error?: string } {
    const cart = this.carts.get(userId);
    
    if (!cart || cart.items.length === 0) {
      return { success: false, error: 'Cart is empty' };
    }

    // Calculate total
    const totalAmount = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    let discountApplied = 0;
    let validatedDiscountCode: string | undefined;

    // Validate discount code if provided
    if (discountCode) {
      const discount = this.discountCodes.get(discountCode);
      
      if (!discount) {
        return { success: false, error: 'Invalid discount code' };
      }
      
      if (discount.isUsed) {
        return { success: false, error: 'Discount code already used' };
      }

      discountApplied = (totalAmount * discount.discountPercentage) / 100;
      validatedDiscountCode = discountCode;
      
      // Mark discount as used
      discount.isUsed = true;
      discount.usedByOrderId = `ORDER-${this.orderCounter + 1}`;
    }

    // Create order
    this.orderCounter++;
    const order: Order = {
      orderId: `ORDER-${this.orderCounter}`,
      userId,
      items: [...cart.items],
      totalAmount: totalAmount - discountApplied,
      discountApplied,
      discountCode: validatedDiscountCode,
      orderNumber: this.orderCounter,
      timestamp: new Date()
    };

    this.orders.push(order);
    this.clearCart(userId);

    // Generate discount code if this is the nth order
    if (this.orderCounter % this.NTH_ORDER === 0) {
      this.generateDiscountCode(this.orderCounter);
    }

    return { success: true, order };
  }

  // Discount code operations
  generateDiscountCode(orderNumber: number): DiscountCode {
    const code = `DISCOUNT${orderNumber}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    
    const discountCode: DiscountCode = {
      code,
      discountPercentage: this.DISCOUNT_PERCENTAGE,
      isUsed: false,
      generatedForOrderNumber: orderNumber
    };

    this.discountCodes.set(code, discountCode);
    return discountCode;
  }

  getAvailableDiscountCode(): DiscountCode | null {
    // Get the most recent unused discount code
    const codes = Array.from(this.discountCodes.values());
    const availableCode = codes
      .filter(code => !code.isUsed)
      .sort((a, b) => b.generatedForOrderNumber - a.generatedForOrderNumber)[0];
    
    return availableCode || null;
  }

  // Admin operations
  getAdminStats() {
    const totalItemsPurchased = this.orders.reduce(
      (sum, order) => sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0),
      0
    );

    const totalPurchaseAmount = this.orders.reduce(
      (sum, order) => sum + order.totalAmount + order.discountApplied,
      0
    );

    const totalDiscountAmount = this.orders.reduce(
      (sum, order) => sum + order.discountApplied,
      0
    );

    const allDiscountCodes = Array.from(this.discountCodes.values()).map(code => ({
      code: code.code,
      discountPercentage: code.discountPercentage,
      isUsed: code.isUsed,
      generatedForOrderNumber: code.generatedForOrderNumber,
      usedByOrderId: code.usedByOrderId
    }));

    return {
      totalOrders: this.orders.length,
      totalItemsPurchased,
      totalPurchaseAmount,
      totalDiscountAmount,
      discountCodes: allDiscountCodes,
      orders: this.orders
    };
  }

  // Utility methods
  getAllOrders(): Order[] {
    return this.orders;
  }

  getOrderById(orderId: string): Order | undefined {
    return this.orders.find(order => order.orderId === orderId);
  }

  getNthOrderValue(): number {
    return this.NTH_ORDER;
  }
}

// Singleton instance
export const store = new Store();