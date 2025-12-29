"use client"

import { useState, useMemo, useEffect } from "react"
import { Product, Category, categoriesApi } from "@/lib/api"

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('fr-SN', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price) + ' FCFA'
}

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Pencil, Power, ChevronLeft, ChevronRight, ImageIcon, Eye } from "lucide-react"

interface ProductTableProps {
  products: Product[]
  onView: (product: Product) => void
  onEdit: (product: Product) => void
  onToggleActive: (product: Product) => void
  onManageImages: (product: Product) => void
}

export function ProductTable({ products, onView, onEdit, onToggleActive, onManageImages }: ProductTableProps) {
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("Tous")
  const [page, setPage] = useState(1)
  const [categories, setCategories] = useState<Category[]>([])
  const perPage = 5

  useEffect(() => {
    categoriesApi.getAll().then(cats => setCategories(cats)).catch(console.error)
  }, [])

  const filtered = useMemo(() => {
    return products.filter(p => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase())
      const matchCategory = category === "Tous" || p.category === category
      return matchSearch && matchCategory
    })
  }, [products, search, category])

  const paginated = useMemo(() => {
    const start = (page - 1) * perPage
    return filtered.slice(start, start + perPage)
  }, [filtered, page])

  const totalPages = Math.ceil(filtered.length / perPage)

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <Input
          placeholder="Rechercher un produit..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          className="max-w-sm"
        />
        <Select value={category} onValueChange={(v) => { setCategory(v); setPage(1) }}>
          <SelectTrigger className="w-60">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Tous">Tous</SelectItem>
            {categories.map(c => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Marque</TableHead>
            <TableHead>Modèle</TableHead>
            <TableHead>Catégorie</TableHead>
            <TableHead>Prix</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Best-seller</TableHead>
            <TableHead>Promotion</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginated.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center text-muted-foreground">Aucun produit trouvé</TableCell>
            </TableRow>
          ) : (
            paginated.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell className="text-muted-foreground">{product.marque || '-'}</TableCell>
                <TableCell className="text-muted-foreground">{product.modele || '-'}</TableCell>
                <TableCell><Badge variant="outline">{product.category}</Badge></TableCell>
                <TableCell className="font-medium">{formatPrice(product.price)}</TableCell>
                <TableCell>
                  <Badge variant={product.stock > 10 ? "default" : product.stock > 0 ? "secondary" : "destructive"}>
                    {product.stock}
                  </Badge>
                </TableCell>
                <TableCell>
                  {product.bestSeller && <Badge className="bg-yellow-500">★ Best</Badge>}
                </TableCell>
                <TableCell>
                  {product.isPromoted && <Badge className="bg-green-500">🏷️ Promoted</Badge>}
                </TableCell>
                <TableCell>
                  <Badge variant={product.isActive ? "default" : "secondary"}>
                    {product.isActive ? "Actif" : "Inactif"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="ghost" size="icon" onClick={() => onView(product)} title="Voir les détails">
                    <Eye className="size-4 text-blue-600" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onManageImages(product)} title="Gérer les images">
                    <ImageIcon className="size-4 text-purple-600" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onEdit(product)} title="Modifier">
                    <Pencil className="size-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => onToggleActive(product)} 
                    title={product.isActive ? "Désactiver" : "Activer"}
                  >
                    <Power className={`size-4 ${product.isActive ? 'text-green-600' : 'text-gray-400'}`} />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {filtered.length} résultat{filtered.length > 1 ? "s" : ""} - Page {page} sur {totalPages}
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
              <ChevronLeft className="size-4" />
              Précédent
            </Button>
            <Button variant="outline" size="sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
              Suivant
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
