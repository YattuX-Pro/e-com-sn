"use client"

import { motion } from "framer-motion"
import ImageWithFallback from "@/components/ImageWithFallback"
import Link from "next/link"
import { formatPrice } from "@/lib/data"
import { getImageUrl } from "@/lib/config"

interface Product {
  id: string
  name: string
  category: string
  shortDescription: string
  price: number
  stock: number
  image: string
  bestSeller?: boolean
}

interface ProductGridProps {
  products: Product[]
}

export default function ProductGrid({ products }: ProductGridProps) {
  return (
    <motion.div
      key="grid"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
    >
      {products.map((product, index) => (
        <motion.div
          key={product.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <Link href={`/produit/${product.id}`} className="group block">
            <div className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border-2 border-blue-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-slate-700 transition-all hover:shadow-lg">
              {/* Image */}
              <div className="relative aspect-[4/3] overflow-hidden bg-slate-100 dark:bg-slate-800">
                <ImageWithFallback
                  src={getImageUrl(product.image)}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                {product.bestSeller && (
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-amber-400 text-amber-900 text-xs font-bold">
                    Best-seller
                  </div>
                )}
              </div>
              {/* Info */}
              <div className="p-4 bg-blue-50 dark:bg-slate-900">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <p className="text-xs font-medium text-blue-400 dark:text-blue-400 mb-1">{product.category}</p>
                    <h3 className="font-semibold text-slate-900 dark:text-white group-hover:text-blue-500 transition-colors line-clamp-1">
                      {product.name}
                    </h3>
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-full whitespace-nowrap">
                    {product.stock} en stock
                  </span>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-3">
                  {product.shortDescription}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-slate-900 dark:text-white">
                    {formatPrice(product.price)}
                  </span>
                  <span className="text-blue-500 text-sm font-medium group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                    Voir <span>→</span>
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  )
}
