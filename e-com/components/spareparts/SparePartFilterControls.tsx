"use client"

import { LayoutGrid, List } from "lucide-react"

interface SparePartFilterControlsProps {
  categories: string[]
  selectedCategory: string
  onCategoryChange: (category: string) => void
  sortBy: "default" | "price-asc" | "price-desc"
  onSortChange: (sort: "default" | "price-asc" | "price-desc") => void
  viewMode: "grid" | "list"
  onViewModeChange: (mode: "grid" | "list") => void
}

export default function SparePartFilterControls({
  categories,
  selectedCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
}: SparePartFilterControlsProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
      <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
              selectedCategory === category
                ? "bg-blue-500 text-white"
                : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700"
            }`}
          >
            {category}
          </button>
        ))}
      </div>
      <div className="flex gap-2 items-center justify-end">
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value as any)}
          className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="default">Tri par défaut</option>
          <option value="price-asc">Prix croissant</option>
          <option value="price-desc">Prix décroissant</option>
        </select>
        <div className="flex bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
          <button
            onClick={() => onViewModeChange("grid")}
            className={`p-2 transition-colors ${
              viewMode === "grid"
                ? "bg-blue-500 text-white"
                : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700"
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => onViewModeChange("list")}
            className={`p-2 transition-colors ${
              viewMode === "list"
                ? "bg-blue-500 text-white"
                : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700"
            }`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
