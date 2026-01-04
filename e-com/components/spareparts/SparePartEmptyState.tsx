"use client"

import { motion } from "framer-motion"
import { Package } from "lucide-react"

interface SparePartEmptyStateProps {
  onClearFilters: () => void
}

export default function SparePartEmptyState({ onClearFilters }: SparePartEmptyStateProps) {
  return (
    <motion.div
      key="empty"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="text-center py-16"
    >
      <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
        <Package className="w-10 h-10 text-slate-400" />
      </div>
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
        Aucune pièce trouvée
      </h3>
      <p className="text-slate-500 dark:text-slate-400 mb-4">
        Essayez de modifier vos critères de recherche
      </p>
      <button
        onClick={onClearFilters}
        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
      >
        Réinitialiser les filtres
      </button>
    </motion.div>
  )
}
