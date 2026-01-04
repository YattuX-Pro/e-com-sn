"use client"

import { Product } from "@/lib/api"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

interface ProductViewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product: Product | null
}

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('fr-SN', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price) + ' FCFA'
}

const displayValue = (value: string | number | undefined | null): string => {
  if (value === undefined || value === null || value === '') return '-'
  return String(value)
}

export function ProductViewDialog({ open, onOpenChange, product }: ProductViewDialogProps) {
  if (!product) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-5xl !w-[90vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-primary"></DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Informations générales */}
          <div className="bg-blue-50 dark:bg-slate-900 p-4 rounded-lg border border-blue-200 dark:border-slate-800">
            <h3 className="font-semibold text-lg mb-3 text-primary">Informations générales</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs text-muted-foreground">Nom du produit</Label>
                <p className="font-medium text-lg">{displayValue(product.name)}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Catégorie</Label>
                <p className="font-medium"><Badge variant="outline">{displayValue(product.category)}</Badge></p>
              </div>
            </div>
          </div>

          {/* Prix et Stock */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border">
              <Label className="text-xs text-muted-foreground">Prix</Label>
              <p className="font-bold text-2xl text-primary">{formatPrice(product.price)}</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border">
              <Label className="text-xs text-muted-foreground">Stock disponible</Label>
              <p className="font-bold text-2xl">
                <Badge variant={product.stock > 10 ? "default" : product.stock > 0 ? "secondary" : "destructive"}>
                  {product.stock} unités
                </Badge>
              </p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border">
              <Label className="text-xs text-muted-foreground">Statut</Label>
              <div className="flex gap-2 mt-2">
                {product.bestSeller && <Badge className="bg-yellow-500">★ Best-seller</Badge>}
                {product.isPromoted && <Badge className="bg-green-500">🏷️ Promotion</Badge>}
                {!product.bestSeller && !product.isPromoted && <span className="text-muted-foreground">-</span>}
              </div>
            </div>
          </div>

          <Separator />

          {/* Descriptions */}
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-semibold">Description courte</Label>
              <p className="text-sm text-muted-foreground mt-1">{displayValue(product.shortDescription)}</p>
            </div>
            <div>
              <Label className="text-sm font-semibold">Description complète</Label>
              <p className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap">{displayValue(product.description)}</p>
            </div>
          </div>

          <Separator />

          {/* Spécifications Techniques */}
          <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border">
            <h3 className="font-semibold text-lg mb-4 text-primary">Spécifications Techniques</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs text-muted-foreground">Marque</Label>
                <p className="font-medium">{displayValue(product.marque)}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Modèle</Label>
                <p className="font-medium">{displayValue(product.modele)}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Dimension</Label>
                <p className="font-medium">{displayValue(product.dimension)}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Genre</Label>
                <p className="font-medium">{displayValue(product.genre)}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Freinage</Label>
                <p className="font-medium">{displayValue(product.freinage)}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Système de démarrage</Label>
                <p className="font-medium">{displayValue(product.systemeD)}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Dimension caisse chargement</Label>
                <p className="font-medium">{displayValue(product.dimensionCaisseChargement)}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Boîte à vitesse</Label>
                <p className="font-medium">{displayValue(product.boiteVitesse)}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Capacité de charge</Label>
                <p className="font-medium">{displayValue(product.capaciteCharge)}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Type de carburant</Label>
                <p className="font-medium">{displayValue(product.typeCarburant)}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">État</Label>
                <p className="font-medium">{displayValue(product.etat)}</p>
              </div>
            </div>
            <div className="mt-4">
              <Label className="text-xs text-muted-foreground">Spécification technique</Label>
              <p className="font-medium mt-1 whitespace-pre-wrap">{displayValue(product.specificationTechnique)}</p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Fermer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
