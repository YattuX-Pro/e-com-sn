"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface InternalNotesDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  orderId: string
  orderNumber: string
  currentNotes: string | undefined
  onSave: (orderId: string, notes: string) => Promise<void>
}

export function InternalNotesDialog({ 
  open, 
  onOpenChange, 
  orderId, 
  orderNumber,
  currentNotes, 
  onSave 
}: InternalNotesDialogProps) {
  const [notes, setNotes] = useState(currentNotes || "")
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (open) {
      setNotes(currentNotes || "")
    }
  }, [open, currentNotes])

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await onSave(orderId, notes)
      onOpenChange(false)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-primary flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Notes internes
          </DialogTitle>
          <p className="text-sm text-muted-foreground">Commande {orderNumber}</p>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="notes" className="text-sm font-medium">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Ajoutez des notes internes sur cette commande..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="mt-2 min-h-[150px] resize-none"
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={isSaving}
          >
            {isSaving ? "Enregistrement..." : "Enregistrer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
