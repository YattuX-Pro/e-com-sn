"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { formatPrice } from "@/lib/data"
import { productsApi, Product } from "@/lib/api"
import ImageWithFallback from "@/components/ImageWithFallback"
import Link from "next/link"
import { getImageUrl } from "@/lib/config"

export default function BestSellers() {
  const [bestSellers, setBestSellers] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadBestSellers = async () => {
      try {
        const products = await productsApi.getBestSellers()
        setBestSellers(products)
      } catch (error) {
        console.error('Error loading bestsellers:', error)
      } finally {
        setLoading(false)
      }
    }
    loadBestSellers()
  }, [])

  if (loading) {
    return (
      <section className="py-20 md:py-10 bg-slate-50 dark:bg-slate-950 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Chargement des best-sellers...</p>
        </div>
      </section>
    )
  }

  if (bestSellers.length === 0) {
    return null
  }

  // Limiter à 6 produits maximum
  const displayedProducts = bestSellers.slice(0, 6)

  return (
    <section id="catalogue" className="py-20 md:py-10 bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute top-0 left-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl"
          style={{ backgroundColor: 'hsl(217, 91%, 60%)' }}
        />
        <div 
          className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl"
          style={{ backgroundColor: 'hsl(48, 96%, 53%)' }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 mb-16 md:mb-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 md:mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 md:px-5 md:py-2.5 rounded-full bg-gradient-to-r from-blue-500/10 to-yellow-500/10 backdrop-blur-sm mb-4 md:mb-6"
          >
            <span className="text-xl md:text-2xl">⭐</span>
            <span className="text-xs md:text-sm font-medium text-slate-700 dark:text-slate-300">Nos best-sellers</span>
          </motion.div>
          
          <h2 className="text-2xl md:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-3 md:mb-6 px-4">
            Nos <span className="bg-gradient-to-r from-blue-400 to-blue-500 bg-clip-text text-transparent">best-sellers</span>
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-sm md:text-base lg:text-lg leading-relaxed px-4">
            Découvrez nos tricycles les plus populaires, prisés pour leur qualité et leur fiabilité.
          </p>
        </motion.div>
      </div>

      {/* Grille de produits */}
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
          {displayedProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <Link 
                href={`/produit/${product.id}`} 
                className="group block h-full"
              >
                <div className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden border-2 border-blue-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-slate-700 transition-all hover:shadow-lg h-full flex flex-col">
                  <div className="relative aspect-[3/2] overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <ImageWithFallback
                      src={getImageUrl(product.image)}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      priority={index < 3}
                    />
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-amber-400 text-amber-900 text-xs font-bold">
                      Best-seller
                    </div>
                  </div>
                  <div className="p-3 flex flex-col flex-1 bg-blue-50 dark:bg-slate-900">
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-blue-400 dark:text-blue-400 mb-0.5 truncate">{product.category}</p>
                        <h3 className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-blue-500 transition-colors truncate">
                          {product.name}
                        </h3>
                      </div>
                      <span className="text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded-full whitespace-nowrap flex-shrink-0">
                        {product.stock}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-2 flex-1 line-clamp-2">
                      {product.shortDescription}
                    </p>
                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-base font-bold text-slate-900 dark:text-white">
                        {formatPrice(product.price)}
                      </span>
                      <span className="text-blue-500 text-xs font-medium group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                        Voir <span>→</span>
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mt-20 relative z-10"
      >
        <Link href="/produits">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-white text-sm bg-gradient-to-r from-blue-600 to-blue-500 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300"
          >
            Voir tous les modèles
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14"/>
              <path d="m12 5 7 7-7 7"/>
            </svg>
          </motion.button>
        </Link>
      </motion.div>
    </section>
  )
}
