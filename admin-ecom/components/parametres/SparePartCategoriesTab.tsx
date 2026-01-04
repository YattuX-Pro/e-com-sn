"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { SparePartCategory, sparePartCategoriesApi } from "@/lib/api"

interface SparePartCategoriesTabProps {
  categories: SparePartCategory[]
  onRefresh: () => Promise<void>
}

export function SparePartCategoriesTab({ categories, onRefresh }: SparePartCategoriesTabProps) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<SparePartCategory | null>(null)
  const [form, setForm] = useState({ name: "", description: "" })

  const openDialog = (cat?: SparePartCategory) => {
    if (cat) {
      setEditing(cat)
      setForm({ name: cat.name, description: cat.description || "" })
    } else {
      setEditing(null)
      setForm({ name: "", description: "" })
    }
    setDialogOpen(true)
  }

  const save = async () => {
    try {
      if (editing) {
        await sparePartCategoriesApi.update(editing.id, form)
      } else {
        await sparePartCategoriesApi.create(form)
      }
      await onRefresh()
      setDialogOpen(false)
    } catch (error) {
      console.error("Error saving spare part category:", error)
    }
  }

  const remove = async (id: string) => {
    if (!confirm("Supprimer cette catégorie de pièces ?")) return
    try {
      await sparePartCategoriesApi.delete(id)
      await onRefresh()
    } catch (error) {
      console.error("Error deleting spare part category:", error)
    }
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Catégories de Pièces Détachées ({categories.length})</CardTitle>
          <Button onClick={() => openDialog()} size="sm">
            <Plus className="size-4 mr-1" /> Ajouter
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((cat) => (
                <TableRow key={cat.id}>
                  <TableCell className="font-medium">{cat.name}</TableCell>
                  <TableCell className="text-muted-foreground">{cat.description || "-"}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openDialog(cat)}>
                        <Pencil className="size-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => remove(cat.id)}>
                        <Trash2 className="size-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {categories.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                    Aucune catégorie de pièces
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Modifier la catégorie" : "Nouvelle catégorie de pièces"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="sp-cat-name">Nom</Label>
              <Input id="sp-cat-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="sp-cat-desc">Description</Label>
              <Input id="sp-cat-desc" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Annuler</Button>
            <Button onClick={save}>Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
