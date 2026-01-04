"use client"

import { X } from "lucide-react"

interface SparePartResultsInfoProps {
  count: number
  hasActiveFilters: boolean
  onClearFilters: () => void
}

export default function SparePartResultsInfo({ count, hasActiveFilters, onClearFilters }: SparePartResultsInfoProps) {
  return (
    <div className="flex items-center justify-between mb-4 sm:mb-6">
      <p className="text-sm text-slate-500 dark:text-slate-400">
        <span className="font-semibold text-slate-900 dark:text-white">{count}</span> pièce{count !== 1 ? 's' : ''} trouvée{count !== 1 ? 's' : ''}
      </p>
      {hasActiveFilters && (
        <button
          onClick={onClearFilters}
          className="flex items-center gap-1 text-sm text-blue-500 hover:text-blue-600 transition-colors"
        >
          <X className="w-4 h-4" />
          Effacer les filtres
        </button>
      )}
    </div>
  )
}
