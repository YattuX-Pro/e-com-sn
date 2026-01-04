"use client"

import { SparePart } from "@/lib/api"

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('fr-SN', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price) + ' FCFA'
}

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface SparePartViewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  part: SparePart | null
}

export function SparePartViewDialog({ open, onOpenChange, part }: SparePartViewDialogProps) {
  if (!part) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-3xl !w-[90vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-primary flex items-center gap-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Détails de la pièce
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-slate-900 p-6 rounded-xl border-2 border-blue-200 dark:border-blue-900/50 shadow-sm">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-xs font-medium text-blue-600 dark:text-blue-400 mb-2 uppercase tracking-wide">Nom</p>
                <p className="font-bold text-2xl text-primary">{part.name}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-blue-600 dark:text-blue-400 mb-2 uppercase tracking-wide">Référence</p>
                <p className="font-mono font-semibold text-lg">{part.reference}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <h4 className="font-bold text-lg text-primary flex items-center gap-2 mb-4 pb-3 border-b border-slate-200 dark:border-slate-800">
                Informations générales
              </h4>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <span className="text-xs text-muted-foreground min-w-[100px] pt-0.5">Catégorie</span>
                  <Badge variant="outline">{part.category}</Badge>
                </div>
                <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <span className="text-xs text-muted-foreground min-w-[100px] pt-0.5">Prix</span>
                  <span className="font-bold text-lg text-green-600">{formatPrice(part.price)}</span>
                </div>
                <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <span className="text-xs text-muted-foreground min-w-[100px] pt-0.5">Stock</span>
                  <Badge variant={part.stock > 10 ? "default" : part.stock > 0 ? "secondary" : "destructive"}>
                    {part.stock} unité(s)
                  </Badge>
                </div>
                <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <span className="text-xs text-muted-foreground min-w-[100px] pt-0.5">Statut</span>
                  <Badge variant={part.isActive ? "default" : "secondary"}>
                    {part.isActive ? "Actif" : "Inactif"}
                  </Badge>
                </div>
                <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <span className="text-xs text-muted-foreground min-w-[100px] pt-0.5">Créé le</span>
                  <span className="font-semibold">{formatDate(part.createdAt)}</span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <h4 className="font-bold text-lg text-primary flex items-center gap-2 mb-4 pb-3 border-b border-slate-200 dark:border-slate-800">
                Compatibilité & Description
              </h4>
              <div className="space-y-4">
                {part.compatibilite && (
                  <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
                    <span className="text-xs text-muted-foreground block mb-1">Compatible avec</span>
                    <span className="font-medium">{part.compatibilite}</span>
                  </div>
                )}
                {part.description && (
                  <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
                    <span className="text-xs text-muted-foreground block mb-1">Description</span>
                    <p className="text-sm">{part.description}</p>
                  </div>
                )}
              </div>
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
