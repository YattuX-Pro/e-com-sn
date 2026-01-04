"use client"

import { useState, useEffect } from "react"
import { SparePartOrder } from "@/lib/api"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye } from "lucide-react"

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
  const labels = { pending: "En attente", confirmed: "Confirmée", shipped: "Expédiée", delivered: "Livrée", cancelled: "Annulée" }
  return labels[status]
}

const localStatuses = [
  { value: "all", label: "Tous les statuts" },
  { value: "pending", label: "En attente" },
  { value: "confirmed", label: "Confirmée" },
  { value: "shipped", label: "Expédiée" },
  { value: "delivered", label: "Livrée" },
  { value: "cancelled", label: "Annulée" },
]

interface SparePartOrderTableProps {
  orders: SparePartOrder[]
  onView: (order: SparePartOrder) => void
  onSearchChange?: (search: string) => void
  onStatusChange?: (status: string) => void
  currentSearch?: string
  currentStatus?: string
}

export function SparePartOrderTable({ orders, onView, onSearchChange, onStatusChange, currentSearch = "", currentStatus = "" }: SparePartOrderTableProps) {
  const [searchInput, setSearchInput] = useState(currentSearch)
  const [selectedStatus, setSelectedStatus] = useState(currentStatus || "all")

  useEffect(() => { setSearchInput(currentSearch) }, [currentSearch])
  useEffect(() => { setSelectedStatus(currentStatus || "all") }, [currentStatus])

  const handleSearch = () => { if (onSearchChange) onSearchChange(searchInput) }
  const handleStatusChange = (newStatus: string) => {
    const statusValue = newStatus === "all" ? "" : newStatus
    setSelectedStatus(newStatus)
    if (onStatusChange) onStatusChange(statusValue)
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-4 flex-wrap">
        <Input placeholder="Rechercher par N° commande, client, pièce..." value={searchInput} onChange={(e) => setSearchInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSearch()} className="max-w-md" />
        <Button onClick={handleSearch} variant="outline" size="sm">Rechercher</Button>
        <Select value={selectedStatus} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-52"><SelectValue /></SelectTrigger>
          <SelectContent>
            {localStatuses.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>N° Commande</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Pièce</TableHead>
            <TableHead>Réf</TableHead>
            <TableHead>Qté</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.length === 0 ? (
            <TableRow><TableCell colSpan={9} className="text-center text-muted-foreground">Aucune commande trouvée</TableCell></TableRow>
          ) : (
            orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.orderId}</TableCell>
                <TableCell>{order.customerName}</TableCell>
                <TableCell>{order.sparePartName}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{order.sparePartReference}</TableCell>
                <TableCell>{order.quantity}</TableCell>
                <TableCell>{formatPrice(order.totalPrice)}</TableCell>
                <TableCell><Badge className={getStatusColor(order.status)}>{getStatusLabel(order.status)}</Badge></TableCell>
                <TableCell className="text-sm text-muted-foreground">{formatDate(order.createdAt)}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => onView(order)}><Eye className="size-4" /></Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
