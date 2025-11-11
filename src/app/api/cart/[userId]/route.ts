import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/store';

interface RouteParams {
  params: Promise<{ userId: string }>;
}

export async function GET(
  request: NextRequest,
  context: RouteParams
) {
  try {
    const params = await context.params;
    const userId = params.userId;

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const cart = store.getCart(userId);

    if (!cart || cart.items.length === 0) {
      return NextResponse.json({
        success: true,
        cart: { userId, items: [] },
        total: 0,
        message: 'Cart is empty'
      });
    }

    // Calculate cart total
    const total = cart.items.reduce(
      (sum, item) => sum + (item.price * item.quantity),
      0
    );

    return NextResponse.json({
      success: true,
      cart,
      total
    });
  } catch (error) {
    console.error('Error fetching cart:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cart' },
      { status: 500 }
    );
  }
}