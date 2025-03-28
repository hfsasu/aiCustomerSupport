"use client"

import type React from "react"

import { motion } from "framer-motion"
import { X, Flame, Heart, Wheat, BarChart3, Info } from "lucide-react"
import type { MenuItem } from "@/lib/supabase/schema"

interface NutritionModalProps {
  item: MenuItem
  onClose: () => void
}

export function NutritionModal({ item, onClose }: NutritionModalProps) {
  const nutrition = item.nutrition

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="relative max-h-[90vh] w-full max-w-md overflow-auto rounded-xl bg-white p-6 shadow-xl dark:bg-gray-900"
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-300"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{item.name}</h2>
          <p className="mt-1 text-gray-600 dark:text-gray-400">{item.description}</p>
        </div>

        <div className="mb-6 grid grid-cols-3 gap-4">
          <NutritionStat
            icon={<Flame className="h-5 w-5 text-orange-500" />}
            label="Calories"
            value={nutrition.calories}
            unit="kcal"
          />
          <NutritionStat
            icon={<Heart className="h-5 w-5 text-red-500" />}
            label="Total Fat"
            value={nutrition.total_fat}
            unit="g"
          />
          <NutritionStat
            icon={<Wheat className="h-5 w-5 text-amber-500" />}
            label="Carbs"
            value={nutrition.carbs}
            unit="g"
          />
        </div>

        <div className="space-y-4">
          <h3 className="flex items-center gap-2 font-semibold text-gray-900 dark:text-white">
            <BarChart3 className="h-5 w-5 text-gray-500" />
            Detailed Nutrition Facts
          </h3>

          <div className="space-y-2 rounded-lg border border-gray-200 p-4 dark:border-gray-800">
            <NutritionRow label="Total Fat" value={nutrition.total_fat} unit="g" />
            <NutritionRow label="Saturated Fat" value={nutrition.saturated_fat} unit="g" indent />
            <NutritionRow label="Trans Fat" value={nutrition.trans_fat} unit="g" indent />
            <NutritionRow label="Cholesterol" value={nutrition.cholesterol} unit="mg" />
            <NutritionRow label="Sodium" value={nutrition.sodium} unit="mg" />
            <NutritionRow label="Total Carbohydrates" value={nutrition.carbs} unit="g" />
            <NutritionRow label="Dietary Fiber" value={nutrition.fiber} unit="g" indent />
            <NutritionRow label="Sugars" value={nutrition.sugars} unit="g" indent />
            <NutritionRow label="Protein" value={nutrition.protein} unit="g" />
          </div>

          <div className="mt-4 rounded-lg bg-blue-50 p-4 text-sm text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
            <div className="flex items-start">
              <Info className="mr-2 mt-0.5 h-4 w-4 flex-shrink-0" />
              <p>
                Percent Daily Values are based on a 2,000 calorie diet. Your daily values may be higher or lower
                depending on your calorie needs.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

function NutritionStat({
  icon,
  label,
  value,
  unit,
}: { icon: React.ReactNode; label: string; value: number; unit: string }) {
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
        className={`text-sm ${
          indent ? "ml-4 text-gray-500 dark:text-gray-400" : "font-medium text-gray-700 dark:text-gray-300"
        }`}
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

