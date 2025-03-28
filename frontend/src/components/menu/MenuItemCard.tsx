"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Minus, Info } from "lucide-react"
import type { MenuItem } from "@/lib/supabase/schema"
import { useCartStore } from "@/lib/store/cart-store"
import { NutritionModal } from "@/components/nutrition/NutritionModal"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import Link from "next/link"

interface MenuItemCardProps {
  item: MenuItem
}

export function MenuItemCard({ item }: MenuItemCardProps) {
  const [quantity, setQuantity] = useState(1)
  const [specialInstructions, setSpecialInstructions] = useState("")
  const [showNutrition, setShowNutrition] = useState(false)
  const addItem = useCartStore((state) => state.addItem)

  const incrementQuantity = () => setQuantity((prev) => prev + 1)
  const decrementQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1))

  const handleAddToCart = () => {
    addItem(item, quantity, specialInstructions)
    toast({
      title: "Added to cart",
      description: `${item.name} has been added to your cart.`,
      action: (
        <Link href="/cart">
          <Button variant="outline" size="sm">
            View Cart
          </Button>
        </Link>
      ),
    })
    setQuantity(1)
    setSpecialInstructions("")
  }

  return (
    <>
      <motion.div
        whileHover={{ y: -5 }}
        className="group relative overflow-hidden rounded-xl bg-white p-4 shadow-md transition-all hover:shadow-lg dark:bg-gray-900"
      >
        <div className="flex flex-col">
          <div className="flex justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{item.name}</h3>
            <span className="font-bold text-red-600">${item.price.toFixed(2)}</span>
          </div>

          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{item.description}</p>

          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="icon" className="h-8 w-8 rounded-full" onClick={decrementQuantity}>
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-8 text-center">{quantity}</span>
              <Button variant="outline" size="icon" className="h-8 w-8 rounded-full" onClick={incrementQuantity}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              onClick={() => setShowNutrition(true)}
            >
              <Info className="mr-1 h-4 w-4" />
              Nutrition
            </Button>
          </div>

          <textarea
            className="mt-3 w-full resize-none rounded-md border border-gray-300 p-2 text-sm placeholder:text-gray-400 focus:border-red-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            placeholder="Special instructions..."
            rows={2}
            value={specialInstructions}
            onChange={(e) => setSpecialInstructions(e.target.value)}
          />

          <Button className="mt-4 w-full bg-red-600 text-white hover:bg-red-700" onClick={handleAddToCart}>
            Add to Cart
          </Button>
        </div>
      </motion.div>

      <AnimatePresence>
        {showNutrition && <NutritionModal item={item} onClose={() => setShowNutrition(false)} />}
      </AnimatePresence>
    </>
  )
}

