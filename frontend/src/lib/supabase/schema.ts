// This file defines the TypeScript types that match our Supabase schema

export type User = {
    id: string
    email: string
    created_at: string
  }
  
  export type MenuItem = {
    id: string
    name: string
    description: string
    price: number
    category: "burger" | "fries" | "drink" | "combo" | "shake"
    image_url?: string
    nutrition: NutritionInfo
  }
  
  export type NutritionInfo = {
    id: string
    menu_item_id: string
    calories: number
    total_fat: number
    saturated_fat: number
    trans_fat: number
    cholesterol: number
    sodium: number
    carbs: number
    fiber: number
    sugars: number
    protein: number
  }
  
  export type CartItem = {
    id: string
    menu_item_id: string
    quantity: number
    special_instructions?: string
    menuItem?: MenuItem
  }
  
  export type Cart = {
    id: string
    user_id: string
    created_at: string
    items: CartItem[]
    total: number
  }
  
  export type Order = {
    id: string
    user_id: string
    created_at: string
    status: "pending" | "preparing" | "ready" | "completed" | "cancelled"
    total: number
    items: OrderItem[]
  }
  
  export type OrderItem = {
    id: string
    order_id: string
    menu_item_id: string
    quantity: number
    price: number
    special_instructions?: string
    menuItem?: MenuItem
  }
  
  