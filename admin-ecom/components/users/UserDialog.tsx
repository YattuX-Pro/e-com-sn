"use client"

import { useState, useEffect } from "react"
import { User, CreateUserData } from "@/lib/api"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye, EyeOff } from "lucide-react"

interface UserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user?: User | null
  onSave: (data: CreateUserData | Omit<User, 'id' | 'createdAt'>, isNew: boolean) => void
}

export function UserDialog({ open, onOpenChange, user, onSave }: UserDialogProps) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "admin",
    status: "active",
  })
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    if (user) {
      setForm({ name: user.name, email: user.email, phone: user.phone, password: "", role: user.role, status: user.status })
    } else {
      setForm({ name: "", email: "", phone: "", password: "", role: "admin", status: "active" })
    }
    setShowPassword(false)
  }, [user, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!user && !form.password) {
      alert("Le mot de passe est requis pour un nouvel utilisateur")
      return
    }
    if (user) {
      onSave({ name: form.name, email: form.email, phone: form.phone, role: form.role, status: form.status }, false)
    } else {
      onSave({ name: form.name, email: form.email, phone: form.phone, password: form.password, role: form.role, status: form.status }, true)
    }
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
          {!user && (
            <div className="grid gap-2">
              <Label htmlFor="password">Mot de passe</Label>
              <div className="relative">
                <Input 
                  id="password" 
                  type={showPassword ? "text" : "password"} 
                  value={form.password} 
                  onChange={(e) => setForm({ ...form, password: e.target.value })} 
                  required 
                  minLength={6}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </Button>
              </div>
            </div>
          )}
          <div className="grid gap-2">
            <Label>Statut</Label>
            <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Actif</SelectItem>
                <SelectItem value="inactive">Inactif</SelectItem>
              </SelectContent>
            </Select>
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
