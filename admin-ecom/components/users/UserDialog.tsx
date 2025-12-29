"use client"

import { useState, useEffect } from "react"
import { User } from "@/lib/api"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface UserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user?: User | null
  onSave: (user: Partial<User>) => void
}

export function UserDialog({ open, onOpenChange, user, onSave }: UserDialogProps) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    role: "viewer" as User["role"],
    status: "active" as User["status"],
  })

  useEffect(() => {
    if (user) {
      setForm({ name: user.name, email: user.email, phone: user.phone, role: user.role, status: user.status })
    } else {
      setForm({ name: "", email: "", phone: "", role: "viewer", status: "active" })
    }
  }, [user, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({ ...user, ...form })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-primary">{user ? "Modifier l'utilisateur" : "Nouvel utilisateur"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Nom</Label>
            <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="phone">Téléphone</Label>
            <Input id="phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Rôle</Label>
              <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: v as User["role"] })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="viewer">Lecteur</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Statut</Label>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as User["status"] })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Actif</SelectItem>
                  <SelectItem value="inactive">Inactif</SelectItem>
                </SelectContent>
              </Select>
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
