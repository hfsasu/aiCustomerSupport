"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Utensils, Coffee, Milk, SandwichIcon as Hamburger } from "lucide-react"
import type { MenuItem } from "@/lib/supabase/schema"
import { MenuItemCard } from "./MenuItemCard"

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

export function EnhancedMenu() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeCategory, setActiveCategory] = useState("burgers")

  useEffect(() => {
    async function fetchMenuItems() {
      try {
        setIsLoading(true)
        const response = await fetch('/api/menu')
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setMenuItems(data as MenuItem[])
      } catch (err: any) {
        setError(err.message || 'Failed to fetch menu items')
        console.error("Error fetching menu items:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMenuItems()
  }, [])

  const burgers = menuItems.filter((item) => item.category === "burger")
  const fries = menuItems.filter((item) => item.category === "fries")
  const drinks = menuItems.filter((item) => item.category === "drink")
  const combos = menuItems.filter((item) => item.category === "combo")


  if (error) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-red-600">Error loading menu</h3>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FFFAF5] dark:bg-gray-950">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Header with animated underline */}
        <div className="text-center">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="relative inline-block">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">Our Menu</h1>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="absolute -bottom-2 left-0 h-1 w-full origin-left bg-red-600"
            />
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 text-lg text-gray-600 dark:text-gray-300"
          >
            Quality you can taste in every bite. Made fresh to order.
          </motion.p>
        </div>

        {/* Improved tabs with better alignment and spacing */}
        <Tabs defaultValue="burgers" className="mt-12" onValueChange={(value) => setActiveCategory(value)}>
          <div className="flex justify-center">
            <TabsList className="mx-auto mb-8 grid h-16 max-w-md grid-cols-4 rounded-xl bg-gray-100 p-1 dark:bg-gray-800">
              <TabsTrigger 
                value="burgers" 
                className="group relative flex flex-col items-center justify-center gap-1 overflow-hidden rounded-lg py-3 transition-all duration-300 ease-in-out data-[state=active]:bg-white data-[state=active]:shadow-md dark:data-[state=active]:bg-gray-700"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex flex-col items-center"
                >
                  <Hamburger className="h-5 w-5 transition-transform duration-300 group-hover:scale-110 group-data-[state=active]:text-red-600" />
                  <span className="text-sm font-medium transition-colors duration-300 group-data-[state=active]:text-red-600">Burgers</span>
                </motion.div>
                {activeCategory === "burgers" && (
                  <motion.div 
                    className="absolute bottom-0 left-0 h-0.5 w-full bg-red-600" 
                    layoutId="activeTabIndicator"
                  />
                )}
              </TabsTrigger>
              <TabsTrigger 
                value="fries" 
                className="group relative flex flex-col items-center justify-center gap-1 overflow-hidden rounded-lg py-3 transition-all duration-300 ease-in-out data-[state=active]:bg-white data-[state=active]:shadow-md dark:data-[state=active]:bg-gray-700"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex flex-col items-center"
                >
                  <Utensils className="h-5 w-5 transition-transform duration-300 group-hover:scale-110 group-data-[state=active]:text-red-600" />
                  <span className="text-sm font-medium transition-colors duration-300 group-data-[state=active]:text-red-600">Fries</span>
                </motion.div>
                {activeCategory === "fries" && (
                  <motion.div 
                    className="absolute bottom-0 left-0 h-0.5 w-full bg-red-600" 
                    layoutId="activeTabIndicator"
                  />
                )}
              </TabsTrigger>
              <TabsTrigger 
                value="drinks" 
                className="group relative flex flex-col items-center justify-center gap-1 overflow-hidden rounded-lg py-3 transition-all duration-300 ease-in-out data-[state=active]:bg-white data-[state=active]:shadow-md dark:data-[state=active]:bg-gray-700"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex flex-col items-center"
                >
                  <Milk className="h-5 w-5 transition-transform duration-300 group-hover:scale-110 group-data-[state=active]:text-red-600" />
                  <span className="text-sm font-medium transition-colors duration-300 group-data-[state=active]:text-red-600">Drinks</span>
                </motion.div>
                {activeCategory === "drinks" && (
                  <motion.div 
                    className="absolute bottom-0 left-0 h-0.5 w-full bg-red-600" 
                    layoutId="activeTabIndicator"
                  />
                )}
              </TabsTrigger>
              <TabsTrigger 
                value="combos" 
                className="group relative flex flex-col items-center justify-center gap-1 overflow-hidden rounded-lg py-3 transition-all duration-300 ease-in-out data-[state=active]:bg-white data-[state=active]:shadow-md dark:data-[state=active]:bg-gray-700"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex flex-col items-center"
                >
                  <Coffee className="h-5 w-5 transition-transform duration-300 group-hover:scale-110 group-data-[state=active]:text-red-600" />
                  <span className="text-sm font-medium transition-colors duration-300 group-data-[state=active]:text-red-600">Combos</span>
                </motion.div>
                {activeCategory === "combos" && (
                  <motion.div 
                    className="absolute bottom-0 left-0 h-0.5 w-full bg-red-600" 
                    layoutId="activeTabIndicator"
                  />
                )}
              </TabsTrigger>
            </TabsList>
          </div>

          <AnimatePresence mode="wait">
            {activeCategory === "burgers" && (
              <TabsContent value="burgers" className="mt-8">
                <motion.div 
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0 }}
                  className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
                >
                  {burgers.map((item, index) => (
                    <motion.div key={item.id} variants={itemVariants}>
                      <MenuItemCard item={item} />
                    </motion.div>
                  ))}
                </motion.div>
              </TabsContent>
            )}

            {activeCategory === "fries" && (
              <TabsContent value="fries" className="mt-8">
                <motion.div 
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0 }}
                  className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
                >
                  {fries.map((item, index) => (
                    <motion.div key={item.id} variants={itemVariants}>
                      <MenuItemCard item={item} />
                    </motion.div>
                  ))}
                </motion.div>
              </TabsContent>
            )}

            {activeCategory === "drinks" && (
              <TabsContent value="drinks" className="mt-8">
                <motion.div 
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0 }}
                  className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
                >
                  {drinks.map((item, index) => (
                    <motion.div key={item.id} variants={itemVariants}>
                      <MenuItemCard item={item} />
                    </motion.div>
                  ))}
                </motion.div>
              </TabsContent>
            )}

            {activeCategory === "combos" && (
              <TabsContent value="combos" className="mt-8">
                <motion.div 
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0 }}
                  className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
                >
                  {combos.map((item, index) => (
                    <motion.div key={item.id} variants={itemVariants}>
                      <MenuItemCard item={item} />
                    </motion.div>
                  ))}
                </motion.div>
              </TabsContent>
            )}
          </AnimatePresence>
        </Tabs>
      </div>
    </div>
  )
}

