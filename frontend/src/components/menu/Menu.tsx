"use client"

import { motion } from "framer-motion"
import { Utensils, Coffee, Milk, SandwichIcon as Hamburger } from "lucide-react"

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

export function Menu() {
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

        <motion.div variants={container} initial="hidden" animate="show" className="mt-16 grid gap-8 md:grid-cols-2">
          {/* 1. Burgers Section (Top Left) */}
          <motion.div
            variants={item}
            className="group relative overflow-hidden rounded-2xl bg-white p-8 shadow-lg transition-shadow hover:shadow-xl dark:bg-gray-900"
          >
            <div className="relative">
              <div className="flex items-center gap-3">
                <Utensils className="h-8 w-8 text-red-600" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Burgers & Fries</h2>
              </div>
              <div className="mt-6 space-y-4">
                {[
                  {
                    name: "Double-Double",
                    price: "$5.95",
                    description:
                      "Two 100% beef patties, hand-leafed lettuce, tomato, spread, two slices of American cheese",
                  },
                  {
                    name: "Cheeseburger",
                    price: "$5.95",
                    description:
                      "100% beef patty, hand-leafed lettuce, tomato, spread, onion, one slice of American cheese",
                  },
                  {
                    name: "Hamburger",
                    price: "$5.95",
                    description: "100% beef patty, hand-leafed lettuce, tomato, spread, onion",
                  },
                  {
                    name: "Fresh French Fries",
                    price: "$5.95",
                    description: "Fresh-cut potatoes prepared in 100% sunflower oil",
                  },
                ].map((item) => (
                  <div
                    key={item.name}
                    className="group/item rounded-lg p-3 transition-colors hover:bg-red-50 dark:hover:bg-red-950/30"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-medium text-gray-900 dark:text-white">{item.name}</span>
                      <span className="text-lg font-bold text-red-600">{item.price}</span>
                    </div>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* 2. Meal Combos (Top Right) */}
          <motion.div
            variants={item}
            className="group relative overflow-hidden rounded-2xl bg-white p-8 shadow-lg transition-shadow hover:shadow-xl dark:bg-gray-900"
          >
            <div className="relative">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Hamburger className="h-8 w-8 text-red-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Meal Combos</h2>
              </div>

              {/* Meal Description */}
              <p className="mt-6 text-center text-sm font-medium text-gray-600 dark:text-gray-400">
                All combos include Fresh French Fries and a Medium Drink
              </p>

              <div className="mt-6 space-y-4">
                {[
                  {
                    name: "Double-Double Meal",
                    price: "$10.65",
                    description: "Our famous Double-Double with fresh fries and a medium drink",
                  },
                  {
                    name: "Cheeseburger Meal",
                    price: "$8.85",
                    description: "Classic cheeseburger with fresh fries and a medium drink",
                  },
                  {
                    name: "Hamburger Meal",
                    price: "$8.35",
                    description: "Traditional hamburger with fresh fries and a medium drink",
                  },
                ].map((combo) => (
                  <div
                    key={combo.name}
                    className="group/item rounded-lg border border-red-100 bg-red-50/50 p-4 transition-all hover:border-red-200 hover:bg-red-50 dark:border-red-900/50 dark:bg-red-950/20 dark:hover:border-red-900 dark:hover:bg-red-950/30"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-medium text-gray-900 dark:text-white">{combo.name}</span>
                      <span className="text-lg font-bold text-red-600">{combo.price}</span>
                    </div>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{combo.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* 3. Soft Drinks (Bottom Left) */}
          <motion.div
            variants={item}
            className="group relative overflow-hidden rounded-2xl bg-white p-8 shadow-lg transition-shadow hover:shadow-xl dark:bg-gray-900"
          >
            <div className="relative">
              <div className="flex items-center gap-3">
                <Milk className="h-8 w-8 text-red-600" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Soft Drinks</h2>
              </div>
              <div className="mt-6">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    "Coke",
                    "Cherry Coke",
                    "Diet Coke",
                    "7UP",
                    "Dr Pepper",
                    "Root Beer",
                    "Iced Tea",
                    "Pink Lemonade",
                    "Lite Pink Lemonade",
                  ].map((drink) => (
                    <div
                      key={drink}
                      className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-red-50 dark:text-gray-400 dark:hover:bg-red-950/30"
                    >
                      • {drink}
                    </div>
                  ))}
                </div>
                <div className="mt-6 space-y-3 rounded-lg border border-red-100 bg-red-50/50 p-4 dark:border-red-900/50 dark:bg-red-950/20">
                  <h3 className="font-semibold text-gray-900 dark:text-white">Sizes & Prices</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { size: "Small", price: "$2.15" },
                      { size: "Medium", price: "$2.30" },
                      { size: "Large", price: "$2.50" },
                      { size: "X-Large", price: "$2.70" },
                    ].map((item) => (
                      <div key={item.size} className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{item.size}</span>
                        <span className="text-sm font-bold text-red-600">{item.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* 4. Shakes & Beverages (Bottom Right) */}
          <motion.div
            variants={item}
            className="group relative overflow-hidden rounded-2xl bg-white p-8 shadow-lg transition-shadow hover:shadow-xl dark:bg-gray-900"
          >
            <div className="relative">
              <div className="flex items-center gap-3">
                <Coffee className="h-8 w-8 text-red-600" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Shakes & Other Beverages</h2>
              </div>
              <div className="mt-6 space-y-4">
                <div className="group/item rounded-lg p-3 transition-colors hover:bg-red-50 dark:hover:bg-red-950/30">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-medium text-gray-900 dark:text-white">Shakes</span>
                    <span className="text-lg font-bold text-red-600">$5.95</span>
                  </div>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Real ice cream shakes: Chocolate, Vanilla, or Strawberry
                  </p>
                </div>
                {[
                  { name: "Hot Cocoa", price: "$2.30", description: "Rich and creamy hot chocolate" },
                  { name: "Coffee", price: "$1.35", description: "Fresh brewed coffee" },
                  { name: "Milk", price: "$0.99", description: "Fresh, cold milk" },
                ].map((item) => (
                  <div
                    key={item.name}
                    className="group/item rounded-lg p-3 transition-colors hover:bg-red-50 dark:hover:bg-red-950/30"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-medium text-gray-900 dark:text-white">{item.name}</span>
                      <span className="text-lg font-bold text-red-600">{item.price}</span>
                    </div>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

