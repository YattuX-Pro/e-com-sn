"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

interface SparePartGalleryProps {
  images: string[]
  partName: string
  stock: number
}

export default function SparePartGallery({ images, partName, stock }: SparePartGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0)

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 mb-4 relative group">
        <div className="relative aspect-square">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedImage}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0"
            >
              <Image
                src={images[selectedImage]}
                alt={partName}
                fill
                className="object-contain p-4"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </motion.div>
          </AnimatePresence>

          {stock <= 5 && stock > 0 && (
            <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-orange-400 text-orange-900 text-sm font-bold z-10">
              Stock limité
            </div>
          )}
          {stock === 0 && (
            <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-red-500 text-white text-sm font-bold z-10">
              Rupture de stock
            </div>
          )}

          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm flex items-center justify-center text-slate-900 dark:text-white hover:bg-white dark:hover:bg-slate-800 transition-all opacity-0 group-hover:opacity-100 z-10"
                aria-label="Image précédente"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/>
                </svg>
              </button>
              <button
                onClick={nextImage}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm flex items-center justify-center text-slate-900 dark:text-white hover:bg-white dark:hover:bg-slate-800 transition-all opacity-0 group-hover:opacity-100 z-10"
                aria-label="Image suivante"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
                </svg>
              </button>
            </>
          )}

          {images.length > 1 && (
            <div className="absolute bottom-4 right-4 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-sm text-white text-xs font-medium z-10">
              {selectedImage + 1} / {images.length}
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2">
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedImage(idx)}
            className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
              selectedImage === idx 
                ? 'border-blue-500 ring-2 ring-blue-200 dark:ring-blue-800' 
                : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
            }`}
          >
            <Image src={img} alt="" fill className="object-cover" sizes="80px" />
          </button>
        ))}
      </div>
    </motion.div>
  )
}
