"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CreditCard, Tag, CheckCircle2, AlertCircle } from "lucide-react";
import { useCart } from "../context/CartContext";

const USER_ID = "user123";

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart();
  const router = useRouter();
  const [discountCode, setDiscountCode] = useState("");
  const [discountApplied, setDiscountApplied] = useState(0);
  const [discountError, setDiscountError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const finalTotal = cartTotal - discountApplied;

  const handleApplyDiscount = async () => {
    if (!discountCode.trim()) {
      setDiscountError("Please enter a discount code");
      return;
    }

    setDiscountError("");

    // Calculate discount (10% for valid codes)
    // We'll validate this during checkout
    const potentialDiscount = cartTotal * 0.1;
    setDiscountApplied(potentialDiscount);
  };

  const handleRemoveDiscount = () => {
    setDiscountCode("");
    setDiscountApplied(0);
    setDiscountError("");
  };

  const handleCheckout = async () => {
    console.log("Initiating checkout with discount code:", discountCode);
    setIsProcessing(true);
    setDiscountError("");

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: USER_ID,
          discountCode: discountCode.trim() || undefined,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Clear cart and redirect to success page
        setCheckoutSuccess(true);
        clearCart();
        router.push(
          `/success?orderId=${data.order.orderId}&total=${data.order.totalAmount}`
        );
      } else {
        setDiscountError(data.error || "Checkout failed");
        setDiscountApplied(0);
      }
    } catch (error) {
      console.error("Checkout error:", error);
      setDiscountError("Failed to process checkout. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Redirect if cart is empty (using useEffect to avoid render issues)
  useEffect(() => {
    if (!checkoutSuccess && (!cart || cart.items.length === 0)) {
      router.push("/cart");
    }
  }, [cart, router, checkoutSuccess]);

  if (!cart || cart.items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <div className="animate-pulse">Redirecting to cart...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Order Summary */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Order Summary
          </h2>
          <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
            {cart.items.map((item) => (
              <div key={item.productId} className="flex justify-between">
                <div>
                  <p className="font-medium text-gray-900">{item.name}</p>
                  <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                </div>
                <p className="font-semibold text-gray-900">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>

              {discountApplied > 0 && (
                <div className="flex justify-between text-green-600 font-medium">
                  <span>Discount (10%)</span>
                  <span>-${discountApplied.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between text-lg font-bold text-gray-900 border-t pt-2">
                <span>Total</span>
                <span>${finalTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Section */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Payment Details
          </h2>

          {/* Discount Code Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <label className="block text-sm font-medium text-gray-900 mb-2">
              <Tag className="inline w-4 h-4 mr-1" />
              Have a discount code?
            </label>

            <div className="flex space-x-2 mb-2">
              <input
                type="text"
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                placeholder="Enter discount code"
                disabled={discountApplied > 0}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              />

              {discountApplied > 0 ? (
                <button
                  onClick={handleRemoveDiscount}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Remove
                </button>
              ) : (
                <button
                  onClick={handleApplyDiscount}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Apply
                </button>
              )}
            </div>

            {discountError && (
              <div className="flex items-center space-x-2 text-red-600 text-sm mt-2">
                <AlertCircle className="w-4 h-4" />
                <span>{discountError}</span>
              </div>
            )}

            {discountApplied > 0 && !discountError && (
              <div className="flex items-center space-x-2 text-green-600 text-sm mt-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Discount code applied successfully!</span>
              </div>
            )}
          </div>

          {/* Mock Payment Form */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <label className="block text-sm font-medium text-gray-900 mb-2">
              <CreditCard className="inline w-4 h-4 mr-1" />
              Card Information (Demo Only)
            </label>
            <input
              type="text"
              placeholder="1234 5678 9012 3456"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-3"
              disabled
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="MM/YY"
                className="px-4 py-2 border border-gray-300 rounded-lg"
                disabled
              />
              <input
                type="text"
                placeholder="CVV"
                className="px-4 py-2 border border-gray-300 rounded-lg"
                disabled
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              This is a demo. No real payment processing.
            </p>
          </div>

          {/* Place Order Button */}
          <button
            onClick={handleCheckout}
            disabled={isProcessing}
            className="w-full bg-green-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-green-700 transition-colors shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isProcessing ? (
              <span>Processing...</span>
            ) : (
              <>
                <CheckCircle2 className="w-6 h-6" />
                <span>Place Order - ${finalTotal.toFixed(2)}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
