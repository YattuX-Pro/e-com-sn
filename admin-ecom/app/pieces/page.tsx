"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search } from "lucide-react"
import { SparePart, sparePartsApi } from "@/lib/api"
import { SparePartTable } from "@/components/spareparts/SparePartTable"
import { SparePartDialog } from "@/components/spareparts/SparePartDialog"
import { SparePartViewDialog } from "@/components/spareparts/SparePartViewDialog"
import { SparePartImageUploadDialog } from "@/components/spareparts/SparePartImageUploadDialog"

export default function PiecesPage() {
  const [parts, setParts] = useState<SparePart[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [imageDialogOpen, setImageDialogOpen] = useState(false)
  const [selected, setSelected] = useState<SparePart | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchInput, setSearchInput] = useState("")

  useEffect(() => {
    loadParts()
  }, [])

  const loadParts = async () => {
    try {
      setLoading(true)
      const data = await sparePartsApi.getAll()
      setParts(data)
    } catch (error) {
      console.error('Error loading spare parts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = () => { setSelected(null); setDialogOpen(true) }
  const handleView = (p: SparePart) => { setSelected(p); setViewDialogOpen(true) }
  const handleEdit = (p: SparePart) => { setSelected(p); setDialogOpen(true) }
  const handleToggleActive = async (p: SparePart) => {
    try {
      await sparePartsApi.update(p.id, { ...p, isActive: !p.isActive })
      await loadParts()
    } catch (error) {
      console.error('Error toggling spare part active status:', error)
    }
  }
  const handleManageImages = (p: SparePart) => { setSelected(p); setImageDialogOpen(true) }

  const handleSave = async (data: Partial<SparePart>) => {
    try {
      if (selected) {
        await sparePartsApi.update(selected.id, data as Omit<SparePart, 'id' | 'createdAt'>)
      } else {
        await sparePartsApi.create(data as Omit<SparePart, 'id' | 'createdAt'>)
      }
      await loadParts()
      setDialogOpen(false)
    } catch (error) {
      console.error('Error saving spare part:', error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">Pièces Détachées</h1>
          <p className="text-muted-foreground">Gérez votre catalogue de pièces détachées</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90" onClick={handleAdd}>
          <Plus className="size-4" />
          Ajouter
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Liste des pièces ({parts.length})</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex flex-col items-center gap-2">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                <p className="text-sm text-muted-foreground">Chargement des pièces...</p>
              </div>
            </div>
          ) : (
            <SparePartTable parts={parts} onView={handleView} onEdit={handleEdit} onToggleActive={handleToggleActive} onManageImages={handleManageImages} />
          )}
        </CardContent>
      </Card>

      <SparePartDialog open={dialogOpen} onOpenChange={setDialogOpen} part={selected} onSave={handleSave} />
      <SparePartViewDialog open={viewDialogOpen} onOpenChange={setViewDialogOpen} part={selected} />
      {selected && (
        <SparePartImageUploadDialog
          open={imageDialogOpen}
          onOpenChange={setImageDialogOpen}
          partId={selected.id}
          partName={selected.name}
          currentImage={selected.image}
          currentImages={selected.images}
          onUploadComplete={loadParts}
        />
      )}
    </div>
  )
}
