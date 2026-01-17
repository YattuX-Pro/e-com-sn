"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SparePartOrder, sparePartOrdersApi, PagedResult } from "@/lib/api"
import { SparePartOrderTable, SparePartOrderDialog } from "@/components/sparepartorders"
import { InternalNotesDialog } from "@/components/orders/InternalNotesDialog"

export default function CommandesPiecesPage() {
  const [pagedData, setPagedData] = useState<PagedResult<SparePartOrder> | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [notesDialogOpen, setNotesDialogOpen] = useState(false)
  const [selected, setSelected] = useState<SparePartOrder | null>(null)
  const [notesOrder, setNotesOrder] = useState<SparePartOrder | null>(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState("")

  useEffect(() => { loadOrders() }, [page, search, status])

  const loadOrders = async () => {
    try {
      setLoading(true)
      const data = await sparePartOrdersApi.getPaged({ page, pageSize: 10, search, status: status || undefined })
      setPagedData(data)
    } catch (error) {
      console.error('Error loading spare part orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleView = (order: SparePartOrder) => { setSelected(order); setDialogOpen(true) }
  const handleSearchChange = (newSearch: string) => { setSearch(newSearch); setPage(1) }
  const handleStatusChange = (newStatus: string) => { setStatus(newStatus); setPage(1) }

  const handleUpdateStatus = async (orderId: string, status: SparePartOrder["status"]) => {
    try {
      await sparePartOrdersApi.updateStatus(orderId, status)
      await loadOrders()
      if (selected?.id === orderId) setSelected({ ...selected, status })
    } catch (error) {
      console.error('Error updating order status:', error)
    }
  }

  const handleEditNotes = (order: SparePartOrder) => {
    setNotesOrder(order)
    setNotesDialogOpen(true)
  }

  const handleSaveNotes = async (orderId: string, notes: string) => {
    try {
      await sparePartOrdersApi.updateStatus(orderId, selected?.status || "pending", notes)
      await loadOrders()
      if (selected?.id === orderId) setSelected({ ...selected, internalNotes: notes })
    } catch (error) {
      console.error('Error saving notes:', error)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary">Commandes Pièces</h1>
        <p className="text-muted-foreground">Gérez les commandes de pièces détachées</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des commandes ({pagedData?.totalCount || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex flex-col items-center gap-2">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                <p className="text-sm text-muted-foreground">Chargement des commandes...</p>
              </div>
            </div>
          ) : (
            <SparePartOrderTable 
              orders={pagedData?.items || []} 
              onView={handleView}
              onSearchChange={handleSearchChange}
              onStatusChange={handleStatusChange}
              currentSearch={search}
              currentStatus={status}
            />
          )}
          {pagedData && pagedData.totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Page {pagedData.page} sur {pagedData.totalPages}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={!pagedData.hasPreviousPage}>Précédent</Button>
                <Button variant="outline" onClick={() => setPage(p => p + 1)} disabled={!pagedData.hasNextPage}>Suivant</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <SparePartOrderDialog open={dialogOpen} onOpenChange={setDialogOpen} order={selected} onUpdateStatus={handleUpdateStatus} onEditNotes={handleEditNotes} />
      
      <InternalNotesDialog 
        open={notesDialogOpen} 
        onOpenChange={setNotesDialogOpen} 
        orderId={notesOrder?.id || ""}
        orderNumber={notesOrder?.orderId || ""}
        currentNotes={notesOrder?.internalNotes}
        onSave={handleSaveNotes}
      />
    </div>
  )
}
