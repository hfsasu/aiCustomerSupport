"use client"

import { useEffect } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { useCurrentUser } from "@/lib/store/auth-store"
import { useOrderStore } from "@/lib/store/order-store"
import { Button } from "@/components/ui/button"
import { formatDistanceToNow } from "date-fns"
import { ShoppingBag, Clock, CheckCircle, AlertCircle, XCircle } from 'lucide-react'
import { useAuth } from "@clerk/nextjs"

export function OrderHistory() {
  const { user, isLoaded, isSignedIn } = useCurrentUser()
  const { isSignedIn: clerkIsSignedIn } = useAuth()
  const { orders, fetchOrders, isLoading, error } = useOrderStore()
  const router = useRouter()
  
  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      fetchOrders(user.id)
    } else if (isLoaded && !isSignedIn) {
      router.push("/sign-in?redirect=/order-history")
    }
  }, [isLoaded, isSignedIn, user, fetchOrders, router])
  
  if (!isLoaded || !clerkIsSignedIn) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-semibold">Please sign in to view your order history</h3>
          <Button
            onClick={() => router.push("/sign-in?redirect=/order-history")}
            className="mt-4 bg-red-600 hover:bg-red-700"
          >
            Sign In
          </Button>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-red-600 border-t-transparent"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-red-600">Error loading orders</h3>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center">
        <ShoppingBag className="h-16 w-16 text-gray-300" />
        <h3 className="mt-4 text-lg font-medium">No orders yet</h3>
        <p className="mt-1 text-gray-500">Start ordering to see your history here</p>
        <Button onClick={() => router.push("/menu")} className="mt-6 bg-red-600 hover:bg-red-700">
          Browse Menu
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">Order History</h1>
      <p className="mt-2 text-gray-600 dark:text-gray-400">View and track your previous orders</p>

      <div className="mt-8 space-y-6">
        {orders.map((order) => (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
          >
            <div className="border-b border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Order #{order.id.slice(0, 8)}</p>
                  <div className="mt-1 flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Clock className="mr-1 h-4 w-4" />
                    {formatDistanceToNow(new Date(order.created_at), { addSuffix: true })}
                  </div>
                </div>
                <div className="flex items-center">
                  <OrderStatusBadge status={order.status} />
                  <p className="ml-4 font-medium text-gray-900 dark:text-white">${order.total.toFixed(2)}</p>
                </div>
              </div>
            </div>

            <div className="divide-y divide-gray-200 p-4 dark:divide-gray-800">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between py-3">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {item.quantity} × {item.menuItem?.name}
                    </p>
                    {item.special_instructions && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">{item.special_instructions}</p>
                    )}
                  </div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800">
              <Button onClick={() => router.push(`/order/${order.id}`)} variant="outline" className="w-full">
                View Order Details
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function OrderStatusBadge({ status }: { status: string }) {
  let color = ""
  let icon = null

  switch (status) {
    case "pending":
      color = "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
      icon = <Clock className="mr-1 h-4 w-4" />
      break
    case "preparing":
      color = "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
      icon = <ShoppingBag className="mr-1 h-4 w-4" />
      break
    case "ready":
      color = "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
      icon = <CheckCircle className="mr-1 h-4 w-4" />
      break
    case "completed":
      color = "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
      icon = <CheckCircle className="mr-1 h-4 w-4" />
      break
    case "cancelled":
      color = "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
      icon = <XCircle className="mr-1 h-4 w-4" />
      break
    default:
      color = "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
      icon = <AlertCircle className="mr-1 h-4 w-4" />
  }

  return (
    <div className={`flex items-center rounded-full px-3 py-1 text-xs font-medium ${color}`}>
      {icon}
      <span className="capitalize">{status}</span>
    </div>
  )
}