"use client"

import { useState, useMemo, useEffect } from "react"
import { User, UserRole, userRolesApi } from "@/lib/api"

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Pencil, Trash2, Key, Power } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface UserTableProps {
  users: User[]
  onEdit: (user: User) => void
  onDelete: (user: User) => void
  onChangePassword?: (user: User) => void
  onToggleStatus?: (user: User) => void
  onSearchChange?: (search: string) => void
  onRoleChange?: (role: string) => void
}


export function UserTable({ users, onEdit, onDelete, onChangePassword, onToggleStatus, onSearchChange, onRoleChange }: UserTableProps) {
  const [searchInput, setSearchInput] = useState("")
  const [role, setRole] = useState("all")
  const [userRoles, setUserRoles] = useState<UserRole[]>([])

  useEffect(() => {
    userRolesApi.getAll().then(roles => setUserRoles(roles)).catch(console.error)
  }, [])

  const getRoleLabel = (roleCode: string): string => {
    const found = userRoles.find(r => r.code === roleCode)
    return found ? found.label : roleCode
  }

  const handleSearch = () => {
    if (onSearchChange) {
      onSearchChange(searchInput)
    }
  }

  const handleRoleChange = (newRole: string) => {
    setRole(newRole)
    if (onRoleChange) {
      onRoleChange(newRole === "all" ? "" : newRole)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <Input
          placeholder="Rechercher par nom ou email..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          className="max-w-sm"
        />
        <Button onClick={handleSearch} variant="outline" size="sm">
          Rechercher
        </Button>
        <Select value={role} onValueChange={handleRoleChange}>
          <SelectTrigger className="w-52">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les rôles</SelectItem>
            {userRoles.map(r => <SelectItem key={r.id} value={r.code}>{r.label}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Téléphone</TableHead>
            <TableHead>Rôle</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Créé le</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-muted-foreground">Aucun utilisateur trouvé</TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.phone}</TableCell>
                    <TableCell>
                      <Badge>
                        {getRoleLabel(user.role)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.status === "active" ? "default" : "secondary"}>
                        {user.status === "active" ? "Actif" : "Inactif"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{formatDate(user.createdAt)}</TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button variant="ghost" size="icon" onClick={() => onEdit(user)} title="Modifier">
                        <Pencil className="size-4" />
                      </Button>
                      {onChangePassword && (
                        <Button variant="ghost" size="icon" onClick={() => onChangePassword(user)} title="Changer le mot de passe">
                          <Key className="size-4 text-amber-500" />
                        </Button>
                      )}
                      {onToggleStatus && (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => onToggleStatus(user)} 
                          title={user.status === "active" ? "Désactiver" : "Activer"}
                        >
                          <Power className={`size-4 ${user.status === "active" ? "text-green-500" : "text-gray-400"}`} />
                        </Button>
                      )}
                      <Button variant="ghost" size="icon" onClick={() => onDelete(user)} title="Supprimer">
                        <Trash2 className="size-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
