// lib/store/cart-store.ts
import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { CartItem, MenuItem } from "../supabase/schema"
import { nanoid } from "nanoid"

interface CartState {
  items: CartItem[]
  addItem: (menuItem: MenuItem, quantity: number, specialInstructions?: string) => void
  removeItem: (id: string) => void
  removeItemByName: (name: string, quantity?: number) => void
  updateQuantity: (id: string, quantity: number) => void
  updateSpecialInstructions: (id: string, instructions: string) => void
  clearCart: () => void
  getTotal: () => number
  getItemCount: () => number
  getCartSummary: () => string
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (menuItem, quantity, specialInstructions) => {
        const items = get().items
        const existingItemIndex = items.findIndex(
          (item) =>
            item.menu_item_id === menuItem.id && 
            (item.special_instructions || "") === (specialInstructions || "")
        )

        if (existingItemIndex >= 0) {
          // Update quantity if item already exists with same special instructions
          const updatedItems = [...items]
          updatedItems[existingItemIndex].quantity += quantity
          set({ items: updatedItems })
        } else {
          // Add new item
          const newItem: CartItem = {
            id: nanoid(),
            menu_item_id: menuItem.id,
            quantity,
            special_instructions: specialInstructions,
            menuItem,
          }
          set({ items: [...items, newItem] })
        }
      },

      removeItem: (id) => {
        set({ items: get().items.filter((item) => item.id !== id) })
      },

      removeItemByName: (name, quantity = 0) => {
        const items = get().items
        const itemIndex = items.findIndex(
          (item) => item.menuItem?.name.toLowerCase() === name.toLowerCase()
        )
        
        if (itemIndex === -1) return
        
        if (quantity <= 0 || quantity >= items[itemIndex].quantity) {
          // Remove the entire item
          set({ items: items.filter((_, index) => index !== itemIndex) })
        } else {
          // Reduce the quantity
          const updatedItems = [...items]
          updatedItems[itemIndex].quantity -= quantity
          set({ items: updatedItems })
        }
      },

      updateQuantity: (id, quantity) => {
        const items = get().items
        const updatedItems = items.map((item) => 
          (item.id === id ? { ...item, quantity } : item)
        )
        set({ items: updatedItems })
      },

      updateSpecialInstructions: (id, instructions) => {
        const items = get().items
        const updatedItems = items.map((item) =>
          (item.id === id ? { ...item, special_instructions: instructions } : item)
        )
        set({ items: updatedItems })
      },

      clearCart: () => {
        set({ items: [] })
      },

      getTotal: () => {
        return get().items.reduce((total, item) => {
          const price = item.menuItem?.price || 0
          return total + price * item.quantity
        }, 0)
      },

      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0)
      },
      
      getCartSummary: () => {
        const items = get().items
        const total = get().getTotal()
        
        if (items.length === 0) {
          return "Your cart is empty."
        }
        
        const itemLines = items.map(item => {
          const price = (item.menuItem?.price || 0) * item.quantity
          const specialInstr = item.special_instructions 
            ? ` (${item.special_instructions})` 
            : ''
          return `${item.quantity}x ${item.menuItem?.name}${specialInstr}: $${price.toFixed(2)}`
        }).join('\n')
        
        return `${itemLines}\n\nTotal: $${total.toFixed(2)}`
      }
    }),
    {
      name: "cart-storage",
    }
  )
)