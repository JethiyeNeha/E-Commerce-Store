'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, ArrowRight, Home } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Suspense } from 'react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const total = searchParams.get('total');
  const [availableDiscount, setAvailableDiscount] = useState<string | null>(null);

  useEffect(() => {
    // Check if a new discount code is available
    checkForNewDiscount();
  }, []);

  const checkForNewDiscount = async () => {
    try {
      const response = await fetch('/api/admin/generate-code');
      const data = await response.json();
      if (data.success && data.discountCode && !data.discountCode.isUsed) {
        setAvailableDiscount(data.discountCode.code);
      }
    } catch (error) {
      console.error('Error checking for discount:', error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        {/* Success Icon */}
        <div className="mb-6">
          <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
          </div>
        </div>

        {/* Success Message */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Order Placed Successfully! 🎉
        </h1>
        <p className="text-gray-600 mb-6">
          Thank you for your purchase. Your order has been confirmed.
        </p>

        {/* Order Details */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-3">
            <span className="text-gray-600">Order ID:</span>
            <span className="font-mono font-bold text-gray-900">{orderId}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Total Amount:</span>
            <span className="text-2xl font-bold text-green-600">
              ${parseFloat(total || '0').toFixed(2)}
            </span>
          </div>
        </div>

        {/* Discount Code Alert */}
        {availableDiscount && (
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 mb-6 text-white">
            <h3 className="text-xl font-bold mb-2">🎁 Congratulations!</h3>
            <p className="mb-4">
              You've unlocked a discount code for your next purchase!
            </p>
            <div className="bg-white/20 rounded-lg p-4 backdrop-blur">
              <p className="text-sm mb-2">Your discount code:</p>
              <code className="text-2xl font-bold tracking-wider">
                {availableDiscount}
              </code>
              <p className="text-sm mt-2">10% off your next order</p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            <Home className="w-5 h-5" />
            <span>Back to Home</span>
          </Link>
          
          <Link
            href="/admin"
            className="inline-flex items-center justify-center space-x-2 bg-gray-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors"
          >
            <span>View Order History</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Additional Info */}
        <p className="text-sm text-gray-500 mt-8">
          A confirmation email has been sent to your registered email address.
        </p>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}