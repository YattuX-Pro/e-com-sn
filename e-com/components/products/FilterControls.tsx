"use client"

interface FilterControlsProps {
  categories: string[]
  selectedCategory: string
  onCategoryChange: (category: string) => void
  sortBy: "default" | "price-asc" | "price-desc"
  onSortChange: (sort: "default" | "price-asc" | "price-desc") => void
  viewMode: "grid" | "list"
  onViewModeChange: (mode: "grid" | "list") => void
}

export default function FilterControls({
  categories,
  selectedCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange
}: FilterControlsProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
      {/* Category Pills - Desktop */}
      <div className="hidden lg:flex items-center gap-2 overflow-x-auto">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              selectedCategory === category
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Mobile/Tablet Category Select */}
      <select
        value={selectedCategory}
        onChange={(e) => onCategoryChange(e.target.value)}
        className="lg:hidden h-10 sm:h-11 px-3 sm:px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm flex-1 min-w-0 max-w-[140px] sm:max-w-none sm:flex-none"
      >
        {categories.map(category => (
          <option key={category} value={category}>{category}</option>
        ))}
      </select>

      {/* Sort */}
      <select
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value as typeof sortBy)}
        className="h-10 sm:h-11 px-3 sm:px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm flex-1 min-w-0 max-w-[130px] sm:max-w-none sm:flex-none"
      >
        <option value="default">Trier</option>
        <option value="price-asc">Prix ↑</option>
        <option value="price-desc">Prix ↓</option>
      </select>

      {/* View Mode */}
      <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shrink-0">
        <button
          onClick={() => onViewModeChange("grid")}
          className={`p-2 sm:p-2.5 transition-colors ${viewMode === "grid" ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900' : 'bg-white dark:bg-slate-900 text-slate-500'}`}
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
          </svg>
        </button>
        <button
          onClick={() => onViewModeChange("list")}
          className={`p-2 sm:p-2.5 transition-colors ${viewMode === "list" ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900' : 'bg-white dark:bg-slate-900 text-slate-500'}`}
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/>
          </svg>
        </button>
      </div>
    </div>
  )
}
