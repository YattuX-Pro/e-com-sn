"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { User, usersApi, PagedResult, CreateUserData } from "@/lib/api"
import { UserTable } from "@/components/users/UserTable"
import { UserDialog } from "@/components/users/UserDialog"
import { DeleteDialog } from "@/components/products/DeleteDialog"
import { PasswordDialog } from "@/components/users/PasswordDialog"

export default function UtilisateursPage() {
  const [pagedData, setPagedData] = useState<PagedResult<User> | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [passwordOpen, setPasswordOpen] = useState(false)
  const [selected, setSelected] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [role, setRole] = useState("")

  useEffect(() => {
    loadUsers()
  }, [page, search, role])

  const loadUsers = async () => {
    try {
      setLoading(true)
      const data = await usersApi.getPaged({ 
        page, 
        pageSize: 5,
        search,
        role: role || undefined
      })
      setPagedData(data)
    } catch (error) {
      console.error('Error loading users:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = () => { setSelected(null); setDialogOpen(true) }
  const handleEdit = (u: User) => { setSelected(u); setDialogOpen(true) }
  const handleDelete = (u: User) => { setSelected(u); setDeleteOpen(true) }
  const handleChangePassword = (u: User) => { setSelected(u); setPasswordOpen(true) }

  const handleToggleStatus = async (u: User) => {
    try {
      await usersApi.toggleStatus(u.id)
      await loadUsers()
    } catch (error) {
      console.error('Error toggling user status:', error)
    }
  }

  const handleSave = async (data: CreateUserData | Omit<User, 'id' | 'createdAt'>, isNew: boolean) => {
    try {
      if (isNew) {
        await usersApi.create(data as CreateUserData)
      } else if (selected) {
        await usersApi.update(selected.id, data as Omit<User, 'id' | 'createdAt'>)
      }
      await loadUsers()
      setDialogOpen(false)
    } catch (error) {
      console.error('Error saving user:', error)
    }
  }

  const handlePasswordChange = async (newPassword: string) => {
    if (!selected) return
    try {
      await usersApi.changePassword(selected.id, newPassword)
      setPasswordOpen(false)
    } catch (error) {
      console.error('Error changing password:', error)
    }
  }

  const confirmDelete = async () => {
    if (!selected) return
    try {
      await usersApi.delete(selected.id)
      await loadUsers()
      setDeleteOpen(false)
    } catch (error) {
      console.error('Error deleting user:', error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">Utilisateurs</h1>
          <p className="text-muted-foreground">Gérez les utilisateurs de la plateforme</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90" onClick={handleAdd}>
          <Plus className="size-4" />
          Ajouter
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des utilisateurs ({pagedData?.totalCount || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex flex-col items-center gap-2">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                <p className="text-sm text-muted-foreground">Chargement des utilisateurs...</p>
              </div>
            </div>
          ) : (
            <UserTable 
              users={pagedData?.items || []} 
              onEdit={handleEdit} 
              onDelete={handleDelete}
              onChangePassword={handleChangePassword}
              onToggleStatus={handleToggleStatus}
              onSearchChange={setSearch}
              onRoleChange={setRole}
            />
          )}
          {pagedData && pagedData.totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Page {pagedData.page} sur {pagedData.totalPages}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={!pagedData.hasPreviousPage}
                >
                  Précédent
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setPage(p => p + 1)}
                  disabled={!pagedData.hasNextPage}
                >
                  Suivant
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <UserDialog open={dialogOpen} onOpenChange={setDialogOpen} user={selected} onSave={handleSave} />
      <PasswordDialog 
        open={passwordOpen} 
        onOpenChange={setPasswordOpen} 
        userName={selected?.name}
        onSave={handlePasswordChange} 
      />
      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Supprimer l'utilisateur"
        description={`Voulez-vous vraiment supprimer "${selected?.name}" ?`}
        onConfirm={confirmDelete}
      />
    </div>
  )
}
