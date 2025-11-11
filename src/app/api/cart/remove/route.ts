import { NextRequest, NextResponse } from 'next/server';
import { store } from '../../../../../lib/store';

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, productId } = body;

    if (!userId || !productId) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, productId' },
        { status: 400 }
      );
    }

    const cart = store.removeFromCart(userId, productId);

    if (!cart) {
      return NextResponse.json(
        { error: 'Cart not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      cart,
      message: 'Item removed from cart successfully'
    });
  } catch (error) {
    console.error('Error removing from cart:', error);
    return NextResponse.json(
      { error: 'Failed to remove item from cart' },
      { status: 500 }
    );
  }
}