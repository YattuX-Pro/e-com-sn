"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { getImageUrl } from "@/lib/config"

interface SparePart {
  id: string
  name: string
  category: string
  description: string
  price: number
  stock: number
  image: string
  reference: string
}

interface SparePartListProps {
  parts: SparePart[]
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('fr-SN', { style: 'decimal', maximumFractionDigits: 0 }).format(price) + ' FCFA'
}

export default function SparePartList({ parts }: SparePartListProps) {
  return (
    <motion.div
      key="list"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col gap-4"
    >
      {parts.map((part, index) => (
        <motion.div
          key={part.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <Link href={`/pieces/${part.id}`} className="group block">
            <div className="flex bg-white dark:bg-slate-900 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-slate-700 transition-all hover:shadow-lg">
              <div className="relative w-32 sm:w-48 aspect-square flex-shrink-0 bg-slate-100 dark:bg-slate-800">
                <Image
                  src={getImageUrl(part.image)}
                  alt={part.name}
                  fill
                  className="object-cover"
                  sizes="200px"
                />
              </div>
              <div className="flex-1 p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-blue-500">{part.category}</span>
                    <span className="text-xs text-slate-400">Réf: {part.reference}</span>
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white group-hover:text-blue-500 transition-colors">
                    {part.name}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                    {part.description}
                  </p>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-lg font-bold text-slate-900 dark:text-white">
                    {formatPrice(part.price)}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      part.stock > 5 
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : part.stock > 0 
                          ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                          : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      {part.stock > 0 ? `${part.stock} en stock` : 'Rupture'}
                    </span>
                    <span className="text-blue-500 text-sm font-medium">Voir →</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  )
}
