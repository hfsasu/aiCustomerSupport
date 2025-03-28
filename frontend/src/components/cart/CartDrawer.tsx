"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Trash2, ChevronRight, ShoppingCart } from "lucide-react"
import { useCartStore } from "@/lib/store/cart-store"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useCurrentUser } from "@/lib/store/auth-store"
import { Portal } from "@/components/ui/portal"

interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, removeItem, updateQuantity, getTotal, getItemCount, clearCart } = useCartStore()
  const { isSignedIn } = useCurrentUser()
  const router = useRouter()
  const [isMounted, setIsMounted] = useState(false)

  // Mount check to avoid hydration issues
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (!isMounted) return
    
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen, isMounted])

  // Handle escape key to close drawer
  useEffect(() => {
    if (!isMounted) return
    
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose()
      }
    }
    
    window.addEventListener("keydown", handleEscape)
    return () => window.removeEventListener("keydown", handleEscape)
  }, [isOpen, onClose, isMounted])

  if (!isMounted) return null

  return (
    <Portal>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 z-[999]"
              onClick={onClose}
              aria-hidden="true"
            />
            
            {/* Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white dark:bg-gray-900 shadow-xl z-[1000] overflow-auto"
            >
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Your Cart</h2>
                  <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
                    <X className="h-5 w-5" />
                    <span className="sr-only">Close</span>
                  </Button>
                </div>
                
                {/* Content */}
                <div className="flex-1 overflow-auto p-4">
                  {items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center text-center h-full">
                      <ShoppingCart className="h-16 w-16 text-gray-300 dark:text-gray-700" />
                      <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">Your cart is empty</h3>
                      <p className="mt-1 text-gray-500 dark:text-gray-400">Add items to get started</p>
                      <Button onClick={onClose} className="mt-6 bg-red-600 hover:bg-red-700">
                        Continue Shopping
                      </Button>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-200 dark:divide-gray-800">
                      {items.map((item) => (
                        <div key={item.id} className="flex py-4">
                          <div className="flex-1">
                            <h3 className="text-base font-medium text-gray-900 dark:text-white">{item.menuItem?.name}</h3>
                            {item.special_instructions && (
                              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{item.special_instructions}</p>
                            )}
                            <div className="mt-2 flex items-center">
                              <div className="flex items-center rounded-md border border-gray-200 dark:border-gray-700">
                                <button
                                  type="button"
                                  className="px-2 py-1 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                                  onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                >
                                  -
                                </button>
                                <span className="px-2 text-sm">{item.quantity}</span>
                                <button
                                  type="button"
                                  className="px-2 py-1 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                >
                                  +
                                </button>
                              </div>
                              <button
                                type="button"
                                className="ml-2 text-red-600 hover:text-red-800 dark:hover:text-red-400"
                                onClick={() => removeItem(item.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Remove</span>
                              </button>
                            </div>
                          </div>
                          <div className="ml-4 text-right">
                            <p className="text-base font-medium text-gray-900 dark:text-white">
                              ${((item.menuItem?.price || 0) * item.quantity).toFixed(2)}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              ${(item.menuItem?.price || 0).toFixed(2)} each
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Footer */}
                {items.length > 0 && (
                  <div className="border-t border-gray-200 dark:border-gray-800 p-4">
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <p className="text-base text-gray-600 dark:text-gray-400">Subtotal</p>
                        <p className="text-base font-medium text-gray-900 dark:text-white">${getTotal().toFixed(2)}</p>
                      </div>
                      <div className="flex justify-between">
                        <p className="text-base text-gray-600 dark:text-gray-400">Tax</p>
                        <p className="text-base font-medium text-gray-900 dark:text-white">
                          ${(getTotal() * 0.0825).toFixed(2)}
                        </p>
                      </div>
                      <div className="flex justify-between">
                        <p className="text-base font-medium text-gray-900 dark:text-white">Total</p>
                        <p className="text-base font-bold text-gray-900 dark:text-white">
                          ${(getTotal() * 1.0825).toFixed(2)}
                        </p>
                      </div>
                      
                      <div className="space-y-3 pt-4">
                        <Button
                          type="button"
                          className="w-full bg-red-600 py-6 text-base font-medium hover:bg-red-700"
                          onClick={() => {
                            if (!isSignedIn) {
                              router.push("/sign-in?redirect=/checkout")
                            } else {
                              router.push("/checkout")
                            }
                            onClose()
                          }}
                        >
                          Checkout
                          <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-900 dark:hover:bg-red-950"
                          onClick={clearCart}
                        >
                          Clear Cart
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </Portal>
  )
}

