"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { formatPrice } from "@/lib/data"
import Link from "next/link"

interface Product {
  id: string
  name: string
  category: string
  description: string
  shortDescription: string
  price: number
  stock: number
  marque: string
  modele: string
  dimension: string
  genre: string
  freinage: string
  systemeD: string
  dimensionCaisseChargement: string
  boiteVitesse: string
  specificationTechnique: string
  bestSeller: boolean
  isPromoted: boolean
}

interface ProductInfoProps {
  product: Product
  onOrderClick: () => void
}

export default function ProductInfo({ product, onOrderClick }: ProductInfoProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="h-full"
    >
      {/* Spécifications Techniques */}
      <div className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700 shadow-lg h-full">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-blue-500">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
            </svg>
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Spécifications Techniques</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center py-3 px-4 rounded-lg bg-white dark:bg-slate-800/50 hover:bg-blue-50 dark:hover:bg-slate-700/50 transition-colors">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Marque</span>
            <span className="text-sm font-bold text-slate-900 dark:text-white">{product.marque || '-'}</span>
          </div>
          <div className="flex justify-between items-center py-3 px-4 rounded-lg bg-white dark:bg-slate-800/50 hover:bg-blue-50 dark:hover:bg-slate-700/50 transition-colors">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Modèle</span>
            <span className="text-sm font-bold text-slate-900 dark:text-white">{product.modele || '-'}</span>
          </div>
          <div className="flex justify-between items-center py-3 px-4 rounded-lg bg-white dark:bg-slate-800/50 hover:bg-blue-50 dark:hover:bg-slate-700/50 transition-colors">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Dimension</span>
            <span className="text-sm font-bold text-slate-900 dark:text-white">{product.dimension || '-'}</span>
          </div>
          <div className="flex justify-between items-center py-3 px-4 rounded-lg bg-white dark:bg-slate-800/50 hover:bg-blue-50 dark:hover:bg-slate-700/50 transition-colors">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Genre</span>
            <span className="text-sm font-bold text-slate-900 dark:text-white">{product.genre || '-'}</span>
          </div>
          <div className="flex justify-between items-center py-3 px-4 rounded-lg bg-white dark:bg-slate-800/50 hover:bg-blue-50 dark:hover:bg-slate-700/50 transition-colors">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Freinage</span>
            <span className="text-sm font-bold text-slate-900 dark:text-white">{product.freinage || '-'}</span>
          </div>
          <div className="flex justify-between items-center py-3 px-4 rounded-lg bg-white dark:bg-slate-800/50 hover:bg-blue-50 dark:hover:bg-slate-700/50 transition-colors">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Système D</span>
            <span className="text-sm font-bold text-slate-900 dark:text-white">{product.systemeD || '-'}</span>
          </div>
          <div className="flex justify-between items-center py-3 px-4 rounded-lg bg-white dark:bg-slate-800/50 hover:bg-blue-50 dark:hover:bg-slate-700/50 transition-colors">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Dimension Caisse</span>
            <span className="text-sm font-bold text-slate-900 dark:text-white">{product.dimensionCaisseChargement || '-'}</span>
          </div>
          <div className="flex justify-between items-center py-3 px-4 rounded-lg bg-white dark:bg-slate-800/50 hover:bg-blue-50 dark:hover:bg-slate-700/50 transition-colors">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Boîte de Vitesse</span>
            <span className="text-sm font-bold text-slate-900 dark:text-white">{product.boiteVitesse || '-'}</span>
          </div>
          <div className="py-3 px-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
            <span className="text-sm font-medium text-blue-700 dark:text-blue-400 block mb-2">Spécifications Complètes</span>
            <p className="text-sm text-slate-900 dark:text-white leading-relaxed">{product.specificationTechnique || '-'}</p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
