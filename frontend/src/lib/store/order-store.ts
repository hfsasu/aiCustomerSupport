import { create } from "zustand"
import { supabase } from "../supabase/client"
import type { Order } from "../supabase/schema"

interface OrderState {
  orders: Order[]
  currentOrder: Order | null
  isLoading: boolean
  error: string | null
  fetchOrders: (userId: string) => Promise<void>
  createOrder: (userId: string, cartItems: any[], total: number) => Promise<Order | null>
  getOrderById: (orderId: string) => Promise<void>
}

export const useOrderStore = create<OrderState>((set, get) => ({
  orders: [],
  currentOrder: null,
  isLoading: false,
  error: null,

  fetchOrders: async (userId) => {
    try {
      set({ isLoading: true, error: null })

      const { data, error } = await supabase
        .from("orders")
        .select(`
        *,
        items:order_items(
          *,
          menuItem:menu_items(*)
        )
      `)
        .eq("user_id", userId)
        .order("created_at", { ascending: false })

      if (error) throw error

      set({ orders: data as Order[] })
    } catch (error: any) {
      set({ error: error.message })
    } finally {
      set({ isLoading: false })
    }
  },

  createOrder: async (userId, cartItems, total) => {
    try {
      set({ isLoading: true, error: null })

      // Create order
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .insert([
          {
            user_id: userId,
            total,
            status: "pending",
          },
        ])
        .select()
        .single()

      if (orderError) throw orderError

      // Create order items
      const orderItems = cartItems.map((item) => ({
        order_id: orderData.id,
        menu_item_id: item.menu_item_id,
        quantity: item.quantity,
        price: item.menuItem.price,
        special_instructions: item.special_instructions,
      }))

      const { error: itemsError } = await supabase.from("order_items").insert(orderItems)

      if (itemsError) throw itemsError

      // Fetch the complete order with items
      const { data: completeOrder, error: fetchError } = await supabase
        .from("orders")
        .select(`
          *,
          items:order_items(
            *,
            menuItem:menu_items(*)
          )
        `)
        .eq("id", orderData.id)
        .single()

      if (fetchError) throw fetchError

      set({ currentOrder: completeOrder as Order })
      return completeOrder as Order
    } catch (error: any) {
      set({ error: error.message })
      return null
    } finally {
      set({ isLoading: false })
    }
  },

  getOrderById: async (orderId) => {
    try {
      set({ isLoading: true, error: null })

      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          items:order_items(
            *,
            menuItem:menu_items(*)
          )
        `)
        .eq("id", orderId)
        .single()

      if (error) throw error

      set({ currentOrder: data as Order })
    } catch (error: any) {
      set({ error: error.message })
    } finally {
      set({ isLoading: false })
    }
  },
}))

