"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

interface EmptyStateProps {
  onClearFilters: () => void
}

export default function EmptyState({ onClearFilters }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="text-center py-20"
    >
      <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
        <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
      </div>
      <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Aucun résultat</h3>
      <p className="text-slate-500 dark:text-slate-400 mb-6">Essayez de modifier vos critères de recherche</p>
      <Button onClick={onClearFilters} className="bg-blue-500 hover:bg-blue-600">
        Voir tous les produits
      </Button>
    </motion.div>
  )
}
