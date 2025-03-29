"use client"

import { useEffect } from "react"
import { useCartStore } from "@/lib/store/cart-store"
import { useCurrentUser } from "@/lib/store/auth-store"
import { Button } from "@/components/ui/button"
import { Trash2, ChevronRight, ShoppingBag, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { PlaceOrderButton } from "@/components/cart/PlaceOrderButton"

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotal, clearCart } = useCartStore()
  const { isSignedIn } = useCurrentUser()
  const router = useRouter()

  // Prefetch checkout page
  useEffect(() => {
    router.prefetch('/checkout')
    router.prefetch('/order-history')
  }, [router])

  const handleCheckout = () => {
    if (!isSignedIn) {
      router.push("/sign-in?redirect=/checkout")
      return
    }
    router.push("/checkout")
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 pt-20">
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Your Cart</h1>
          <Link href="/" className="flex items-center text-red-600 hover:text-red-700">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Continue Shopping
          </Link>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <ShoppingBag className="h-20 w-20 text-gray-300 dark:text-gray-700" />
            <h2 className="mt-6 text-xl font-medium text-gray-900 dark:text-white">Your cart is empty</h2>
            <p className="mt-2 text-gray-500 dark:text-gray-400">Looks like you haven't added any items to your cart yet.</p>
            <Button asChild className="mt-8 bg-red-600 hover:bg-red-700">
              <Link href="/menu">
                Browse Menu
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm overflow-hidden border border-gray-200 dark:border-gray-800">
              <ul className="divide-y divide-gray-200 dark:divide-gray-800">
                {items.map((item) => (
                  <li key={item.id} className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">{item.menuItem?.name}</h3>
                        {item.special_instructions && (
                          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{item.special_instructions}</p>
                        )}
                        <div className="mt-4 flex items-center">
                          <div className="flex items-center rounded-md border border-gray-200 dark:border-gray-700">
                            <button
                              type="button"
                              className="px-3 py-1 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                              onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            >
                              -
                            </button>
                            <span className="px-3 text-sm font-medium">{item.quantity}</span>
                            <button
                              type="button"
                              className="px-3 py-1 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              +
                            </button>
                          </div>
                          <button
                            type="button"
                            className="ml-4 text-red-600 hover:text-red-800 dark:hover:text-red-400 flex items-center"
                            onClick={() => removeItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            <span>Remove</span>
                          </button>
                        </div>
                      </div>
                      <div className="mt-4 sm:mt-0 text-right">
                        <p className="text-lg font-medium text-gray-900 dark:text-white">
                          ${((item.menuItem?.price || 0) * item.quantity).toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          ${(item.menuItem?.price || 0).toFixed(2)} each
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm overflow-hidden border border-gray-200 dark:border-gray-800 p-6">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <p className="text-base text-gray-600 dark:text-gray-400">Subtotal</p>
                  <p className="text-base font-medium text-gray-900 dark:text-white">${getTotal().toFixed(2)}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-base text-gray-600 dark:text-gray-400">Tax (8.25%)</p>
                  <p className="text-base font-medium text-gray-900 dark:text-white">
                    ${(getTotal() * 0.0825).toFixed(2)}
                  </p>
                </div>
                <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
                  <div className="flex justify-between">
                    <p className="text-lg font-medium text-gray-900 dark:text-white">Total</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                      ${(getTotal() * 1.0825).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
              <Button
                variant="outline"
                className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-900 dark:hover:bg-red-950"
                onClick={clearCart}
              >
                Clear Cart
              </Button>
              <div className="flex space-x-3">
                <PlaceOrderButton className="py-6 px-6 text-base" />
                <Button
                  className="bg-red-600 hover:bg-red-700 py-6 px-8 text-base"
                  onClick={handleCheckout}
                >
                  Proceed to Checkout
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 