import { NextResponse } from 'next/server';
import { store } from '../../../../../lib/store';

export async function GET() {
  try {
    const stats = store.getAdminStats();

    return NextResponse.json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch admin stats' },
      { status: 500 }
    );
  }
}