import { NextRequest, NextResponse } from 'next/server';
import { store } from '../../../../../lib/store';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderNumber } = body;

    if (!orderNumber || orderNumber < 1) {
      return NextResponse.json(
        { error: 'Valid order number is required' },
        { status: 400 }
      );
    }

    const discountCode = store.generateDiscountCode(orderNumber);

    return NextResponse.json({
      success: true,
      discountCode,
      message: 'Discount code generated successfully'
    });
  } catch (error) {
    console.error('Error generating discount code:', error);
    return NextResponse.json(
      { error: 'Failed to generate discount code' },
      { status: 500 }
    );
  }
}

// Get available discount code
export async function GET() {
  try {
    const availableCode = store.getAvailableDiscountCode();

    if (!availableCode) {
      return NextResponse.json({
        success: true,
        discountCode: null,
        message: 'No available discount codes'
      });
    }

    return NextResponse.json({
      success: true,
      discountCode: availableCode
    });
  } catch (error) {
    console.error('Error fetching discount code:', error);
    return NextResponse.json(
      { error: 'Failed to fetch discount code' },
      { status: 500 }
    );
  }
}