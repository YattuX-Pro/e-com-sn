"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams } from "next/navigation"
import { motion } from "framer-motion"
import { sparePartsApi, SparePart, sparePartOrdersApi } from "@/lib/api"
import { getImageUrl } from "@/lib/config"
import { Button } from "@/components/ui/button"
import ImageWithFallback from "@/components/ImageWithFallback"
import Link from "next/link"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import SparePartGallery from "@/components/spareparts/SparePartGallery"

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('fr-SN', { style: 'decimal', maximumFractionDigits: 0 }).format(price) + ' FCFA'
}

interface OrderForm {
  nom: string
  telephone: string
  email: string
  adresse: string
  quantite: number
  commentaire?: string
}

export default function SparePartDetailPage() {
  const params = useParams()
  const [part, setPart] = useState<SparePart | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [showForm, setShowForm] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [orderData, setOrderData] = useState<OrderForm | null>(null)

  useEffect(() => {
    const loadPart = async () => {
      try {
        const data = await sparePartsApi.getById(params.id as string)
        setPart(data)
      } catch (error) {
        console.error('Error loading spare part:', error)
      } finally {
        setLoading(false)
      }
    }
    if (params.id) loadPart()
  }, [params.id])

  useEffect(() => {
    if (isSuccess) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [isSuccess])

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 pt-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-slate-600 dark:text-slate-400">Chargement de la pièce...</p>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  if (!part) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 pt-20">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
              <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Pièce non trouvée</h1>
            <p className="text-slate-500 dark:text-slate-400 mb-6">Cette pièce n'existe pas ou a été supprimée</p>
            <Link href="/pieces">
              <Button className="bg-blue-500 hover:bg-blue-600">
                Voir les pièces
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  const allImages = [part.image, ...(part.images || [])].filter(Boolean).map(img => getImageUrl(img))

  const handleOrderSubmit = async (formData: OrderForm) => {
    try {
      await sparePartOrdersApi.create({
        customerName: formData.nom,
        customerPhone: formData.telephone,
        customerEmail: formData.email,
        customerAddress: formData.adresse,
        sparePartId: part.id,
        quantity: formData.quantite,
        comment: formData.commentaire || null
      })
      setOrderData(formData)
      setShowForm(false)
      setIsSuccess(true)
    } catch (error) {
      console.error('Error creating order:', error)
      alert('Erreur lors de la création de la commande. Veuillez réessayer.')
    }
  }

  if (isSuccess && orderData) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 pt-20 pb-16">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }} 
            className="text-center bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl max-w-md mx-4 border border-slate-200 dark:border-slate-800"
          >
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Commande envoyée !</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-2">Merci pour votre commande de</p>
            <p className="text-lg font-semibold text-slate-900 dark:text-white mb-1">{part.name}</p>
            <p className="text-blue-600 font-bold text-xl mb-6">{formatPrice(part.price * orderData.quantite)}</p>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Nous vous contacterons très bientôt pour confirmer votre commande.</p>
            <Link href="/pieces">
              <Button className="bg-blue-500 hover:bg-blue-600 px-8">
                Continuer mes achats
              </Button>
            </Link>
          </motion.div>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <div className="pt-24 pb-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
              <Link href="/" className="hover:text-blue-500 transition-colors">Accueil</Link>
              <span>/</span>
              <Link href="/pieces" className="hover:text-blue-500 transition-colors">Pièces Détachées</Link>
              <span>/</span>
              <span className="text-slate-900 dark:text-white font-medium line-clamp-1">{part.name}</span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            <div className="h-full">
              <div className="sticky top-24">
                <SparePartGallery
                  images={allImages}
                  partName={part.name}
                  stock={part.stock}
                />
              </div>
            </div>

            <div className="h-full">
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800">
                <span className="inline-block px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-medium mb-3">
                  {part.category}
                </span>
                <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white mb-2">
                  {part.name}
                </h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">Réf: {part.reference}</p>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                  {part.description}
                </p>
                
                {part.compatibilite && (
                  <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                    <p className="text-sm font-medium text-slate-900 dark:text-white mb-1">Compatibilité</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{part.compatibilite}</p>
                  </div>
                )}

                <div className="flex items-center justify-between py-4 border-y border-slate-200 dark:border-slate-700">
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Prix</p>
                    <p className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white">
                      {formatPrice(part.price)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-500 mb-1">Stock</p>
                    <p className={`font-semibold flex items-center gap-1 ${part.stock > 5 ? 'text-green-600 dark:text-green-400' : part.stock > 0 ? 'text-orange-600 dark:text-orange-400' : 'text-red-600 dark:text-red-400'}`}>
                      <span className={`w-2 h-2 rounded-full ${part.stock > 5 ? 'bg-green-500' : part.stock > 0 ? 'bg-orange-500' : 'bg-red-500'}`}></span>
                      {part.stock > 5 ? 'En stock' : part.stock > 0 ? `${part.stock} restant${part.stock > 1 ? 's' : ''}` : 'Rupture'}
                    </p>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <Button 
                    onClick={() => setShowForm(true)}
                    disabled={part.stock === 0}
                    className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl disabled:opacity-50"
                  >
                    Commander maintenant
                  </Button>
                  <Link href="/pieces" className="block">
                    <Button variant="outline" className="w-full h-12 rounded-xl">
                      ← Retour aux pièces
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 mt-6">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Avantages</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">Garantie</p>
                      <p className="text-xs text-slate-500">Incluse</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                    <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-500/20 flex items-center justify-center">
                      <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">Qualité</p>
                      <p className="text-xs text-slate-500">Certifiée</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {showForm && (
          <SparePartOrderModal 
            part={part} 
            onClose={() => setShowForm(false)} 
            onSubmit={handleOrderSubmit} 
          />
        )}
      </main>
      <Footer />
    </>
  )
}

function SparePartOrderModal({ 
  part, 
  onClose, 
  onSubmit 
}: { 
  part: SparePart
  onClose: () => void
  onSubmit: (data: OrderForm) => void 
}) {
  const [form, setForm] = useState<OrderForm>({
    nom: "",
    telephone: "",
    email: "",
    adresse: "",
    quantite: 1,
    commentaire: ""
  })
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    await onSubmit(form)
    setSubmitting(false)
  }

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }} 
        className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] flex flex-col" 
        onClick={e => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-4 rounded-t-2xl">
          <div className="flex items-center gap-4">
            <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-white/20 flex-shrink-0">
              <ImageWithFallback src={getImageUrl(part.image)} alt={part.name} fill className="object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-bold text-white text-lg truncate">{part.name}</h2>
              <p className="text-blue-100 text-sm">Réf: {part.reference}</p>
            </div>
            <div className="text-right">
              <p className="text-white font-bold text-xl">{formatPrice(part.price)}</p>
              <p className="text-blue-100 text-xs">l'unité</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Nom complet *</label>
              <input 
                type="text" 
                required 
                value={form.nom} 
                onChange={e => setForm({...form, nom: e.target.value})} 
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-base focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all" 
                placeholder="Votre nom"
                onInvalid={(e) => (e.target as HTMLInputElement).setCustomValidity('Veuillez remplir ce champ')}
                onInput={(e) => (e.target as HTMLInputElement).setCustomValidity('')}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Téléphone *</label>
              <input 
                type="tel" 
                required 
                value={form.telephone} 
                onChange={e => setForm({...form, telephone: e.target.value})} 
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-base focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all" 
                placeholder="+221 7X XXX XX XX"
                onInvalid={(e) => (e.target as HTMLInputElement).setCustomValidity('Veuillez remplir ce champ')}
                onInput={(e) => (e.target as HTMLInputElement).setCustomValidity('')}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email</label>
              <input 
                type="email" 
                value={form.email} 
                onChange={e => setForm({...form, email: e.target.value})} 
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-base focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all" 
                placeholder="votre@email.com"
                onInvalid={(e) => {
                  const input = e.target as HTMLInputElement
                  if (input.validity.typeMismatch) {
                    input.setCustomValidity('Veuillez entrer une adresse email valide')
                  } else {
                    input.setCustomValidity('Veuillez remplir ce champ')
                  }
                }}
                onInput={(e) => (e.target as HTMLInputElement).setCustomValidity('')}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Quantité</label>
              <input 
                type="number" 
                min={1} 
                max={part.stock} 
                required 
                value={form.quantite} 
                onChange={e => setForm({...form, quantite: parseInt(e.target.value) || 1})} 
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-base focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all" 
                onInvalid={(e) => {
                  const input = e.target as HTMLInputElement
                  if (input.validity.rangeOverflow) {
                    input.setCustomValidity(`Stock disponible: ${part.stock}`)
                  } else if (input.validity.rangeUnderflow) {
                    input.setCustomValidity('La quantité doit être au moins 1')
                  } else {
                    input.setCustomValidity('Veuillez entrer une quantité valide')
                  }
                }}
                onInput={(e) => (e.target as HTMLInputElement).setCustomValidity('')}
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Adresse de livraison *</label>
            <input 
              type="text"
              required 
              value={form.adresse} 
              onChange={e => setForm({...form, adresse: e.target.value})} 
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-base focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all" 
              placeholder="Votre adresse complète"
              onInvalid={(e) => (e.target as HTMLInputElement).setCustomValidity('Veuillez remplir ce champ')}
              onInput={(e) => (e.target as HTMLInputElement).setCustomValidity('')}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Commentaire (optionnel)</label>
            <textarea
              value={form.commentaire} 
              onChange={e => setForm({...form, commentaire: e.target.value})} 
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-base focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all resize-none" 
              placeholder="Ajoutez un commentaire à votre commande..."
              rows={2}
            />
          </div>

          <div className="flex items-center justify-between py-4 px-4 bg-slate-50 dark:bg-slate-800 rounded-xl mb-4">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Total à payer</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{formatPrice(part.price * form.quantite)}</p>
            </div>
            <div className="text-right text-sm text-slate-500 dark:text-slate-400">
              <p>{form.quantite} x {formatPrice(part.price)}</p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose} 
              className="flex-1 h-12 rounded-xl border-slate-300 dark:border-slate-700"
            >
              Annuler
            </Button>
            <Button 
              type="submit" 
              disabled={submitting} 
              className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-xl font-semibold"
            >
              {submitting ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Envoi...
                </span>
              ) : 'Confirmer la commande'}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}
