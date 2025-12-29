"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { Category, OrderStatus, UserRole, categoriesApi, orderStatusesApi, userRolesApi } from "@/lib/api"

export default function ConfigurationPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [orderStatuses, setOrderStatuses] = useState<OrderStatus[]>([])
  const [userRoles, setUserRoles] = useState<UserRole[]>([])
  const [loading, setLoading] = useState(true)
  
  const [categoryDialog, setCategoryDialog] = useState(false)
  const [statusDialog, setStatusDialog] = useState(false)
  const [roleDialog, setRoleDialog] = useState(false)
  
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | null>(null)
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null)
  
  const [categoryForm, setCategoryForm] = useState({ name: "", description: "" })
  const [statusForm, setStatusForm] = useState({ code: "", label: "", description: "" })
  const [roleForm, setRoleForm] = useState({ code: "", label: "", description: "" })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [cats, stats, roles] = await Promise.all([
        categoriesApi.getAll(),
        orderStatusesApi.getAll(),
        userRolesApi.getAll()
      ])
      setCategories(cats)
      setOrderStatuses(stats)
      setUserRoles(roles)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveCategory = async () => {
    try {
      if (selectedCategory) {
        await categoriesApi.update(selectedCategory.id, categoryForm)
      } else {
        await categoriesApi.create(categoryForm)
      }
      await loadData()
      setCategoryDialog(false)
      setCategoryForm({ name: "", description: "" })
      setSelectedCategory(null)
    } catch (error) {
      console.error('Error saving category:', error)
    }
  }

  const handleSaveStatus = async () => {
    try {
      if (selectedStatus) {
        await orderStatusesApi.update(selectedStatus.id, statusForm)
      } else {
        await orderStatusesApi.create(statusForm)
      }
      await loadData()
      setStatusDialog(false)
      setStatusForm({ code: "", label: "", description: "" })
      setSelectedStatus(null)
    } catch (error) {
      console.error('Error saving status:', error)
    }
  }

  const handleSaveRole = async () => {
    try {
      if (selectedRole) {
        await userRolesApi.update(selectedRole.id, roleForm)
      } else {
        await userRolesApi.create(roleForm)
      }
      await loadData()
      setRoleDialog(false)
      setRoleForm({ code: "", label: "", description: "" })
      setSelectedRole(null)
    } catch (error) {
      console.error('Error saving role:', error)
    }
  }

  const handleDeleteCategory = async (id: string) => {
    if (confirm('Confirmer la suppression ?')) {
      try {
        await categoriesApi.delete(id)
        await loadData()
      } catch (error) {
        console.error('Error deleting category:', error)
      }
    }
  }

  const handleDeleteStatus = async (id: string) => {
    if (confirm('Confirmer la suppression ?')) {
      try {
        await orderStatusesApi.delete(id)
        await loadData()
      } catch (error) {
        console.error('Error deleting status:', error)
      }
    }
  }

  const handleDeleteRole = async (id: string) => {
    if (confirm('Confirmer la suppression ?')) {
      try {
        await userRolesApi.delete(id)
        await loadData()
      } catch (error) {
        console.error('Error deleting role:', error)
      }
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary">Configuration</h1>
        <p className="text-muted-foreground">Gérez les catégories, statuts et rôles</p>
      </div>

      <Tabs defaultValue="categories" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="categories">Catégories</TabsTrigger>
          <TabsTrigger value="statuses">Statuts de commande</TabsTrigger>
          <TabsTrigger value="roles">Rôles utilisateur</TabsTrigger>
        </TabsList>

        <TabsContent value="categories">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Catégories de produits</CardTitle>
              <Button onClick={() => { setSelectedCategory(null); setCategoryForm({ name: "", description: "" }); setCategoryDialog(true) }}>
                <Plus className="size-4 mr-2" />
                Ajouter
              </Button>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nom</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categories.map((cat) => (
                      <TableRow key={cat.id}>
                        <TableCell className="font-medium">{cat.name}</TableCell>
                        <TableCell>{cat.description || '-'}</TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button variant="ghost" size="icon" onClick={() => { setSelectedCategory(cat); setCategoryForm({ name: cat.name, description: cat.description || "" }); setCategoryDialog(true) }}>
                            <Pencil className="size-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteCategory(cat.id)}>
                            <Trash2 className="size-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="statuses">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Statuts de commande</CardTitle>
              <Button onClick={() => { setSelectedStatus(null); setStatusForm({ code: "", label: "", description: "" }); setStatusDialog(true) }}>
                <Plus className="size-4 mr-2" />
                Ajouter
              </Button>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Code</TableHead>
                      <TableHead>Label</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orderStatuses.map((status) => (
                      <TableRow key={status.id}>
                        <TableCell className="font-medium">{status.code}</TableCell>
                        <TableCell>{status.label}</TableCell>
                        <TableCell>{status.description || '-'}</TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button variant="ghost" size="icon" onClick={() => { setSelectedStatus(status); setStatusForm({ code: status.code, label: status.label, description: status.description || "" }); setStatusDialog(true) }}>
                            <Pencil className="size-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteStatus(status.id)}>
                            <Trash2 className="size-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roles">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Rôles utilisateur</CardTitle>
              <Button onClick={() => { setSelectedRole(null); setRoleForm({ code: "", label: "", description: "" }); setRoleDialog(true) }}>
                <Plus className="size-4 mr-2" />
                Ajouter
              </Button>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Code</TableHead>
                      <TableHead>Label</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {userRoles.map((role) => (
                      <TableRow key={role.id}>
                        <TableCell className="font-medium">{role.code}</TableCell>
                        <TableCell>{role.label}</TableCell>
                        <TableCell>{role.description || '-'}</TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button variant="ghost" size="icon" onClick={() => { setSelectedRole(role); setRoleForm({ code: role.code, label: role.label, description: role.description || "" }); setRoleDialog(true) }}>
                            <Pencil className="size-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteRole(role.id)}>
                            <Trash2 className="size-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={categoryDialog} onOpenChange={setCategoryDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedCategory ? "Modifier" : "Ajouter"} une catégorie</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="cat-name">Nom</Label>
              <Input id="cat-name" value={categoryForm.name} onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="cat-desc">Description</Label>
              <Textarea id="cat-desc" value={categoryForm.description} onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCategoryDialog(false)}>Annuler</Button>
            <Button onClick={handleSaveCategory}>Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={statusDialog} onOpenChange={setStatusDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedStatus ? "Modifier" : "Ajouter"} un statut</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="status-code">Code</Label>
              <Input id="status-code" value={statusForm.code} onChange={(e) => setStatusForm({ ...statusForm, code: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="status-label">Label</Label>
              <Input id="status-label" value={statusForm.label} onChange={(e) => setStatusForm({ ...statusForm, label: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="status-desc">Description</Label>
              <Textarea id="status-desc" value={statusForm.description} onChange={(e) => setStatusForm({ ...statusForm, description: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setStatusDialog(false)}>Annuler</Button>
            <Button onClick={handleSaveStatus}>Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={roleDialog} onOpenChange={setRoleDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedRole ? "Modifier" : "Ajouter"} un rôle</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="role-code">Code</Label>
              <Input id="role-code" value={roleForm.code} onChange={(e) => setRoleForm({ ...roleForm, code: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="role-label">Label</Label>
              <Input id="role-label" value={roleForm.label} onChange={(e) => setRoleForm({ ...roleForm, label: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="role-desc">Description</Label>
              <Textarea id="role-desc" value={roleForm.description} onChange={(e) => setRoleForm({ ...roleForm, description: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRoleDialog(false)}>Annuler</Button>
            <Button onClick={handleSaveRole}>Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
