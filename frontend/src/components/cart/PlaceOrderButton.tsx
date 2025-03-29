"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ShoppingBag, Loader2 } from "lucide-react"
import { useCartStore } from "@/lib/store/cart-store"
import { useOrderStore } from "@/lib/store/order-store"
import { useCurrentUser } from "@/lib/store/auth-store"
import { useToast } from "@/components/ui/use-toast"

interface PlaceOrderButtonProps {
  redirectTo?: string
  className?: string
}

export function PlaceOrderButton({ redirectTo = "/order-history", className = "" }: PlaceOrderButtonProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { items, getTotal, clearCart } = useCartStore()
  const { createOrder } = useOrderStore()
  const { user, isSignedIn } = useCurrentUser()
  const { toast } = useToast()
  const router = useRouter()

  const handlePlaceOrder = async () => {
    if (!isSignedIn || !user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to place your order",
        variant: "destructive",
      })
      router.push("/sign-in?redirect=/cart")
      return
    }

    if (items.length === 0) {
      toast({
        title: "Empty cart",
        description: "Your cart is empty. Add items before placing an order.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)
      
      // Add tax calculation (8.25%)
      const total = getTotal() * 1.0825
      
      // Create order in Supabase
      const order = await createOrder(user.id, items, total)

      if (!order) {
        throw new Error("Failed to create order")
      }

      // Order created successfully
      clearCart()

      toast({
        title: "Order placed successfully!",
        description: `Your order #${order.id.slice(0, 8)} has been placed.`,
      })
      
      // Redirect to order history or specified path
      router.push(redirectTo)
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

  return (
    <Button 
      onClick={handlePlaceOrder} 
      disabled={isSubmitting || items.length === 0 || !isSignedIn}
      className={`bg-red-600 hover:bg-red-700 ${className}`}
    >
      {isSubmitting ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : (
        <>
          <ShoppingBag className="mr-2 h-4 w-4" />
          Place Order
        </>
      )}
    </Button>
  )
} 