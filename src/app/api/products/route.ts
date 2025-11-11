import { NextResponse } from 'next/server';

const products = [
  {
    id: 'prod-1',
    name: 'Wireless Headphones',
    description: 'Premium noise-cancelling wireless headphones with 30-hour battery life',
    price: 299.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
    category: 'Electronics'
  },
  {
    id: 'prod-2',
    name: 'Smart Watch',
    description: 'Fitness tracking smart watch with heart rate monitor and GPS',
    price: 399.99,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
    category: 'Electronics'
  },
  {
    id: 'prod-3',
    name: 'Laptop Backpack',
    description: 'Water-resistant backpack with laptop compartment and USB charging port',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500',
    category: 'Accessories'
  },
  {
    id: 'prod-4',
    name: 'Mechanical Keyboard',
    description: 'RGB backlit mechanical keyboard with blue switches',
    price: 149.99,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500',
    category: 'Electronics'
  },
  {
    id: 'prod-5',
    name: 'Wireless Mouse',
    description: 'Ergonomic wireless mouse with precision tracking',
    price: 49.99,
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500',
    category: 'Electronics'
  },
  {
    id: 'prod-6',
    name: 'USB-C Hub',
    description: '7-in-1 USB-C hub with HDMI, USB 3.0, and SD card reader',
    price: 59.99,
    image: 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=500',
    category: 'Accessories'
  },
  {
    id: 'prod-7',
    name: 'Bluetooth Speaker',
    description: 'Portable waterproof speaker with 360° sound',
    price: 129.99,
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500',
    category: 'Electronics'
  },
  {
    id: 'prod-8',
    name: 'Phone Stand',
    description: 'Adjustable aluminum phone and tablet stand',
    price: 29.99,
    image: 'https://images.unsplash.com/photo-1572635196243-4dd75fbdbd7f?w=500',
    category: 'Accessories'
  }
];

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      products
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}