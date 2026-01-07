"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { productsApi, Product, ordersApi } from "@/lib/api"
import { formatPrice } from "@/lib/data"
import { getImageUrl } from "@/lib/config"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import ProductGallery from "@/components/product-detail/ProductGallery"
import ProductInfo from "@/components/product-detail/ProductInfo"
import OrderFormModal from "@/components/product-detail/OrderFormModal"
import OrderSuccess from "@/components/product-detail/OrderSuccess"
import Breadcrumb from "@/components/product-detail/Breadcrumb"

interface OrderForm {
  nom: string
  telephone: string
  email: string
  adresse: string
  quantite: number
}

export default function ProductDetailPage() {
  const params = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSuccess, setIsSuccess] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [orderData, setOrderData] = useState<OrderForm | null>(null)

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const productData = await productsApi.getById(params.id as string)
        setProduct(productData)
      } catch (error) {
        console.error('Error loading product:', error)
      } finally {
        setLoading(false)
      }
    }
    if (params.id) {
      loadProduct()
    }
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
            <p className="text-slate-600 dark:text-slate-400">Chargement du produit...</p>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  if (!product) {
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
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Produit non trouvé</h1>
            <p className="text-slate-500 dark:text-slate-400 mb-6">Ce produit n'existe pas ou a été supprimé</p>
            <Link href="/produits">
              <Button className="bg-blue-500 hover:bg-blue-600">
                Voir le catalogue
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  const productImages = product.images && product.images.length > 0 
    ? product.images.map(img => getImageUrl(img))
    : [getImageUrl(product.image)]

  const handleOrderSubmit = async (formData: OrderForm) => {
    try {
      await ordersApi.create({
        customerName: formData.nom,
        customerPhone: formData.telephone,
        customerEmail: formData.email,
        customerAddress: formData.adresse,
        productId: product.id,
        quantity: formData.quantite
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
        <OrderSuccess
          productName={product.name}
          productImage={product.image}
          quantity={orderData.quantite}
          totalPrice={product.price * orderData.quantite}
        />
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <Breadcrumb productName={product.name} />

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            <div className="h-full">
              <ProductGallery
                images={productImages}
                productName={product.name}
                isBestSeller={product.bestSeller}
              />
            </div>

            <div className="h-full">
              <ProductInfo
                product={product}
                onOrderClick={() => setShowForm(true)}
              />
            </div>
          </div>

          {/* Product Details - En bas pour occuper l'espace vide */}
          <div className="mt-8 lg:mt-12">
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800">
              <span className="inline-block px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-medium mb-3">
                {product.category}
              </span>
              <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white mb-3">
                {product.name}
              </h1>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                {product.description}
              </p>
              
              <div className="flex items-center justify-between py-4 border-y border-slate-200 dark:border-slate-700">
                <div>
                  <p className="text-sm text-slate-500 mb-1">Prix</p>
                  <p className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white">
                    {formatPrice(product.price)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-500 mb-1">Stock</p>
                  <p className={`font-semibold flex items-center gap-1 ${product.stock > 5 ? 'text-green-600 dark:text-green-400' : 'text-orange-600 dark:text-orange-400'}`}>
                    <span className={`w-2 h-2 rounded-full ${product.stock > 5 ? 'bg-green-500' : 'bg-orange-500'}`}></span>
                    {product.stock > 5 ? 'En stock' : `${product.stock} restant${product.stock > 1 ? 's' : ''}`}
                  </p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="mt-6 space-y-3">
                <Button 
                  onClick={() => setShowForm(true)}
                  className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl"
                >
                  Commander maintenant
                </Button>
                <Link href="/produits" className="block">
                  <Button variant="outline" className="w-full h-12 rounded-xl">
                    ← Retour au catalogue
                  </Button>
                </Link>
              </div>
            </div>

            {/* Features */}
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
                    <p className="text-xs text-slate-500">Inclue</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                  <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-500/20 flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">Livraison</p>
                    <p className="text-xs text-slate-500">Gratuite</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <OrderFormModal
          product={product}
          isOpen={showForm}
          onClose={() => setShowForm(false)}
          onSubmit={handleOrderSubmit}
        />
      </main>
      <Footer />
    </>
  )
}
