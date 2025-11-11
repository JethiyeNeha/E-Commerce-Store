/**
 * API Integration Tests
 * 
 * These tests verify the API endpoints work correctly.
 * Note: These are integration tests that require the dev server to be running.
 * Run with: npm run dev (in another terminal) then npm test
 * 
 * For CI/CD, these tests are skipped. Use manual testing or E2E framework.
 */

describe.skip('API Endpoints - Integration (requires dev server)', () => {
  const BASE_URL = 'http://localhost:3000/api';
  
  describe('Products API', () => {
    test('GET /api/products should return products', async () => {
      const response = await fetch(`${BASE_URL}/products`);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(Array.isArray(data.products)).toBe(true);
      expect(data.products.length).toBeGreaterThan(0);
    });

    test('Product should have required fields', async () => {
      const response = await fetch(`${BASE_URL}/products`);
      const data = await response.json();
      const product = data.products[0];

      expect(product).toHaveProperty('id');
      expect(product).toHaveProperty('name');
      expect(product).toHaveProperty('price');
      expect(product).toHaveProperty('description');
      expect(product).toHaveProperty('image');
    });
  });

  describe('Cart API', () => {
    const testUserId = `test-${Date.now()}`;

    test('POST /api/cart/add should add item to cart', async () => {
      const response = await fetch(`${BASE_URL}/cart/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: testUserId,
          productId: 'test-prod-1',
          name: 'Test Product',
          price: 99.99,
          quantity: 1,
        }),
      });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.cart).toBeDefined();
      expect(data.cart.items.length).toBeGreaterThan(0);
    });

    test('GET /api/cart/[userId] should return cart', async () => {
      const response = await fetch(`${BASE_URL}/cart/${testUserId}`);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.cart).toBeDefined();
    });

    test('DELETE /api/cart/remove should remove item', async () => {
      const response = await fetch(`${BASE_URL}/cart/remove`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: testUserId,
          productId: 'test-prod-1',
        }),
      });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
    });

    test('POST /api/cart/add should validate required fields', async () => {
      const response = await fetch(`${BASE_URL}/cart/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: testUserId,
          // Missing required fields
        }),
      });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBeDefined();
    });
  });

  describe('Checkout API', () => {
    const checkoutUserId = `checkout-${Date.now()}`;

    test('POST /api/checkout should fail with empty cart', async () => {
      const response = await fetch(`${BASE_URL}/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: checkoutUserId,
        }),
      });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Cart is empty');
    });

    test('POST /api/checkout should succeed with items in cart', async () => {
      // Add item first
      await fetch(`${BASE_URL}/cart/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: checkoutUserId,
          productId: 'checkout-prod',
          name: 'Checkout Product',
          price: 150,
          quantity: 1,
        }),
      });

      // Then checkout
      const response = await fetch(`${BASE_URL}/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: checkoutUserId,
        }),
      });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.order).toBeDefined();
      expect(data.order.orderId).toBeDefined();
    });

    test('POST /api/checkout should fail with invalid discount code', async () => {
      const invalidUserId = `invalid-${Date.now()}`;
      
      // Add item
      await fetch(`${BASE_URL}/cart/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: invalidUserId,
          productId: 'invalid-prod',
          name: 'Invalid Product',
          price: 100,
          quantity: 1,
        }),
      });

      // Checkout with invalid code
      const response = await fetch(`${BASE_URL}/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: invalidUserId,
          discountCode: 'INVALID-CODE-123',
        }),
      });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Invalid discount code');
    });
  });

  describe('Admin API', () => {
    test('GET /api/admin/stats should return statistics', async () => {
      const response = await fetch(`${BASE_URL}/admin/stats`);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.stats).toBeDefined();
      expect(typeof data.stats.totalOrders).toBe('number');
      expect(typeof data.stats.totalPurchaseAmount).toBe('number');
    });

    test('POST /api/admin/generate-code should create discount code', async () => {
      const response = await fetch(`${BASE_URL}/admin/generate-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderNumber: 999,
        }),
      });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.discountCode).toBeDefined();
      expect(data.discountCode.code).toBeDefined();
    });

    test('GET /api/admin/generate-code should return available code', async () => {
      const response = await fetch(`${BASE_URL}/admin/generate-code`);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      // discountCode can be null if none available
    });
  });
});

// Export for documentation purposes
export const API_TEST_SCENARIOS = {
  products: 'Fetches product catalog',
  cart: 'Manages shopping cart operations',
  checkout: 'Processes orders and validates discounts',
  admin: 'Provides statistics and discount code management',
};