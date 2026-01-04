"use client"

import { useState, useMemo } from "react"
import { SparePart } from "@/lib/api"

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

interface SparePartTableProps {
  parts: SparePart[]
  onView: (part: SparePart) => void
  onEdit: (part: SparePart) => void
  onToggleActive: (part: SparePart) => void
  onManageImages: (part: SparePart) => void
}

export function SparePartTable({ parts, onView, onEdit, onToggleActive, onManageImages }: SparePartTableProps) {
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("Tous")
  const [page, setPage] = useState(1)
  const perPage = 5

  const categories = useMemo(() => {
    const cats = [...new Set(parts.map(p => p.category).filter(Boolean))]
    return cats
  }, [parts])

  const filtered = useMemo(() => {
    return parts.filter(p => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.reference.toLowerCase().includes(search.toLowerCase())
      const matchCategory = category === "Tous" || p.category === category
      return matchSearch && matchCategory
    })
  }, [parts, search, category])

  const paginated = useMemo(() => {
    const start = (page - 1) * perPage
    return filtered.slice(start, start + perPage)
  }, [filtered, page])

  const totalPages = Math.ceil(filtered.length / perPage)

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <Input
          placeholder="Rechercher une pièce..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          className="max-w-sm"
        />
        <Select value={category} onValueChange={(v) => { setCategory(v); setPage(1) }}>
          <SelectTrigger className="w-60">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Tous">Toutes les catégories</SelectItem>
            {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Référence</TableHead>
            <TableHead>Catégorie</TableHead>
            <TableHead>Prix</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Compatibilité</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginated.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center text-muted-foreground">Aucune pièce trouvée</TableCell>
            </TableRow>
          ) : (
            paginated.map((part) => (
              <TableRow key={part.id}>
                <TableCell className="font-medium">{part.name}</TableCell>
                <TableCell className="text-muted-foreground font-mono">{part.reference}</TableCell>
                <TableCell><Badge variant="outline">{part.category}</Badge></TableCell>
                <TableCell className="font-medium">{formatPrice(part.price)}</TableCell>
                <TableCell>
                  <Badge variant={part.stock > 10 ? "default" : part.stock > 0 ? "secondary" : "destructive"}>
                    {part.stock}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground max-w-[150px] truncate">{part.compatibilite || '-'}</TableCell>
                <TableCell>
                  <Badge variant={part.isActive ? "default" : "secondary"}>
                    {part.isActive ? "Actif" : "Inactif"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="ghost" size="icon" onClick={() => onView(part)} title="Voir les détails">
                    <Eye className="size-4 text-blue-600" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onManageImages(part)} title="Gérer les images">
                    <ImageIcon className="size-4 text-purple-600" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onEdit(part)} title="Modifier">
                    <Pencil className="size-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => onToggleActive(part)} 
                    title={part.isActive ? "Désactiver" : "Activer"}
                  >
                    <Power className={`size-4 ${part.isActive ? 'text-green-600' : 'text-gray-400'}`} />
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
