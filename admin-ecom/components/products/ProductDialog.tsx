"use client"

import { useState, useEffect } from "react"
import { Product, Category, categoriesApi } from "@/lib/api"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ProductDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product?: Product | null
  onSave: (product: Partial<Product>) => void
}

export function ProductDialog({ open, onOpenChange, product, onSave }: ProductDialogProps) {
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    categoriesApi.getAll().then(cats => setCategories(cats)).catch(console.error)
  }, [])

  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
    shortDescription: "",
    description: "",
    stock: "",
    bestSeller: false,
    isPromoted: false,
    isActive: true,
    image: "",
    images: [] as string[],
    marque: "",
    modele: "",
    dimension: "",
    genre: "",
    freinage: "",
    systemeD: "",
    dimensionCaisseChargement: "",
    boiteVitesse: "",
    specificationTechnique: "",
    capaciteCharge: "",
    typeCarburant: "",
    etat: "",
  })

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name,
        price: product.price.toString(),
        category: product.category,
        shortDescription: product.shortDescription,
        description: product.description,
        stock: product.stock.toString(),
        bestSeller: product.bestSeller,
        isPromoted: product.isPromoted,
        isActive: product.isActive ?? true,
        image: product.image,
        images: product.images,
        marque: product.marque || "",
        modele: product.modele || "",
        dimension: product.dimension || "",
        genre: product.genre || "",
        freinage: product.freinage || "",
        systemeD: product.systemeD || "",
        dimensionCaisseChargement: product.dimensionCaisseChargement || "",
        boiteVitesse: product.boiteVitesse || "",
        specificationTechnique: product.specificationTechnique || "",
        capaciteCharge: product.capaciteCharge || "",
        typeCarburant: product.typeCarburant || "",
        etat: product.etat || "",
      })
    } else {
      setForm({ 
        name: "", price: "", category: "", shortDescription: "", description: "", stock: "", 
        bestSeller: false, isPromoted: false, isActive: true, image: "/products/default.jpg", images: [],
        marque: "", modele: "", dimension: "", genre: "", freinage: "", systemeD: "",
        dimensionCaisseChargement: "", boiteVitesse: "", specificationTechnique: "",
        capaciteCharge: "", typeCarburant: "", etat: ""
      })
    }
  }, [product, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      ...product,
      name: form.name,
      price: Number(form.price),
      category: form.category,
      shortDescription: form.shortDescription,
      description: form.description,
      stock: Number(form.stock),
      bestSeller: form.bestSeller,
      isPromoted: form.isPromoted,
      isActive: form.isActive,
      image: form.image,
      images: form.images,
      marque: form.marque,
      modele: form.modele,
      dimension: form.dimension,
      genre: form.genre,
      freinage: form.freinage,
      systemeD: form.systemeD,
      dimensionCaisseChargement: form.dimensionCaisseChargement,
      boiteVitesse: form.boiteVitesse,
      specificationTechnique: form.specificationTechnique,
      capaciteCharge: form.capaciteCharge,
      typeCarburant: form.typeCarburant,
      etat: form.etat,
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-5xl !w-[90vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-primary">{product ? "Modifier le produit" : "Nouveau produit"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Nom</Label>
            <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
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
            <Label htmlFor="category">Catégorie</Label>
            <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
              <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="shortDesc">Description courte</Label>
            <Input id="shortDesc" value={form.shortDescription} onChange={(e) => setForm({ ...form, shortDescription: e.target.value })} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="desc">Description</Label>
            <Textarea id="desc" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} />
          </div>
          
          <div className="border-t pt-4">
            <h3 className="font-semibold mb-3 text-primary">Spécifications Techniques</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="marque">Marque</Label>
                <Input id="marque" value={form.marque} onChange={(e) => setForm({ ...form, marque: e.target.value })} placeholder="Ex: Haojue" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="modele">Modèle</Label>
                <Input id="modele" value={form.modele} onChange={(e) => setForm({ ...form, modele: e.target.value })} placeholder="Ex: HJ200ZH-C" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="dimension">Dimension</Label>
                <Input id="dimension" value={form.dimension} onChange={(e) => setForm({ ...form, dimension: e.target.value })} placeholder="Ex: 3.8m x 1.3m x 1.7m" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="genre">Genre</Label>
                <Input id="genre" value={form.genre} onChange={(e) => setForm({ ...form, genre: e.target.value })} placeholder="Ex: Cargo" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="freinage">Freinage</Label>
                <Input id="freinage" value={form.freinage} onChange={(e) => setForm({ ...form, freinage: e.target.value })} placeholder="Ex: Hydraulique" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="systemeD">Système de démarrage</Label>
                <Input id="systemeD" value={form.systemeD} onChange={(e) => setForm({ ...form, systemeD: e.target.value })} placeholder="Ex: Électrique + kick" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="dimensionCaisse">Dimension caisse chargement</Label>
                <Input id="dimensionCaisse" value={form.dimensionCaisseChargement} onChange={(e) => setForm({ ...form, dimensionCaisseChargement: e.target.value })} placeholder="Ex: 2.0m x 1.2m x 0.4m" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="boiteVitesse">Boîte à vitesse</Label>
                <Input id="boiteVitesse" value={form.boiteVitesse} onChange={(e) => setForm({ ...form, boiteVitesse: e.target.value })} placeholder="Ex: 5 vitesses" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="capaciteCharge">Capacité de charge</Label>
                <Input id="capaciteCharge" value={form.capaciteCharge} onChange={(e) => setForm({ ...form, capaciteCharge: e.target.value })} placeholder="Ex: 500 kg" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="typeCarburant">Type de carburant</Label>
                <Input id="typeCarburant" value={form.typeCarburant} onChange={(e) => setForm({ ...form, typeCarburant: e.target.value })} placeholder="Ex: Essence" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="etat">État</Label>
                <Input id="etat" value={form.etat} onChange={(e) => setForm({ ...form, etat: e.target.value })} placeholder="Ex: Neuf" />
              </div>
            </div>
            <div className="grid gap-2 mt-4">
              <Label htmlFor="specTech">Spécification technique</Label>
              <Textarea id="specTech" value={form.specificationTechnique} onChange={(e) => setForm({ ...form, specificationTechnique: e.target.value })} rows={2} placeholder="Ex: Moteur monocylindre 4 temps, 200cc, 12.5 CV" />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <input type="checkbox" id="bestSeller" checked={form.bestSeller} onChange={(e) => setForm({ ...form, bestSeller: e.target.checked })} />
              <Label htmlFor="bestSeller">Best-seller</Label>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="isPromoted" checked={form.isPromoted} onChange={(e) => setForm({ ...form, isPromoted: e.target.checked })} />
              <Label htmlFor="isPromoted">Produit en promotion</Label>
            </div>
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
