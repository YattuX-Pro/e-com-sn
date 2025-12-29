"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { formatPrice } from "@/lib/data"

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

interface ProductListProps {
  products: Product[]
}

export default function ProductList({ products }: ProductListProps) {
  return (
    <motion.div
      key="list"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-4"
    >
      {products.map((product, index) => (
        <motion.div
          key={product.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <Link href={`/produit/${product.id}`} className="group block">
            <div className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden border-2 border-blue-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-slate-700 transition-all hover:shadow-md flex">
              {/* Image */}
              <div className="relative w-40 md:w-56 aspect-square shrink-0 bg-slate-100 dark:bg-slate-800">
                <Image
                  src={product.image.startsWith('http') ? product.image : `http://localhost:5001${product.image}`}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="200px"
                />
                {product.bestSeller && (
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-amber-400 text-amber-900 text-[10px] font-bold">
                    Best
                  </div>
                )}
              </div>
              {/* Info */}
              <div className="flex-1 p-4 flex flex-col justify-between bg-blue-50 dark:bg-slate-900">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-blue-400 dark:text-blue-400">{product.category}</span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs text-slate-500">{product.stock} en stock</span>
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-1 group-hover:text-blue-500 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
                    {product.shortDescription}
                  </p>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-xl font-bold text-slate-900 dark:text-white">
                    {formatPrice(product.price)}
                  </span>
                  <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white">
                    Voir le produit
                  </Button>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  )
}
