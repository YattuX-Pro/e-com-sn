"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { products, categories, formatPrice, Product } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import Link from "next/link"

const ITEMS_PER_PAGE = 6

export default function ProductCatalog() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Tous")
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 3000000])
  const [currentPage, setCurrentPage] = useState(1)

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           product.shortDescription.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === "Tous" || product.category === selectedCategory
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1]
      return matchesSearch && matchesCategory && matchesPrice
    })
  }, [searchQuery, selectedCategory, priceRange])

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE)
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const priceRanges = [
    { label: "Tous les prix", value: [0, 3000000] },
    { label: "Moins de 1.5M", value: [0, 1500000] },
    { label: "1.5M - 2M", value: [1500000, 2000000] },
    { label: "Plus de 2M", value: [2000000, 3000000] },
  ]

  return (
    <section id="catalogue" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Notre Catalogue
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explorez notre gamme complète de tricycles. Trouvez le modèle parfait pour vos besoins.
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-gray-50 rounded-2xl p-6 mb-10"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rechercher
              </label>
              <div className="relative">
                <svg 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="20" 
                  height="20" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8"/>
                  <path d="m21 21-4.3-4.3"/>
                </svg>
                <Input
                  type="text"
                  placeholder="Rechercher un tricycle..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Catégorie
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value)
                  setCurrentPage(1)
                }}
                className="w-full h-10 px-3 rounded-md border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Price Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gamme de prix
              </label>
              <select
                value={JSON.stringify(priceRange)}
                onChange={(e) => {
                  setPriceRange(JSON.parse(e.target.value))
                  setCurrentPage(1)
                }}
                className="w-full h-10 px-3 rounded-md border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {priceRanges.map((range, index) => (
                  <option key={index} value={JSON.stringify(range.value)}>
                    {range.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Results count */}
          <div className="mt-4 text-sm text-gray-600">
            {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''} trouvé{filteredProducts.length > 1 ? 's' : ''}
          </div>
        </motion.div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {paginatedProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group">
                <div className="relative h-56 overflow-hidden bg-gray-100">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {product.bestSeller && (
                    <div 
                      className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold"
                      style={{ backgroundColor: 'hsl(48, 96%, 53%)', color: '#1a1a1a' }}
                    >
                      Best Seller
                    </div>
                  )}
                  <div className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-medium bg-white/90 text-gray-700">
                    Stock: {product.stock}
                  </div>
                </div>
                <div className="p-6">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {product.category}
                  </span>
                  <h3 className="text-xl font-bold text-gray-900 mt-1 mb-2">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {product.shortDescription}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span 
                      className="text-xl font-bold"
                      style={{ color: 'hsl(217, 91%, 60%)' }}
                    >
                      {formatPrice(product.price)}
                    </span>
                    <Link href={`/produit/${product.id}`}>
                      <Button 
                        style={{ backgroundColor: 'hsl(217, 91%, 60%)', color: 'white' }}
                      >
                        Commander
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun produit trouvé</h3>
            <p className="text-gray-600">Essayez de modifier vos critères de recherche</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex justify-center items-center gap-2 mt-12"
          >
            <Button
              variant="outline"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Précédent
            </Button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                  currentPage === page
                    ? 'text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                style={currentPage === page ? { backgroundColor: 'hsl(217, 91%, 60%)' } : {}}
              >
                {page}
              </button>
            ))}
            
            <Button
              variant="outline"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Suivant
            </Button>
          </motion.div>
        )}
      </div>
    </section>
  )
}
