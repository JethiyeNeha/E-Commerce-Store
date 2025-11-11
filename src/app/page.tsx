"use client";

import { useEffect, useState } from "react";
import { ShoppingCart, CheckCircle2 } from "lucide-react";
import { useCart } from "./context/CartContext";
import { Product } from "./types";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [addedToCart, setAddedToCart] = useState<string | null>(null);
  const { addToCart, isLoading: cartLoading } = useCart();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products");
      const data = await response.json();
      if (data.success) {
        setProducts(data.products);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (product: Product) => {
    try {
      await addToCart({
        productId: product.id,
        name: product.name,
        price: product.price,
      });

      setAddedToCart(product.id);
      setTimeout(() => setAddedToCart(null), 2000);
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Failed to add item to cart");
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-300 h-64 rounded-t-lg"></div>
              <div className="bg-white p-4 rounded-b-lg">
                <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Featured Products
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Discover our curated collection of premium electronics and
          accessories. Every 5th order gets a 10% discount code!
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="group bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden"
          >
            <div className="relative h-64 bg-gray-100 overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute top-4 right-4 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                {product.category}
              </div>
            </div>

            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
                {product.name}
              </h3>
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {product.description}
              </p>

              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-gray-900">
                  ${product.price.toFixed(2)}
                </span>

                <button
                  onClick={() => handleAddToCart(product)}
                  disabled={cartLoading && addedToCart === product.id}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    addedToCart === product.id
                      ? "bg-green-600 text-white"
                      : "bg-blue-600 hover:bg-blue-700 text-white hover:shadow-lg"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {addedToCart === product.id ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Added!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4" />
                      <span>Add</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-white text-center">
        <h2 className="text-2xl font-bold mb-2">🎉 Special Offer!</h2>
        <p className="text-lg">
          Every 5th order receives a 10% discount code for their next purchase
        </p>
      </div>
    </div>
  );
}
