"use client"

import { useState } from "react"
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

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye } from "lucide-react"

interface RepairRequestTableProps {
  requests: RepairRequest[]
  onView: (request: RepairRequest) => void
  onSearchChange?: (search: string) => void
  onStatusChange?: (status: string) => void
  currentSearch?: string
  currentStatus?: string
}

const statuses = [
  { value: "all", label: "Tous les statuts" },
  { value: "pending", label: "En attente" },
  { value: "contacted", label: "Contacté" },
  { value: "in_progress", label: "En cours" },
  { value: "completed", label: "Terminé" },
  { value: "cancelled", label: "Annulé" },
]

export function RepairRequestTable({ requests, onView, onSearchChange, onStatusChange, currentSearch = "", currentStatus = "" }: RepairRequestTableProps) {
  const [searchInput, setSearchInput] = useState(currentSearch)
  const [selectedStatus, setSelectedStatus] = useState(currentStatus || "all")

  const handleSearch = () => {
    if (onSearchChange) {
      onSearchChange(searchInput)
    }
  }

  const handleStatusChange = (newStatus: string) => {
    const statusValue = newStatus === "all" ? "" : newStatus
    setSelectedStatus(newStatus)
    if (onStatusChange) {
      onStatusChange(statusValue)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-4 flex-wrap">
        <Input
          placeholder="Rechercher par nom, téléphone..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          className="max-w-md"
        />
        <Button onClick={handleSearch} variant="outline" size="sm">
          Rechercher
        </Button>
        <Select value={selectedStatus} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-52">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {statuses.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Client</TableHead>
            <TableHead>Téléphone</TableHead>
            <TableHead>Véhicule</TableHead>
            <TableHead>Problème</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-muted-foreground">Aucune demande trouvée</TableCell>
            </TableRow>
          ) : (
            requests.map((request) => (
              <TableRow key={request.id}>
                <TableCell className="font-medium">{request.customerName}</TableCell>
                <TableCell>{request.customerPhone}</TableCell>
                <TableCell>{request.vehicleType} {request.vehicleModel && `- ${request.vehicleModel}`}</TableCell>
                <TableCell className="max-w-[200px] truncate">{request.problemDescription}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(request.status)}>{getStatusLabel(request.status)}</Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{formatDate(request.createdAt)}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => onView(request)}>
                    <Eye className="size-4" />
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
