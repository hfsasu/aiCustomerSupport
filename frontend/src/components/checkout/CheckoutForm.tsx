"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useCartStore } from "@/lib/store/cart-store"
import { useCurrentUser } from "@/lib/store/auth-store"
import { useOrderStore } from "@/lib/store/order-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { CheckCircle2, ShoppingBag, MapPin, CreditCard } from "lucide-react"
import { useAuth, SignInButton } from "@clerk/nextjs"

export function CheckoutForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orderComplete, setOrderComplete] = useState(false)
  const [orderId, setOrderId] = useState<string | null>(null)
  const router = useRouter()

  const { items, getTotal, clearCart } = useCartStore()
  const { user, isSignedIn } = useCurrentUser()
  const { isSignedIn: clerkIsSignedIn } = useAuth()
  const { createOrder } = useOrderStore()

  const [formData, setFormData] = useState({
    name: "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Since we wrapped the checkout page in ProtectedLayout,
    // this check is redundant but kept for safety
    if (!isSignedIn || !user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to complete your order",
        variant: "destructive",
      })
      return
    }

    if (items.length === 0) {
      toast({
        title: "Empty cart",
        description: "Your cart is empty. Add items before checking out.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)

      // Create order in Supabase
      const order = await createOrder(user.id, items, getTotal() * 1.0825)

      if (!order) {
        throw new Error("Failed to create order")
      }

      // Order created successfully
      setOrderId(order.id)
      setOrderComplete(true)
      clearCart()

      toast({
        title: "Order placed successfully!",
        description: `Your order #${order.id.slice(0, 8)} has been placed.`,
      })
    } catch (error: any) {
      toast({
        title: "Error placing order",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (orderComplete) {
    return (
      <div className="bg-[#FFFAF5] py-16 dark:bg-gray-950">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto max-w-md rounded-lg border border-green-100 bg-white p-8 text-center shadow-md dark:border-green-900/30 dark:bg-gray-900"
        >
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-50 dark:bg-green-900/20">
            <CheckCircle2 className="h-10 w-10 text-green-500" />
          </div>
          <h2 className="mt-6 text-2xl font-bold text-gray-900 dark:text-white">Order Complete!</h2>
          <p className="mt-3 text-gray-600 dark:text-gray-300">
            Your order #{orderId?.slice(0, 8)} has been placed successfully.
          </p>
          <p className="mt-2 text-gray-600 dark:text-gray-300">We'll start preparing your food right away.</p>
          <div className="mt-8 space-y-3">
            <Button onClick={() => router.push("/order-history")} className="w-full bg-red-600 hover:bg-red-700">
              View Order History
            </Button>
            <Button variant="outline" onClick={() => router.push("/menu")} className="w-full">
              Return to Menu
            </Button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="bg-[#FFFAF5] py-16 dark:bg-gray-950">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">Checkout</h1>
          <p className="mt-3 text-lg text-gray-600 dark:text-gray-400">
            Complete your order by providing your delivery information.
          </p>
        </div>

        <div className="space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
          >
            <div className="border-b border-gray-200 bg-gray-50 px-6 py-4 dark:border-gray-800 dark:bg-gray-800">
              <div className="flex items-center">
                <ShoppingBag className="mr-2 h-5 w-5 text-red-600" />
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">Order Summary</h2>
              </div>
            </div>
            
            <div className="px-6 py-4">
              <div className="divide-y divide-gray-200 dark:divide-gray-800">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between py-4">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {item.quantity} × {item.menuItem?.name}
                      </p>
                      {item.special_instructions && (
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{item.special_instructions}</p>
                      )}
                    </div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      ${((item.menuItem?.price || 0) * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 space-y-3 border-t border-gray-200 pt-6 dark:border-gray-800">
                <div className="flex justify-between">
                  <p className="text-gray-600 dark:text-gray-400">Subtotal</p>
                  <p className="font-medium text-gray-900 dark:text-white">${getTotal().toFixed(2)}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-gray-600 dark:text-gray-400">Tax (8.25%)</p>
                  <p className="font-medium text-gray-900 dark:text-white">${(getTotal() * 0.0825).toFixed(2)}</p>
                </div>
                <div className="flex justify-between border-t border-gray-200 pt-3 dark:border-gray-800">
                  <p className="text-lg font-medium text-gray-900 dark:text-white">Total</p>
                  <p className="text-lg font-bold text-red-600">${(getTotal() * 1.0825).toFixed(2)}</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.form 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onSubmit={handleSubmit} 
            className="space-y-8"
          >
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <div className="border-b border-gray-200 bg-gray-50 px-6 py-4 dark:border-gray-800 dark:bg-gray-800">
                <div className="flex items-center">
                  <MapPin className="mr-2 h-5 w-5 text-red-600" />
                  <h2 className="text-lg font-medium text-gray-900 dark:text-white">Delivery Information</h2>
                </div>
              </div>
              
              <div className="px-6 py-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
                    <Input 
                      id="name" 
                      name="name" 
                      value={formData.name} 
                      onChange={handleChange} 
                      className="rounded-md border-gray-300 focus:border-red-500 focus:ring-red-500"
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                    <Input 
                      id="email" 
                      name="email" 
                      type="email" 
                      value={formData.email} 
                      onChange={handleChange} 
                      className="rounded-md border-gray-300 focus:border-red-500 focus:ring-red-500"
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-medium">Phone</Label>
                    <Input 
                      id="phone" 
                      name="phone" 
                      type="tel" 
                      value={formData.phone} 
                      onChange={handleChange} 
                      className="rounded-md border-gray-300 focus:border-red-500 focus:ring-red-500"
                      required 
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="address" className="text-sm font-medium">Address</Label>
                    <Input 
                      id="address" 
                      name="address" 
                      value={formData.address} 
                      onChange={handleChange} 
                      className="rounded-md border-gray-300 focus:border-red-500 focus:ring-red-500"
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city" className="text-sm font-medium">City</Label>
                    <Input 
                      id="city" 
                      name="city" 
                      value={formData.city} 
                      onChange={handleChange} 
                      className="rounded-md border-gray-300 focus:border-red-500 focus:ring-red-500"
                      required 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="state" className="text-sm font-medium">State</Label>
                      <Input 
                        id="state" 
                        name="state" 
                        value={formData.state} 
                        onChange={handleChange} 
                        className="rounded-md border-gray-300 focus:border-red-500 focus:ring-red-500"
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zip" className="text-sm font-medium">ZIP Code</Label>
                      <Input 
                        id="zip" 
                        name="zip" 
                        value={formData.zip} 
                        onChange={handleChange} 
                        className="rounded-md border-gray-300 focus:border-red-500 focus:ring-red-500"
                        required 
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="mt-8"
            >
              <Button
                type="submit"
                className="w-full rounded-xl bg-red-600 py-6 text-lg font-medium shadow-md transition-all hover:bg-red-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Processing..." : "Place Order"}
              </Button>
            </motion.div>
          </motion.form>
        </div>
      </div>
    </div>
  )
}

