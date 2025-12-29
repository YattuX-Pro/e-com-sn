"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search } from "lucide-react"
import { Product, productsApi, PagedResult } from "@/lib/api"
import { ProductTable } from "@/components/products/ProductTable"
import { ProductDialog } from "@/components/products/ProductDialog"
import { ProductViewDialog } from "@/components/products/ProductViewDialog"
import { ImageUploadDialog } from "@/components/products/ImageUploadDialog"

export default function ProduitsPage() {
  const [pagedData, setPagedData] = useState<PagedResult<Product> | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [imageDialogOpen, setImageDialogOpen] = useState(false)
  const [selected, setSelected] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [searchInput, setSearchInput] = useState("")
  const [bestSellerFilter, setBestSellerFilter] = useState<boolean | undefined>(undefined)
  const [isPromotedFilter, setIsPromotedFilter] = useState<boolean | undefined>(undefined)

  useEffect(() => {
    loadProducts()
  }, [page, search, bestSellerFilter, isPromotedFilter])

  const loadProducts = async () => {
    try {
      setLoading(true)
      const data = await productsApi.getPaged({ 
        page, 
        pageSize: 5, 
        search,
        bestSeller: bestSellerFilter,
        isPromoted: isPromotedFilter
      })
      setPagedData(data)
    } catch (error) {
      console.error('Error loading products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    setSearch(searchInput)
    setPage(1)
  }

  const handleAdd = () => { setSelected(null); setDialogOpen(true) }
  const handleView = (p: Product) => { setSelected(p); setViewDialogOpen(true) }
  const handleEdit = (p: Product) => { setSelected(p); setDialogOpen(true) }
  const handleToggleActive = async (p: Product) => {
    try {
      await productsApi.toggleActive(p.id)
      await loadProducts()
    } catch (error) {
      console.error('Error toggling product active status:', error)
    }
  }
  const handleManageImages = (p: Product) => { setSelected(p); setImageDialogOpen(true) }

  const handleSave = async (data: Partial<Product>) => {
    try {
      if (selected) {
        await productsApi.update(selected.id, data as Omit<Product, 'id' | 'createdAt'>)
      } else {
        await productsApi.create(data as Omit<Product, 'id' | 'createdAt'>)
      }
      await loadProducts()
      setDialogOpen(false)
    } catch (error) {
      console.error('Error saving product:', error)
    }
  }


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">Produits</h1>
          <p className="text-muted-foreground">Gérez votre catalogue de produits</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90" onClick={handleAdd}>
          <Plus className="size-4" />
          Ajouter
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <CardTitle>Liste des produits ({pagedData?.totalCount || 0})</CardTitle>
              <div className="flex gap-2">
                <Input
                  placeholder="Rechercher..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-64"
                />
                <Button onClick={handleSearch} variant="outline">
                  <Search className="size-4" />
                </Button>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={bestSellerFilter === true ? "default" : "outline"}
                size="sm"
                onClick={() => setBestSellerFilter(bestSellerFilter === true ? undefined : true)}
              >
                Best-sellers
              </Button>
              <Button
                variant={isPromotedFilter === true ? "default" : "outline"}
                size="sm"
                onClick={() => setIsPromotedFilter(isPromotedFilter === true ? undefined : true)}
              >
                Promoted
              </Button>
              {(bestSellerFilter !== undefined || isPromotedFilter !== undefined) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setBestSellerFilter(undefined)
                    setIsPromotedFilter(undefined)
                  }}
                >
                  Réinitialiser filtres
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex flex-col items-center gap-2">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                <p className="text-sm text-muted-foreground">Chargement des produits...</p>
              </div>
            </div>
          ) : (
            <ProductTable products={pagedData?.items || []} onView={handleView} onEdit={handleEdit} onToggleActive={handleToggleActive} onManageImages={handleManageImages} />
          )}
          {pagedData && pagedData.totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Page {pagedData.page} sur {pagedData.totalPages}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={!pagedData.hasPreviousPage}
                >
                  Précédent
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setPage(p => p + 1)}
                  disabled={!pagedData.hasNextPage}
                >
                  Suivant
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <ProductDialog open={dialogOpen} onOpenChange={setDialogOpen} product={selected} onSave={handleSave} />
      <ProductViewDialog open={viewDialogOpen} onOpenChange={setViewDialogOpen} product={selected} />
      {selected && (
        <ImageUploadDialog
          open={imageDialogOpen}
          onOpenChange={setImageDialogOpen}
          productId={selected.id}
          productName={selected.name}
          currentImage={selected.image}
          currentImages={selected.images}
          onUploadComplete={loadProducts}
        />
      )}
    </div>
  )
}
