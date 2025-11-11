"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Cart, CartItem } from "../types";

interface CartContextType {
  cart: Cart | null;
  cartCount: number;
  cartTotal: number;
  isLoading: boolean;
  addToCart: (
    item: Omit<CartItem, "quantity"> & { quantity?: number }
  ) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  refreshCart: () => Promise<void>;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const USER_ID = "user123";

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Calculate cart count and total
  const cartCount =
    cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0;
  const cartTotal =
    cart?.items.reduce((sum, item) => sum + item.price * item.quantity, 0) || 0;

  // Fetch cart on mount
  useEffect(() => {
    refreshCart();
  }, []);

  const refreshCart = async () => {
    try {
      const response = await fetch(`/api/cart/${USER_ID}`);
      const data = await response.json();

      if (data.success) {
        setCart(data.cart);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  const addToCart = async (
    item: Omit<CartItem, "quantity"> & { quantity?: number }
  ) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: USER_ID,
          productId: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity || 1,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setCart(data.cart);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = async (productId: string) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/cart/remove", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: USER_ID,
          productId,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setCart(data.cart);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error("Error removing from cart:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = () => {
    setCart({ userId: USER_ID, items: [] });
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        cartTotal,
        isLoading,
        addToCart,
        removeFromCart,
        refreshCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
