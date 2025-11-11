import { NextRequest, NextResponse } from 'next/server';
import { store } from '../../../../lib/store';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, discountCode } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const result = store.checkout(userId, discountCode);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      order: result.order,
      message: 'Order placed successfully'
    });
  } catch (error) {
    console.error('Error during checkout:', error);
    return NextResponse.json(
      { error: 'Failed to process checkout' },
      { status: 500 }
    );
  }
}