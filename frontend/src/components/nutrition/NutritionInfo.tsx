"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Beef, CookingPotIcon as Potato, Info, Heart, Flame, Wheat, BarChart3 } from "lucide-react"

interface NutritionItem {
  name: string
  calories: number
  totalFat: number
  saturatedFat: number
  transFat: number
  cholesterol: number
  sodium: number
  carbs: number
  fiber: number
  sugars: number
  protein: number
  description: string
}

const burgerItems: NutritionItem[] = [
  {
    name: "Double-Double",
    calories: 670,
    totalFat: 41,
    saturatedFat: 18,
    transFat: 1,
    cholesterol: 120,
    sodium: 1440,
    carbs: 39,
    fiber: 3,
    sugars: 10,
    protein: 37,
    description: "Two 100% beef patties, hand-leafed lettuce, tomato, spread, two slices of American cheese",
  },
  {
    name: "Cheeseburger",
    calories: 480,
    totalFat: 27,
    saturatedFat: 10,
    transFat: 0.5,
    cholesterol: 60,
    sodium: 1000,
    carbs: 39,
    fiber: 3,
    sugars: 10,
    protein: 22,
    description: "100% beef patty, hand-leafed lettuce, tomato, spread, onion, one slice of American cheese",
  },
  {
    name: "Hamburger",
    calories: 390,
    totalFat: 19,
    saturatedFat: 5,
    transFat: 0,
    cholesterol: 40,
    sodium: 650,
    carbs: 39,
    fiber: 3,
    sugars: 10,
    protein: 16,
    description: "100% beef patty, hand-leafed lettuce, tomato, spread, onion",
  },
]

const friesItems: NutritionItem[] = [
  {
    name: "French Fries",
    calories: 395,
    totalFat: 18,
    saturatedFat: 5,
    transFat: 0,
    cholesterol: 0,
    sodium: 245,
    carbs: 54,
    fiber: 2,
    sugars: 0,
    protein: 7,
    description: "Fresh-cut potatoes prepared in 100% sunflower oil",
  },
]

export function NutritionInfo() {
  const [selectedItem, setSelectedItem] = useState<NutritionItem>(burgerItems[0])
  const [category, setCategory] = useState<"burgers" | "fries">("burgers")

  const handleCategoryChange = (value: string) => {
    setCategory(value as "burgers" | "fries")
    if (value === "burgers") {
      setSelectedItem(burgerItems[0])
    } else {
      setSelectedItem(friesItems[0])
    }
  }

  return (
    <section className="w-full bg-[#FFFAF5] py-16 dark:bg-gray-950">
      <div className="container px-4 md:px-6">
        <div className="mx-auto max-w-3xl">
          <div className="mb-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative inline-block"
            >
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                Nutrition Information
              </h2>
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="absolute -bottom-2 left-0 h-1 w-full origin-left bg-red-600"
              />
            </motion.div>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              We believe in transparency about what goes into our food
            </p>
          </div>

          <Tabs defaultValue="burgers" className="w-full" onValueChange={handleCategoryChange}>
            <TabsList className="mb-8 grid w-full grid-cols-2">
              <TabsTrigger value="burgers" className="flex items-center gap-2 text-lg">
                <Beef className="h-5 w-5" />
                <span>Burgers</span>
              </TabsTrigger>
              <TabsTrigger value="fries" className="flex items-center gap-2 text-lg">
                <Potato className="h-5 w-5" />
                <span>Fries</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="burgers" className="mt-0">
              <div className="mb-6 flex flex-wrap gap-2">
                {burgerItems.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => setSelectedItem(item)}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                      selectedItem.name === item.name
                        ? "bg-red-600 text-white"
                        : "bg-white text-gray-700 hover:bg-red-50 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                    }`}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="fries" className="mt-0">
              <div className="mb-6 flex flex-wrap gap-2">
                {friesItems.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => setSelectedItem(item)}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                      selectedItem.name === item.name
                        ? "bg-red-600 text-white"
                        : "bg-white text-gray-700 hover:bg-red-50 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                    }`}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </TabsContent>

            <AnimatePresence mode="wait">
              <motion.div
                key={selectedItem.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg dark:border-gray-800 dark:bg-gray-900"
              >
                <div className="border-b border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{selectedItem.name}</h3>
                    <div className="flex items-center rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-800 dark:bg-red-900/30 dark:text-red-300">
                      <Flame className="mr-1 h-4 w-4" />
                      {selectedItem.calories} Cal
                    </div>
                  </div>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{selectedItem.description}</p>
                </div>

                <div className="p-6">
                  <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
                    <NutritionStat
                      icon={<Flame className="h-5 w-5 text-orange-500" />}
                      label="Calories"
                      value={selectedItem.calories}
                      unit="kcal"
                    />
                    <NutritionStat
                      icon={<Heart className="h-5 w-5 text-red-500" />}
                      label="Total Fat"
                      value={selectedItem.totalFat}
                      unit="g"
                    />
                    <NutritionStat
                      icon={<Wheat className="h-5 w-5 text-amber-500" />}
                      label="Carbs"
                      value={selectedItem.carbs}
                      unit="g"
                    />
                  </div>

                  <div className="space-y-4">
                    <h4 className="flex items-center gap-2 font-semibold text-gray-900 dark:text-white">
                      <BarChart3 className="h-5 w-5 text-gray-500" />
                      Detailed Nutrition Facts
                    </h4>

                    <div className="space-y-2 rounded-lg border border-gray-200 p-4 dark:border-gray-800">
                      <NutritionRow label="Total Fat" value={selectedItem.totalFat} unit="g" />
                      <NutritionRow label="Saturated Fat" value={selectedItem.saturatedFat} unit="g" indent />
                      <NutritionRow label="Trans Fat" value={selectedItem.transFat} unit="g" indent />
                      <NutritionRow label="Cholesterol" value={selectedItem.cholesterol} unit="mg" />
                      <NutritionRow label="Sodium" value={selectedItem.sodium} unit="mg" />
                      <NutritionRow label="Total Carbohydrates" value={selectedItem.carbs} unit="g" />
                      <NutritionRow label="Dietary Fiber" value={selectedItem.fiber} unit="g" indent />
                      <NutritionRow label="Sugars" value={selectedItem.sugars} unit="g" indent />
                      <NutritionRow label="Protein" value={selectedItem.protein} unit="g" />
                    </div>

                    <div className="mt-4 rounded-lg bg-blue-50 p-4 text-sm text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                      <div className="flex items-start">
                        <Info className="mr-2 mt-0.5 h-4 w-4 flex-shrink-0" />
                        <p>
                          Percent Daily Values are based on a 2,000 calorie diet. Your daily values may be higher or
                          lower depending on your calorie needs.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </Tabs>
        </div>
      </div>
    </section>
  )
}

function NutritionStat({
  icon,
  label,
  value,
  unit,
}: {
  icon: React.ReactNode
  label: string
  value: number
  unit: string
}) {
  return (
    <div className="flex flex-col items-center rounded-lg bg-gray-50 p-3 text-center dark:bg-gray-800">
      <div className="mb-1">{icon}</div>
      <div className="text-xl font-bold text-gray-900 dark:text-white">
        {value}
        {unit}
      </div>
      <div className="text-xs text-gray-500 dark:text-gray-400">{label}</div>
    </div>
  )
}

function NutritionRow({
  label,
  value,
  unit,
  indent = false,
}: {
  label: string
  value: number
  unit: string
  indent?: boolean
}) {
  return (
    <div className="flex justify-between border-b border-gray-100 pb-1 last:border-0 dark:border-gray-800">
      <span
        className={`text-sm ${indent ? "ml-4 text-gray-500 dark:text-gray-400" : "font-medium text-gray-700 dark:text-gray-300"}`}
      >
        {label}
      </span>
      <span className="text-sm font-medium text-gray-900 dark:text-white">
        {value}
        {unit}
      </span>
    </div>
  )
}

