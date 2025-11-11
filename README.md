# 🛒 E-Commerce Store with Discount System

A modern, full-stack e-commerce application built with Next.js 16, TypeScript, and TailwindCSS. Features an intelligent discount code system that rewards every nth order with automatic coupon generation.

## Features

### Customer Features
- **Product Browsing**: Browse a curated collection of products with beautiful card layouts
- **Shopping Cart**: Add, remove, and manage items in your cart
- **Smart Checkout**: Apply discount codes during checkout with real-time validation
- **Order Confirmation**: Beautiful success page with order details
- **Automatic Discounts**: Every 5th order automatically generates a 10% discount code

### Admin Features
- **Dashboard Analytics**: Real-time statistics and metrics
- **Order Management**: View all orders with detailed information
- **Discount Code Tracking**: Monitor generated codes and usage status
- **Revenue Insights**: Track total sales and discount amounts

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Icons**: Lucide React
- **State Management**: React Context API
- **API**: Next.js API Routes (Node.js)
- **Storage**: In-memory store (as per requirements)

## Project Structure

```
├── app/
│   ├── api/                    # API routes
│   │   ├── cart/              # Cart operations
│   │   ├── checkout/          # Checkout process
│   │   ├── admin/             # Admin endpoints
│   │   └── products/          # Products endpoint
│   ├── cart/                  # Cart page
│   ├── checkout/              # Checkout page
│   ├── success/               # Order success page
│   ├── admin/                 # Admin dashboard
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Home/Products page
├── components/
│   └── Navbar.tsx             # Navigation component
├── context/
│   └── CartContext.tsx        # Cart state management
├── lib/
│   └── store.ts               # In-memory data store
├── types/
│   └── index.ts               # TypeScript interfaces
└── README.md                  # This file
```

## Installation & Setup

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Steps

1. **Clone the repository**
```bash
git clone https://github.com/JethiyeNeha/E-Commerce-Store.git
```

2. **Install dependencies**
```bash
npm install
```

3. **Run the development server**
```bash
npm run dev
```

4. **Open in browser**
```
http://localhost:3000
```

## Usage Guide

### For Customers

1. **Browse Products**
   - Visit the homepage to see all available products
   - Click "Add" to add items to your cart

2. **Manage Cart**
   - Click the cart icon in the navigation
   - Review items and quantities
   - Remove items if needed

3. **Checkout**
   - Click "Proceed to Checkout" from cart
   - Enter discount code if available
   - Click "Apply" to validate the code
   - Complete the order

4. **View Order Confirmation**
   - See order details and total
   - Check if you unlocked a new discount code

### For Admins

1. **Access Dashboard**
   - Click "Admin" in the navigation
   - View real-time statistics:
     - Total orders
     - Revenue
     - Items sold
     - Discount amounts

2. **Monitor Discount Codes**
   - See all generated codes
   - Check usage status
   - Track which orders used codes

3. **Review Orders**
   - View complete order history
   - See items, totals, and discounts
   - Monitor order dates

## Key Business Logic

### Discount Code System

- **Generation**: Automatic on every 5th order (configurable)
- **Amount**: 10% off the entire order
- **Usage**: Single-use per code
- **Validation**: Real-time during checkout
- **Availability**: Only one unused code available at a time

### Order Flow

1. User adds items to cart
2. User proceeds to checkout
3. Optional: User applies discount code
4. System validates code (if provided)
5. Order is created
6. Cart is cleared
7. If 5th order: New discount code generated
8. User sees confirmation

## Testing

### API Testing with Postman

Import the provided `E-Commerce-API.postman_collection.json` file for comprehensive API testing.


## API Documentation

### Quick Reference

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/products` | GET | Get all products |
| `/api/cart/add` | POST | Add item to cart |
| `/api/cart/[userId]` | GET | Get user's cart |
| `/api/cart/remove` | DELETE | Remove item from cart |
| `/api/checkout` | POST | Process checkout |
| `/api/admin/stats` | GET | Get admin statistics |
| `/api/admin/generate-code` | POST/GET | Generate or get discount code |

## Configuration

### Adjust Discount Settings

Edit `lib/store.ts`:

```typescript
private readonly NTH_ORDER = 5;         // Change order frequency
private readonly DISCOUNT_PERCENTAGE = 10;  // Change discount amount
```

### Modify User ID

Edit `context/CartContext.tsx`:

```typescript
const USER_ID = 'user123';  // Change default user
```

## Deployment

- **Live App:**   [E-Commerce-App](https://e-commerce-store-gules-ten.vercel.app/)  



### Assumptions Made

1. In-memory storage (data resets on server restart)
2. Single user simulation (real app would need authentication)
3. Mock payment processing (no real transactions)
4. Simplified product catalog (in production, would use database)


---

**Note**: This is a demonstration project with simulated payment and in-memory storage. For production use, implement proper authentication, persistent storage, and payment processing.
