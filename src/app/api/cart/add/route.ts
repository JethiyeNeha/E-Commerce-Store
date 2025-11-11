import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/store";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, productId, name, price, quantity } = body;

    // Validation
    if (
      !userId ||
      !productId ||
      !name ||
      price === undefined ||
      quantity === undefined
    ) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: userId, productId, name, price, quantity",
        },
        { status: 400 }
      );
    }

    if (typeof price !== "number" || typeof quantity !== "number") {
      return NextResponse.json(
        { error: "Price and quantity must be numbers" },
        { status: 400 }
      );
    }

    if (price < 0 || quantity < 1) {
      return NextResponse.json(
        { error: "Invalid price or quantity" },
        { status: 400 }
      );
    }

    const cart = store.addToCart(userId, {
      productId,
      name,
      price,
      quantity,
    });

    return NextResponse.json({
      success: true,
      cart,
      message: "Item added to cart successfully",
    });
  } catch (error) {
    console.error("Error adding to cart:", error);
    return NextResponse.json(
      { error: "Failed to add item to cart" },
      { status: 500 }
    );
  }
}
