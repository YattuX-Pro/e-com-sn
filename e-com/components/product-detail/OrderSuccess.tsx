"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { formatPrice } from "@/lib/data"
import Image from "next/image"
import Link from "next/link"

interface OrderSuccessProps {
  productName: string
  productImage: string
  quantity: number
  totalPrice: number
}

export default function OrderSuccess({ productName, productImage, quantity, totalPrice }: OrderSuccessProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 pt-20">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-slate-900 rounded-2xl p-8 max-w-md text-center shadow-xl border border-slate-200 dark:border-slate-800 mx-4"
      >
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 bg-green-500">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/>
          </svg>
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Commande envoyée !</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
          Notre équipe vous contactera sous 24h pour confirmer votre commande.
        </p>
        <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 mb-6 text-left">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-lg bg-slate-200 dark:bg-slate-700 relative overflow-hidden">
              <Image 
                src={productImage.startsWith('http') ? productImage : `http://localhost:5001${productImage}`} 
                alt="" 
                fill 
                className="object-cover" 
              />
            </div>
            <div>
              <p className="font-medium text-slate-900 dark:text-white text-sm">{productName}</p>
              <p className="text-xs text-slate-500">Qté: {quantity}</p>
            </div>
          </div>
          <div className="flex justify-between pt-3 border-t border-slate-200 dark:border-slate-700">
            <span className="text-sm text-slate-500">Total</span>
            <span className="font-bold text-slate-900 dark:text-white">{formatPrice(totalPrice)}</span>
          </div>
        </div>
        <div className="flex gap-3">
          <Link href="/produits" className="flex-1">
            <Button variant="outline" className="w-full">Continuer</Button>
          </Link>
          <Link href="/" className="flex-1">
            <Button className="w-full bg-blue-500 hover:bg-blue-600">Accueil</Button>
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
