"use client"

import { SparePartOrder } from "@/lib/api"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('fr-SN', { style: 'decimal', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(price) + ' FCFA'
}

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

const getStatusColor = (status: SparePartOrder["status"]): string => {
  const colors = {
    pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    confirmed: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    shipped: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
    delivered: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    cancelled: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  }
  return colors[status]
}

const getStatusLabel = (status: SparePartOrder["status"]): string => {
  const labels = { pending: "En attente", confirmed: "Confirmée", shipped: "Livré", delivered: "Terminé", cancelled: "Annulée" }
  return labels[status]
}

interface SparePartOrderDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  order: SparePartOrder | null
  onUpdateStatus: (orderId: string, status: SparePartOrder["status"]) => void
  onEditNotes: (order: SparePartOrder) => void
}

const statuses: SparePartOrder["status"][] = ["pending", "confirmed", "shipped", "delivered", "cancelled"]

export function SparePartOrderDialog({ open, onOpenChange, order, onUpdateStatus, onEditNotes }: SparePartOrderDialogProps) {
  if (!order) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-4xl !w-[95vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-primary flex items-center gap-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Détails commande pièce
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/30 dark:to-slate-900 p-6 rounded-xl border-2 border-orange-200 dark:border-orange-900/50 shadow-sm">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-xs font-medium text-orange-600 dark:text-orange-400 mb-2 uppercase tracking-wide">N° Commande</p>
                <p className="font-mono font-bold text-2xl text-primary">{order.orderId}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-orange-600 dark:text-orange-400 mb-2 uppercase tracking-wide">Date de commande</p>
                <p className="font-semibold text-lg">{formatDate(order.createdAt)}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <h4 className="font-bold text-lg text-primary flex items-center gap-2 mb-4 pb-3 border-b border-slate-200 dark:border-slate-800">
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                Informations client
              </h4>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <span className="text-xs text-muted-foreground min-w-[80px] pt-0.5">Nom</span>
                  <span className="font-semibold flex-1">{order.customerName}</span>
                </div>
                <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <span className="text-xs text-muted-foreground min-w-[80px] pt-0.5">Téléphone</span>
                  <span className="font-semibold flex-1">{order.customerPhone}</span>
                </div>
                <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <span className="text-xs text-muted-foreground min-w-[80px] pt-0.5">Email</span>
                  <span className="font-semibold flex-1">{order.customerEmail || "-"}</span>
                </div>
                <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <span className="text-xs text-muted-foreground min-w-[80px] pt-0.5">Adresse</span>
                  <span className="font-semibold flex-1">{order.customerAddress || "-"}</span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <h4 className="font-bold text-lg text-primary flex items-center gap-2 mb-4 pb-3 border-b border-slate-200 dark:border-slate-800">
                <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                  <svg className="w-5 h-5 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                Pièce commandée
              </h4>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <span className="text-xs text-muted-foreground min-w-[80px] pt-0.5">Pièce</span>
                  <span className="font-semibold flex-1">{order.sparePartName}</span>
                </div>
                <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <span className="text-xs text-muted-foreground min-w-[80px] pt-0.5">Référence</span>
                  <span className="font-mono text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">{order.sparePartReference}</span>
                </div>
                <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <span className="text-xs text-muted-foreground min-w-[80px] pt-0.5">Quantité</span>
                  <span className="font-semibold flex-1">{order.quantity} unité(s)</span>
                </div>
                {order.comment && (
                  <div className="flex items-start gap-3 p-2 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                    <span className="text-xs text-muted-foreground min-w-[80px] pt-0.5">Commentaire</span>
                    <span className="font-medium flex-1 text-amber-800 dark:text-amber-200">{order.comment}</span>
                  </div>
                )}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 p-4 rounded-lg border border-green-200 dark:border-green-900/30 mt-2">
                  <span className="text-xs text-muted-foreground block mb-1">Montant total</span>
                  <span className="font-bold text-3xl text-green-600 dark:text-green-400">{formatPrice(order.totalPrice)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6 rounded-xl border-2 border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                <svg className="w-5 h-5 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <Label className="text-lg font-bold">Gestion du statut</Label>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                <p className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wide">Statut actuel</p>
                <Badge className={`${getStatusColor(order.status)} text-base px-4 py-2 font-semibold`}>{getStatusLabel(order.status)}</Badge>
              </div>
              <div className="bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                <p className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wide">Modifier le statut</p>
                <Select value={order.status} onValueChange={(v) => onUpdateStatus(order.id, v as SparePartOrder["status"])}>
                  <SelectTrigger className="w-full h-11 font-semibold"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {statuses.map((s) => (<SelectItem key={s} value={s}>{getStatusLabel(s)}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  <svg className="w-4 h-4 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <Label className="font-semibold">Notes internes</Label>
              </div>
              <Button variant="outline" size="sm" onClick={() => onEditNotes(order)}>
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                Modifier
              </Button>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg min-h-[60px]">
              {order.internalNotes ? (
                <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{order.internalNotes}</p>
              ) : (
                <p className="text-sm text-muted-foreground italic">Aucune note interne</p>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1 h-11">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Fermer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
