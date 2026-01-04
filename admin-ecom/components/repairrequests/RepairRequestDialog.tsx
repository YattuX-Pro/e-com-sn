"use client"

import { RepairRequest } from "@/lib/api"

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    contacted: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    in_progress: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
    completed: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    cancelled: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  }
  return colors[status] || "bg-gray-100 text-gray-800"
}

const getStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    pending: "En attente",
    contacted: "Contacté",
    in_progress: "En cours",
    completed: "Terminé",
    cancelled: "Annulé",
  }
  return labels[status] || status
}

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useState, useEffect } from "react"

interface RepairRequestDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  request: RepairRequest | null
  onUpdateStatus: (requestId: string, status: string, notes?: string) => void
}

const statuses = ["pending", "contacted", "in_progress", "completed", "cancelled"]

export function RepairRequestDialog({ open, onOpenChange, request, onUpdateStatus }: RepairRequestDialogProps) {
  const [notes, setNotes] = useState("")

  useEffect(() => {
    if (request) {
      setNotes(request.notes || "")
    }
  }, [request])

  if (!request) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-4xl !w-[95vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-primary flex items-center gap-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Détails de la demande de dépannage
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/30 dark:to-slate-900 p-6 rounded-xl border-2 border-orange-200 dark:border-orange-900/50 shadow-sm">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-xs font-medium text-orange-600 dark:text-orange-400 mb-2 uppercase tracking-wide">Date de la demande</p>
                <p className="font-semibold text-lg">{formatDate(request.createdAt)}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-orange-600 dark:text-orange-400 mb-2 uppercase tracking-wide">Statut actuel</p>
                <Badge className={`${getStatusColor(request.status)} text-base px-3 py-1`}>{getStatusLabel(request.status)}</Badge>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
              <h4 className="font-bold text-lg text-primary flex items-center gap-2 mb-4 pb-3 border-b border-slate-200 dark:border-slate-800">
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                Informations client
              </h4>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <span className="text-xs text-muted-foreground min-w-[80px] pt-0.5">Nom</span>
                  <span className="font-semibold flex-1">{request.customerName}</span>
                </div>
                <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <span className="text-xs text-muted-foreground min-w-[80px] pt-0.5">Téléphone</span>
                  <a href={`tel:${request.customerPhone}`} className="font-semibold flex-1 text-blue-600 hover:underline">{request.customerPhone}</a>
                </div>
                {request.customerEmail && (
                  <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <span className="text-xs text-muted-foreground min-w-[80px] pt-0.5">Email</span>
                    <span className="font-semibold flex-1">{request.customerEmail}</span>
                  </div>
                )}
                {request.customerAddress && (
                  <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <span className="text-xs text-muted-foreground min-w-[80px] pt-0.5">Adresse</span>
                    <span className="font-semibold flex-1">{request.customerAddress}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
              <h4 className="font-bold text-lg text-primary flex items-center gap-2 mb-4 pb-3 border-b border-slate-200 dark:border-slate-800">
                <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                Informations véhicule
              </h4>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <span className="text-xs text-muted-foreground min-w-[80px] pt-0.5">Type</span>
                  <span className="font-semibold flex-1">{request.vehicleType}</span>
                </div>
                {request.vehicleModel && (
                  <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <span className="text-xs text-muted-foreground min-w-[80px] pt-0.5">Modèle</span>
                    <span className="font-semibold flex-1">{request.vehicleModel}</span>
                  </div>
                )}
                <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 p-4 rounded-lg border border-red-200 dark:border-red-900/30 mt-2">
                  <span className="text-xs text-muted-foreground block mb-2 font-medium">Description du problème</span>
                  <p className="text-sm">{request.problemDescription}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6 rounded-xl border-2 border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <Label className="text-lg font-bold">Gestion du statut</Label>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                <p className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wide">Modifier le statut</p>
                <Select value={request.status} onValueChange={(v) => onUpdateStatus(request.id, v, notes)}>
                  <SelectTrigger className="w-full h-11 font-semibold"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {statuses.map((s) => (
                      <SelectItem key={s} value={s}>{getStatusLabel(s)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                <p className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wide">Notes internes</p>
                <Textarea 
                  value={notes} 
                  onChange={(e) => setNotes(e.target.value)} 
                  placeholder="Ajouter des notes..."
                  rows={2}
                />
                <Button 
                  size="sm" 
                  className="mt-2" 
                  onClick={() => onUpdateStatus(request.id, request.status, notes)}
                >
                  Sauvegarder notes
                </Button>
              </div>
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
