"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { productsApi, Product } from "@/lib/api"
import { getImageUrl } from "@/lib/config"

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [direction, setDirection] = useState(1)
  const [promotedProducts, setPromotedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadPromotedProducts = async () => {
      try {
        const products = await productsApi.getPromoted()
        setPromotedProducts(products)
      } catch (error) {
        console.error('Error loading promoted products:', error)
      } finally {
        setLoading(false)
      }
    }
    loadPromotedProducts()
  }, [])

  useEffect(() => {
    if (promotedProducts.length === 0) return
    const timer = setInterval(() => {
      setDirection(1)
      setCurrentSlide((prev) => (prev + 1) % promotedProducts.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [promotedProducts.length, currentSlide])

  const nextSlide = useCallback(() => {
    setDirection(1)
    setCurrentSlide((prev) => (prev + 1) % promotedProducts.length)
  }, [promotedProducts.length])

  const prevSlide = useCallback(() => {
    setDirection(-1)
    setCurrentSlide((prev) => (prev - 1 + promotedProducts.length) % promotedProducts.length)
  }, [promotedProducts.length])

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? '-100%' : '100%', opacity: 0 })
  }

  const cardVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 100 : -100, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -100 : 100, opacity: 0 })
  }

  if (loading) {
    return (
      <section className="relative min-h-screen overflow-hidden bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Chargement...</p>
        </div>
      </section>
    )
  }

  const currentProduct = promotedProducts.length > 0 ? promotedProducts[currentSlide] : null

  return (
    <section className="relative min-h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
      <div className="absolute inset-0">
        <div className="absolute inset-0 opacity-30" style={{ background: 'radial-gradient(ellipse 80% 50% at 50% -20%, hsl(217, 91%, 60%), transparent)' }} />
        <div className="absolute inset-0 opacity-20" style={{ background: 'radial-gradient(ellipse 60% 40% at 100% 100%, hsl(48, 96%, 53%), transparent)' }} />
      </div>

      <div className="absolute inset-0 opacity-[0.03] hidden lg:block" style={{ backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`, backgroundSize: '60px 60px' }} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-screen py-16 pt-28 lg:py-20 lg:pt-32">
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, ease: "easeOut" }}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }} className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full border border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm mb-6 md:mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-xs md:text-sm text-slate-600 dark:text-slate-300">Livraison disponible partout au Sénégal</span>
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8 }} className="text-3xl sm:text-4xl lg:text-6xl xl:text-7xl font-bold text-slate-900 dark:text-white leading-[1.1] mb-4 md:mb-6">
              La puissance<br />
              <span className="relative">
                <span className="relative z-10" style={{ color: 'hsl(48, 96%, 53%)' }}>sur trois roues</span>
                <motion.svg initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 1, duration: 1 }} className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none">
                  <motion.path d="M2 10C50 4 100 4 150 6C200 8 250 4 298 8" stroke="hsl(48, 96%, 53%)" strokeWidth="3" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 1, duration: 1 }} />
                </motion.svg>
              </span>
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.8 }} className="text-base md:text-lg text-slate-600 dark:text-slate-400 mb-8 md:mb-10 max-w-lg leading-relaxed">
              Tricycles <span className="text-slate-900 dark:text-white font-semibold">Hasilaza</span> — robustes, économiques et fiables. Idéal pour le transport de marchandises et de passagers.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 0.8 }} className="flex flex-col sm:flex-row flex-wrap gap-3 md:gap-4 mb-10 md:mb-12">
              <Link href="/produits">
                <Button size="lg" className="text-sm md:text-base px-6 py-3 md:px-8 md:py-6 rounded-full font-semibold text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 w-full sm:w-auto justify-center" style={{ backgroundColor: 'hsl(217, 91%, 60%)', color: 'white' }}>
                  Explorer le catalogue
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </Button>
              </Link>
              <Link href="/pieces">
                <Button size="lg" variant="outline" className="text-sm md:text-base px-6 py-3 md:px-8 md:py-6 rounded-full font-semibold border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-all duration-300 w-full sm:w-auto justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M12 2a10 10 0 1 0 10 10H12V2z"/><path d="M12 2a10 10 0 0 1 10 10"/><path d="M12 12l8-8"/></svg>
                  Pièces détachées
                </Button>
              </Link>
              <Link href="/depannage">
                <Button size="lg" variant="outline" className="text-sm md:text-base px-6 py-3 md:px-8 md:py-6 rounded-full font-semibold border-orange-400 dark:border-orange-500 text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950 transition-all duration-300 w-full sm:w-auto justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
                  Dépannage
                </Button>
              </Link>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9, duration: 0.8 }} className="grid grid-cols-3 gap-4 md:gap-8">
              {[{ value: "1000+", label: "Clients" }, { value: "Garantie", label: "Incluse" }, { value: "24h", label: "Support" }].map((stat, index) => (
                <div key={index} className="text-center sm:text-left">
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold mb-1" style={{ color: 'hsl(48, 96%, 53%)' }}>{stat.value}</div>
                  <div className="text-xs md:text-sm text-slate-600 dark:text-slate-500">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          <div className="relative hidden lg:block">
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden">
              {currentProduct ? (
                <>
                  <AnimatePresence initial={false} custom={direction} mode="popLayout">
                    <motion.div key={currentSlide} custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ type: "tween", duration: 0.5, ease: "easeInOut" }} className="absolute inset-0">
                      <Image src={getImageUrl(currentProduct.image)} alt={currentProduct.name} fill className="object-cover" priority />
                      <motion.div custom={direction} variants={cardVariants} initial="enter" animate="center" exit="exit" transition={{ type: "tween", duration: 0.5, ease: "easeInOut", delay: 0.1 }} className="absolute left-18 top-1/2 -translate-y-1/2 max-w-xs">
                        <Link href={`/produit/${currentProduct.id}`}>
                          <div className="rounded-2xl p-5 cursor-pointer hover:scale-105 transition-transform duration-300 backdrop-blur-sm" style={{ backgroundColor: 'rgba(59, 130, 246, 0.85)' }}>
                            <h3 className="text-white text-lg font-bold mb-2 leading-tight">{currentProduct.name}</h3>
                            <div className="w-10 h-0.5 bg-white/50 mb-2"></div>
                            <p className="text-white/90 text-xs leading-relaxed mb-3 line-clamp-2">{currentProduct.shortDescription}</p>
                            <div className="inline-block px-3 py-1.5 bg-red-600 text-white text-lg font-bold rounded-lg">{currentProduct.price.toLocaleString('fr-FR')} FCFA</div>
                          </div>
                        </Link>
                      </motion.div>
                    </motion.div>
                  </AnimatePresence>
                  <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between px-4 pointer-events-none z-10">
                    <button onClick={prevSlide} className="w-11 h-11 rounded-full bg-red-600 text-white flex items-center justify-center hover:bg-red-700 hover:scale-110 transition-all shadow-lg pointer-events-auto">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                  </button>
                    <button onClick={nextSlide} className="w-11 h-11 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 hover:scale-110 transition-all shadow-lg pointer-events-auto">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                  </button>
                  </div>
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                    {promotedProducts.map((_, index: number) => (
                      <button key={index} onClick={() => { setDirection(index > currentSlide ? 1 : -1); setCurrentSlide(index); }} className={`h-2 rounded-full transition-all ${index === currentSlide ? 'bg-white w-8' : 'bg-white/50 w-2'}`} />
                    ))}
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 rounded-3xl">
                  <div className="text-center p-8">
                    <div className="text-6xl mb-4">📦</div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Aucun produit en promotion</h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">Les produits apparaîtront ici prochainement</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {currentProduct && (
          <div className="lg:hidden pb-8">
            <div className="relative rounded-2xl overflow-hidden mx-auto max-w-md">
              <AnimatePresence initial={false} custom={direction} mode="popLayout">
                <motion.div key={`mobile-${currentSlide}`} custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ type: "tween", duration: 0.5, ease: "easeInOut" }} className="relative aspect-[4/3]">
                  <Image src={getImageUrl(currentProduct.image)} alt={currentProduct.name} fill className="object-cover" priority />
                  <motion.div custom={direction} variants={cardVariants} initial="enter" animate="center" exit="exit" transition={{ type: "tween", duration: 0.5, ease: "easeInOut", delay: 0.1 }} className="absolute bottom-4 left-4 right-4">
                    <Link href={`/produit/${currentProduct.id}`}>
                      <div className="rounded-xl p-4 backdrop-blur-sm" style={{ backgroundColor: 'rgba(59, 130, 246, 0.9)' }}>
                        <h3 className="text-white text-base font-bold mb-1 leading-tight">{currentProduct.name}</h3>
                        <p className="text-white/90 text-xs leading-relaxed mb-2 line-clamp-1">{currentProduct.shortDescription}</p>
                        <div className="inline-block px-3 py-1 bg-red-600 text-white text-sm font-bold rounded-lg">{currentProduct.price.toLocaleString('fr-FR')} FCFA</div>
                      </div>
                    </Link>
                  </motion.div>
                </motion.div>
              </AnimatePresence>
      
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                {promotedProducts.map((_, index: number) => (
                  <button key={index} onClick={() => { setDirection(index > currentSlide ? 1 : -1); setCurrentSlide(index); }} className={`h-1.5 rounded-full transition-all ${index === currentSlide ? 'bg-white w-6' : 'bg-white/50 w-1.5'}`} />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-50 dark:from-slate-950 to-transparent" />
    </section>
  )
}
