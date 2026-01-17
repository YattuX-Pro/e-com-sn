"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { formatPrice } from "@/lib/data"
import Image from "next/image"
import { getImageUrl } from "@/lib/config"

interface OrderForm {
  nom: string
  telephone: string
  email: string
  adresse: string
  quantite: number
  commentaire?: string
}

interface FormErrors {
  nom?: string
  telephone?: string
  email?: string
  adresse?: string
  quantite?: string
}

interface Product {
  id: string
  name: string
  price: number
  stock: number
  image: string
}

interface OrderFormModalProps {
  product: Product
  isOpen: boolean
  onClose: () => void
  onSubmit: (formData: OrderForm) => Promise<void>
}

export default function OrderFormModal({ product, isOpen, onClose, onSubmit }: OrderFormModalProps) {
  const [formData, setFormData] = useState<OrderForm>({
    nom: "",
    telephone: "",
    email: "",
    adresse: "",
    quantite: 1,
    commentaire: ""
  })
  
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}
    
    if (!formData.nom.trim()) {
      newErrors.nom = "Le nom est requis"
    }
    
    if (!formData.telephone.trim()) {
      newErrors.telephone = "Le téléphone est requis"
    } else if (!/^\+?[0-9]{7,15}$/.test(formData.telephone.replace(/\s/g, ''))) {
      newErrors.telephone = "Numéro de téléphone invalide (7-15 chiffres)"
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "L'email est requis"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email invalide"
    }
    
    if (!formData.adresse.trim()) {
      newErrors.adresse = "L'adresse est requise"
    }
    
    if (formData.quantite < 1) {
      newErrors.quantite = "La quantité doit être au moins 1"
    } else if (formData.quantite > product.stock) {
      newErrors.quantite = `Stock disponible: ${product.stock}`
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsSubmitting(true)
    await onSubmit(formData)
    setIsSubmitting(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantite' ? parseInt(value) || 1 : value
    }))
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  const totalPrice = product.price * formData.quantite

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-sm overflow-y-auto" onClick={onClose}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-2xl border border-slate-200 dark:border-slate-800 shadow-2xl my-auto max-h-[95vh] flex flex-col"
      >
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-200 dark:border-slate-800 shrink-0">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">Commander</h2>
          <button 
            onClick={onClose}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div className="p-4 sm:p-6 overflow-y-auto">
          <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-gradient-to-br from-blue-50 to-slate-50 dark:from-blue-950/20 dark:to-slate-800 mb-4 sm:mb-6 border border-blue-100 dark:border-blue-900/30">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-white dark:bg-slate-700 relative overflow-hidden shrink-0 shadow-sm">
              <Image 
                src={getImageUrl(product.image)} 
                alt="" 
                fill 
                className="object-cover" 
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-slate-900 dark:text-white text-xs sm:text-sm mb-0.5 truncate">{product.name}</p>
              <p className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400">{formatPrice(product.price)}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 sm:mb-1.5">
                  Nom complet
                </label>
                <Input
                  type="text"
                  name="nom"
                  value={formData.nom}
                  onChange={handleChange}
                  placeholder="Votre nom"
                  className={`h-10 sm:h-11 text-base ${errors.nom ? 'ring-2 ring-red-500 border-red-500' : ''}`}
                />
                {errors.nom && <p className="text-red-500 text-xs mt-1">{errors.nom}</p>}
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 sm:mb-1.5">
                  Téléphone
                </label>
                <Input
                  type="tel"
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleChange}
                  placeholder="+221 765788887"
                  className={`h-10 sm:h-11 text-base ${errors.telephone ? 'ring-2 ring-red-500 border-red-500' : ''}`}
                />
                {errors.telephone && <p className="text-red-500 text-xs mt-1">{errors.telephone}</p>}
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 sm:mb-1.5">
                  Email
                </label>
                <Input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="votre@email.com"
                  className={`h-10 sm:h-11 text-base ${errors.email ? 'ring-2 ring-red-500 border-red-500' : ''}`}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 sm:mb-1.5">
                  Quantité
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, quantite: Math.max(1, prev.quantite - 1) }))}
                    className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-white flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors font-medium text-lg"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    name="quantite"
                    value={formData.quantite}
                    onChange={handleChange}
                    min={1}
                    max={product.stock}
                    className="flex-1 h-10 sm:h-11 text-center rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-base"
                  />
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, quantite: Math.min(product.stock, prev.quantite + 1) }))}
                    className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-white flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors font-medium text-lg"
                  >
                    +
                  </button>
                </div>
                {errors.quantite && <p className="text-red-500 text-xs mt-1">{errors.quantite}</p>}
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 sm:mb-1.5">
                Adresse de livraison
              </label>
              <textarea
                name="adresse"
                value={formData.adresse}
                onChange={handleChange}
                placeholder="Votre adresse complète"
                rows={2}
                className={`w-full px-3 py-2 sm:py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-base ${errors.adresse ? 'ring-2 ring-red-500 border-red-500' : ''}`}
              />
              {errors.adresse && <p className="text-red-500 text-xs mt-1">{errors.adresse}</p>}
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 sm:mb-1.5">
                Commentaire (optionnel)
              </label>
              <textarea
                name="commentaire"
                value={formData.commentaire}
                onChange={handleChange}
                placeholder="Ajoutez un commentaire à votre commande..."
                rows={2}
                className="w-full px-3 py-2 sm:py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-base"
              />
            </div>

            <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-xl p-3 sm:p-4 border border-slate-200 dark:border-slate-700">
              <div className="flex justify-between items-center">
                <span className="text-slate-600 dark:text-slate-400 font-medium text-sm sm:text-base">Total à payer</span>
                <span className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  {formatPrice(totalPrice)}
                </span>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 sm:h-12 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all text-sm sm:text-base"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Envoi en cours...
                </span>
              ) : (
                'Confirmer la commande'
              )}
            </Button>

            <p className="text-xs text-slate-500 text-center">
              Notre équipe vous contactera sous 24h pour finaliser la commande.
            </p>
          </form>
        </div>
      </motion.div>
    </div>
  )
}
