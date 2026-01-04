"use client"

import { useState, useMemo, useRef, useEffect } from "react"
import { AnimatePresence } from "framer-motion"
import { sparePartsApi, SparePart } from "@/lib/api"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import SparePartsHeader from "@/components/spareparts/SparePartsHeader"
import SparePartSearchBar from "@/components/spareparts/SparePartSearchBar"
import SparePartFilterControls from "@/components/spareparts/SparePartFilterControls"
import SparePartResultsInfo from "@/components/spareparts/SparePartResultsInfo"
import SparePartGrid from "@/components/spareparts/SparePartGrid"
import SparePartList from "@/components/spareparts/SparePartList"
import SparePartEmptyState from "@/components/spareparts/SparePartEmptyState"
import SparePartPagination from "@/components/spareparts/SparePartPagination"

const ITEMS_PER_PAGE = 6

export default function PiecesPage() {
  const [parts, setParts] = useState<SparePart[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Tous")
  const [sortBy, setSortBy] = useState<"default" | "price-asc" | "price-desc">("default")
  const [currentPage, setCurrentPage] = useState(1)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const partsGridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await sparePartsApi.getAll()
        setParts(data)
      } catch (error) {
        console.error('Error loading spare parts:', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const categories = useMemo(() => {
    const cats = [...new Set(parts.map(p => p.category).filter(Boolean))]
    return ["Tous", ...cats]
  }, [parts])

  const filteredParts = useMemo(() => {
    let result = parts.filter(part => {
      const matchesSearch = part.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           part.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           part.reference.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === "Tous" || part.category === selectedCategory
      return matchesSearch && matchesCategory
    })

    if (sortBy === "price-asc") {
      result = [...result].sort((a, b) => a.price - b.price)
    } else if (sortBy === "price-desc") {
      result = [...result].sort((a, b) => b.price - a.price)
    }

    return result
  }, [parts, searchQuery, selectedCategory, sortBy])

  const totalPages = Math.ceil(filteredParts.length / ITEMS_PER_PAGE)
  const paginatedParts = filteredParts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    setTimeout(() => {
      partsGridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
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
            <p className="text-slate-600 dark:text-slate-400">Chargement des pièces...</p>
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
        <SparePartsHeader />

        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
          <div ref={partsGridRef} className="flex flex-col gap-3 sm:gap-4 mb-4 sm:mb-6">
            <SparePartSearchBar
              value={searchQuery}
              onChange={(value) => {
                setSearchQuery(value)
                setCurrentPage(1)
              }}
            />

            <SparePartFilterControls
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

          <SparePartResultsInfo
            count={filteredParts.length}
            hasActiveFilters={hasActiveFilters}
            onClearFilters={clearFilters}
          />

          <AnimatePresence mode="wait">
            {filteredParts.length === 0 ? (
              <SparePartEmptyState onClearFilters={clearFilters} />
            ) : viewMode === "grid" ? (
              <SparePartGrid parts={paginatedParts} />
            ) : (
              <SparePartList parts={paginatedParts} />
            )}
          </AnimatePresence>

          <SparePartPagination
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
