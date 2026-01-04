"use client"

import { useState, useEffect } from "react"
import { SparePart, SparePartCategory, sparePartCategoriesApi } from "@/lib/api"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface SparePartDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  part?: SparePart | null
  onSave: (part: Partial<SparePart>) => void
}

export function SparePartDialog({ open, onOpenChange, part, onSave }: SparePartDialogProps) {
  const [categories, setCategories] = useState<SparePartCategory[]>([])
  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
    stock: "",
    reference: "",
    compatibilite: "",
    isActive: true,
    image: "",
    images: [] as string[],
  })

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const cats = await sparePartCategoriesApi.getAll()
        setCategories(cats)
      } catch (error) {
        console.error("Error loading categories:", error)
      }
    }
    loadCategories()
  }, [])

  useEffect(() => {
    if (part) {
      setForm({
        name: part.name,
        price: part.price.toString(),
        category: part.category,
        description: part.description,
        stock: part.stock.toString(),
        reference: part.reference,
        compatibilite: part.compatibilite,
        isActive: part.isActive ?? true,
        image: part.image,
        images: part.images,
      })
    } else {
      setForm({ 
        name: "", price: "", category: "", description: "", stock: "", 
        reference: "", compatibilite: "", isActive: true, image: "/products/default.jpg", images: []
      })
    }
  }, [part, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      ...part,
      name: form.name,
      price: Number(form.price),
      category: form.category,
      description: form.description,
      stock: Number(form.stock),
      reference: form.reference,
      compatibilite: form.compatibilite,
      isActive: form.isActive,
      image: form.image,
      images: form.images,
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-3xl !w-[90vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-primary">{part ? "Modifier la pièce" : "Nouvelle pièce"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Nom</Label>
            <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="reference">Référence</Label>
              <Input id="reference" value={form.reference} onChange={(e) => setForm({ ...form, reference: e.target.value })} required placeholder="Ex: REF-001" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category">Catégorie</Label>
              <Select value={form.category} onValueChange={(value) => setForm({ ...form, category: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="price">Prix (FCFA)</Label>
              <Input id="price" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="stock">Stock</Label>
              <Input id="stock" type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} required />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="compatibilite">Compatibilité</Label>
            <Input id="compatibilite" value={form.compatibilite} onChange={(e) => setForm({ ...form, compatibilite: e.target.value })} placeholder="Ex: Tous modèles Hasilaza, Tricycle 200cc" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="desc">Description</Label>
            <Textarea id="desc" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="isActive" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
            <Label htmlFor="isActive">Pièce active (visible sur le site)</Label>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
            <Button type="submit" className="bg-primary">Enregistrer</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
