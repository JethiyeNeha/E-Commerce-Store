import { store } from '../store';

describe('Store - Cart Operations', () => {
  beforeEach(() => {
    // In a real scenario, we'd reset the store between tests
    // For this demo, tests should be run in order
  });

  test('should add item to cart', () => {
    const cart = store.addToCart('user1', {
      productId: 'prod-1',
      name: 'Test Product',
      price: 100,
      quantity: 1,
    });

    expect(cart).toBeDefined();
    expect(cart.userId).toBe('user1');
    expect(cart.items.length).toBe(1);
    expect(cart.items[0].productId).toBe('prod-1');
    expect(cart.items[0].quantity).toBe(1);
  });

  test('should increase quantity when adding same product', () => {
    // Start fresh for this test
    const cart = store.addToCart('user-qty-test', {
      productId: 'prod-qty',
      name: 'Quantity Test Product',
      price: 100,
      quantity: 1,
    });

    const updatedCart = store.addToCart('user-qty-test', {
      productId: 'prod-qty',
      name: 'Quantity Test Product',
      price: 100,
      quantity: 2,
    });

    expect(updatedCart.items.length).toBe(1);
    expect(updatedCart.items[0].quantity).toBe(3); // 1 + 2
  });

  test('should get cart by user ID', () => {
    const cart = store.getCart('user1');

    expect(cart).toBeDefined();
    expect(cart?.userId).toBe('user1');
  });

  test('should remove item from cart', () => {
    const cart = store.removeFromCart('user1', 'prod-1');

    expect(cart).toBeDefined();
    expect(cart?.items.length).toBe(0);
  });

  test('should return null for non-existent cart', () => {
    const cart = store.getCart('non-existent-user');
    expect(cart).toBeNull();
  });
});

describe('Store - Checkout Operations', () => {
  test('should fail checkout with empty cart', () => {
    const result = store.checkout('empty-user');

    expect(result.success).toBe(false);
    expect(result.error).toBe('Cart is empty');
  });

  test('should successfully checkout with items', () => {
    // Add items first
    store.addToCart('user2', {
      productId: 'prod-2',
      name: 'Product 2',
      price: 200,
      quantity: 1,
    });

    const result = store.checkout('user2');

    expect(result.success).toBe(true);
    expect(result.order).toBeDefined();
    expect(result.order?.totalAmount).toBe(200);
    expect(result.order?.discountApplied).toBe(0);
  });

  test('should clear cart after successful checkout', () => {
    store.addToCart('user3', {
      productId: 'prod-3',
      name: 'Product 3',
      price: 150,
      quantity: 1,
    });

    store.checkout('user3');
    const cart = store.getCart('user3');

    expect(cart).toBeNull();
  });
});

describe('Store - Discount Code System', () => {
  test('should generate discount code on every 5th order', () => {
    // Create 5 orders
    for (let i = 1; i <= 5; i++) {
      const userId = `discount-user-${i}`;
      store.addToCart(userId, {
        productId: `prod-${i}`,
        name: `Product ${i}`,
        price: 100,
        quantity: 1,
      });
      store.checkout(userId);
    }

    const stats = store.getAdminStats();
    expect(stats.discountCodes.length).toBeGreaterThan(0);
  });

  test('should fail checkout with invalid discount code', () => {
    store.addToCart('user4', {
      productId: 'prod-4',
      name: 'Product 4',
      price: 100,
      quantity: 1,
    });

    const result = store.checkout('user4', 'INVALID-CODE');

    expect(result.success).toBe(false);
    expect(result.error).toBe('Invalid discount code');
  });

  test('should apply valid discount code', () => {
    // Get available discount code
    const availableCode = store.getAvailableDiscountCode();
    
    if (availableCode) {
      store.addToCart('user5', {
        productId: 'prod-5',
        name: 'Product 5',
        price: 100,
        quantity: 1,
      });

      const result = store.checkout('user5', availableCode.code);

      expect(result.success).toBe(true);
      expect(result.order?.discountApplied).toBe(10); // 10% of 100
      expect(result.order?.totalAmount).toBe(90); // 100 - 10
    }
  });

  test('should mark discount code as used after checkout', () => {
    const availableCode = store.getAvailableDiscountCode();
    
    if (availableCode) {
      store.addToCart('user6', {
        productId: 'prod-6',
        name: 'Product 6',
        price: 200,
        quantity: 1,
      });

      store.checkout('user6', availableCode.code);

      // Try using same code again
      store.addToCart('user7', {
        productId: 'prod-7',
        name: 'Product 7',
        price: 150,
        quantity: 1,
      });

      const result = store.checkout('user7', availableCode.code);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Discount code already used');
    }
  });

  test('should manually generate discount code', () => {
    const discountCode = store.generateDiscountCode(100);

    expect(discountCode).toBeDefined();
    expect(discountCode.code).toContain('DISCOUNT100');
    expect(discountCode.discountPercentage).toBe(10);
    expect(discountCode.isUsed).toBe(false);
  });
});

describe('Store - Admin Statistics', () => {
  test('should return correct admin statistics', () => {
    const stats = store.getAdminStats();

    expect(stats).toBeDefined();
    expect(typeof stats.totalOrders).toBe('number');
    expect(typeof stats.totalItemsPurchased).toBe('number');
    expect(typeof stats.totalPurchaseAmount).toBe('number');
    expect(typeof stats.totalDiscountAmount).toBe('number');
    expect(Array.isArray(stats.discountCodes)).toBe(true);
    expect(Array.isArray(stats.orders)).toBe(true);
  });

  test('should track total items purchased correctly', () => {
    store.addToCart('stats-user', {
      productId: 'prod-stats',
      name: 'Stats Product',
      price: 50,
      quantity: 3,
    });

    const beforeStats = store.getAdminStats();
    const beforeItems = beforeStats.totalItemsPurchased;

    store.checkout('stats-user');

    const afterStats = store.getAdminStats();
    expect(afterStats.totalItemsPurchased).toBe(beforeItems + 3);
  });

  test('should track total purchase amount correctly', () => {
    store.addToCart('amount-user', {
      productId: 'prod-amount',
      name: 'Amount Product',
      price: 250,
      quantity: 2,
    });

    const beforeStats = store.getAdminStats();
    const beforeAmount = beforeStats.totalPurchaseAmount;

    store.checkout('amount-user');

    const afterStats = store.getAdminStats();
    expect(afterStats.totalPurchaseAmount).toBe(beforeAmount + 500);
  });
});

describe('Store - Edge Cases', () => {
  test('should handle multiple items in cart', () => {
    store.addToCart('multi-user', {
      productId: 'prod-a',
      name: 'Product A',
      price: 100,
      quantity: 1,
    });

    store.addToCart('multi-user', {
      productId: 'prod-b',
      name: 'Product B',
      price: 200,
      quantity: 2,
    });

    const cart = store.getCart('multi-user');

    expect(cart?.items.length).toBe(2);
    
    const result = store.checkout('multi-user');
    expect(result.order?.totalAmount).toBe(500); // 100 + (200 * 2)
  });

  test('should handle zero quantity gracefully', () => {
    const cart = store.addToCart('zero-user', {
      productId: 'prod-zero',
      name: 'Zero Product',
      price: 100,
      quantity: 0,
    });

    expect(cart.items[0].quantity).toBe(0);
  });

  test('should handle decimal prices', () => {
    store.addToCart('decimal-user', {
      productId: 'prod-decimal',
      name: 'Decimal Product',
      price: 99.99,
      quantity: 1,
    });

    const result = store.checkout('decimal-user');
    expect(result.order?.totalAmount).toBe(99.99);
  });
});