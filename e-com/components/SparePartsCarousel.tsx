"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { formatPrice } from "@/lib/data"
import { sparePartsApi, SparePart } from "@/lib/api"
import Image from "next/image"
import Link from "next/link"
import { getImageUrl } from "@/lib/config"

export default function SparePartsCarousel() {
  const [spareParts, setSpareParts] = useState<SparePart[]>([])
  const [loading, setLoading] = useState(true)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    const loadSpareParts = async () => {
      try {
        const parts = await sparePartsApi.getLatest(20)
        setSpareParts(parts)
      } catch (error) {
        console.error('Error loading spare parts:', error)
      } finally {
        setLoading(false)
      }
    }
    loadSpareParts()
  }, [])

  if (loading) {
    return (
      <section className="py-20 md:py-10 bg-white dark:bg-slate-900 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Chargement des pièces détachées...</p>
        </div>
      </section>
    )
  }

  if (spareParts.length === 0) {
    return null
  }

  // Calculer combien de fois dupliquer pour remplir l'écran (min 10 cards visibles)
  const minCardsNeeded = 12
  const duplicateCount = Math.max(2, Math.ceil(minCardsNeeded / spareParts.length))
  
  // Créer le tableau dupliqué
  let duplicatedParts: SparePart[] = []
  for (let i = 0; i < duplicateCount * 2; i++) {
    duplicatedParts = [...duplicatedParts, ...spareParts]
  }
  
  const cardWidth = 200
  const gap = 16
  const singleSetWidth = spareParts.length * duplicateCount * (cardWidth + gap)

  return (
    <section className="py-20 md:py-10 bg-white dark:bg-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute top-0 right-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl"
          style={{ backgroundColor: 'hsl(217, 91%, 60%)' }}
        />
        <div 
          className="absolute bottom-0 left-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl"
          style={{ backgroundColor: 'hsl(48, 96%, 53%)' }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 mb-10 md:mb-16 relative z-10">
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
            <span className="text-xl md:text-2xl">🔧</span>
            <span className="text-xs md:text-sm font-medium text-slate-700 dark:text-slate-300">Pièces détachées</span>
          </motion.div>
          
          <h2 className="text-2xl md:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-3 md:mb-6 px-4">
            Nos <span className="bg-gradient-to-r from-blue-400 to-blue-500 bg-clip-text text-transparent">pièces détachées</span>
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-sm md:text-base lg:text-lg leading-relaxed px-4">
            Découvrez notre sélection de pièces détachées de qualité pour l'entretien et la réparation de vos tricycles.
          </p>
        </motion.div>
      </div>

      {/* Carousel avec animation infinie - conteneur centré avec largeur fixe */}
      <div 
        className="relative z-10 max-w-6xl mx-auto overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Masque de dégradé sur les côtés pour effet infini */}
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white dark:from-slate-900 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white dark:from-slate-900 to-transparent z-10 pointer-events-none" />
        
        <motion.div 
          className="flex gap-4"
          animate={isPaused ? { x: 0 } : { x: [0, -singleSetWidth] }}
          transition={{
            x: {
              duration: spareParts.length * duplicateCount * 3,
              repeat: Infinity,
              ease: "linear",
              repeatType: "loop",
            },
          }}
          style={{ width: 'max-content' }}
        >
          {duplicatedParts.map((part, index) => (
            <div
              key={`${part.id}-${index}`}
              className="flex-shrink-0 w-[200px]"
            >
              <Link 
                href={`/pieces-detachees/${part.id}`} 
                className="group block h-full"
              >
                <div className="bg-slate-50 dark:bg-slate-800 rounded-xl overflow-hidden border-2 border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all hover:shadow-lg h-full flex flex-col">
                  <div className="relative aspect-square overflow-hidden bg-white dark:bg-slate-900">
                    <Image
                      src={getImageUrl(part.image)}
                      alt={part.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="200px"
                    />
                    {part.stock > 0 ? (
                      <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-green-500 text-white text-xs font-bold">
                        En stock
                      </div>
                    ) : (
                      <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-red-500 text-white text-xs font-bold">
                        Rupture
                      </div>
                    )}
                  </div>
                  <div className="p-3 flex flex-col flex-1 bg-white dark:bg-slate-800">
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-blue-500 dark:text-blue-400 mb-0.5 truncate">{part.category}</p>
                        <h3 className="text-xs font-semibold text-slate-900 dark:text-white group-hover:text-blue-500 transition-colors line-clamp-2">
                          {part.name}
                        </h3>
                      </div>
                    </div>
                    {part.reference && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                        Réf: {part.reference}
                      </p>
                    )}
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-2 flex-1 line-clamp-2">
                      {part.description}
                    </p>
                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-sm font-bold text-slate-900 dark:text-white">
                        {formatPrice(part.price)}
                      </span>
                      <span className="text-blue-500 text-xs font-medium group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                        Voir <span>→</span>
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </motion.div>
      </div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mt-16 relative z-10"
      >
        <Link href="/pieces-detachees">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-white text-sm bg-gradient-to-r from-blue-600 to-blue-500 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300"
          >
            Voir toutes les pièces
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
