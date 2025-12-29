"use client"

import { useState, useMemo, useRef, useEffect } from "react"
import { AnimatePresence } from "framer-motion"
import { productsApi, categoriesApi, Product } from "@/lib/api"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import ProductsHeader from "@/components/products/ProductsHeader"
import SearchBar from "@/components/products/SearchBar"
import FilterControls from "@/components/products/FilterControls"
import ResultsInfo from "@/components/products/ResultsInfo"
import ProductGrid from "@/components/products/ProductGrid"
import ProductList from "@/components/products/ProductList"
import EmptyState from "@/components/products/EmptyState"
import Pagination from "@/components/products/Pagination"

const ITEMS_PER_PAGE = 6

export default function ProduitsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<string[]>(["Tous"])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Tous")
  const [sortBy, setSortBy] = useState<"default" | "price-asc" | "price-desc">("default")
  const [currentPage, setCurrentPage] = useState(1)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const productsGridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [productsData, categoriesData] = await Promise.all([
          productsApi.getAll(),
          categoriesApi.getAll()
        ])
        setProducts(productsData)
        setCategories(["Tous", ...categoriesData.map(c => c.name)])
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const filteredProducts = useMemo(() => {
    let result = products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           product.shortDescription.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === "Tous" || product.category === selectedCategory
      return matchesSearch && matchesCategory
    })

    if (sortBy === "price-asc") {
      result = [...result].sort((a, b) => a.price - b.price)
    } else if (sortBy === "price-desc") {
      result = [...result].sort((a, b) => b.price - a.price)
    }

    return result
  }, [products, searchQuery, selectedCategory, sortBy])

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE)
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    setTimeout(() => {
      productsGridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
  }

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedCategory("Tous")
    setSortBy("default")
    setCurrentPage(1)
  }

  const hasActiveFilters = Boolean(searchQuery) || selectedCategory !== "Tous" || sortBy !== "default"

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-slate-600 dark:text-slate-400">Chargement des produits...</p>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <ProductsHeader />

        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
          {/* Top Bar - Search & Controls */}
          <div ref={productsGridRef} className="flex flex-col gap-3 sm:gap-4 mb-4 sm:mb-6">
            <SearchBar
              value={searchQuery}
              onChange={(value) => {
                setSearchQuery(value)
                setCurrentPage(1)
              }}
            />

            <FilterControls
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={(category) => {
                setSelectedCategory(category)
                setCurrentPage(1)
              }}
              sortBy={sortBy}
              onSortChange={setSortBy}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
            />
          </div>

          <ResultsInfo
            count={filteredProducts.length}
            hasActiveFilters={hasActiveFilters}
            onClearFilters={clearFilters}
          />

          {/* Products */}
          <AnimatePresence mode="wait">
            {filteredProducts.length === 0 ? (
              <EmptyState onClearFilters={clearFilters} />
            ) : viewMode === "grid" ? (
              <ProductGrid products={paginatedProducts} />
            ) : (
              <ProductList products={paginatedProducts} />
            )}
          </AnimatePresence>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </main>
      <Footer />
    </>
  )
}
