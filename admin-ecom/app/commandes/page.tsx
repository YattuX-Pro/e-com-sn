"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Order, ordersApi, PagedResult } from "@/lib/api"
import { OrderTable } from "@/components/orders/OrderTable"
import { OrderDialog } from "@/components/orders/OrderDialog"

export default function CommandesPage() {
  const [pagedData, setPagedData] = useState<PagedResult<Order> | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selected, setSelected] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState("")

  useEffect(() => {
    loadOrders()
  }, [page, search, status])

  const loadOrders = async () => {
    try {
      setLoading(true)
      const data = await ordersApi.getPaged({ 
        page, 
        pageSize: 5,
        search,
        status: status || undefined
      })
      setPagedData(data)
    } catch (error) {
      console.error('Error loading orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleView = (order: Order) => { setSelected(order); setDialogOpen(true) }

  const handleSearchChange = (newSearch: string) => {
    setSearch(newSearch)
    setPage(1)
  }

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus)
    setPage(1)
  }

  const handleUpdateStatus = async (orderId: string, status: Order["status"]) => {
    try {
      await ordersApi.updateStatus(orderId, status)
      await loadOrders()
      if (selected?.id === orderId) {
        setSelected({ ...selected, status })
      }
    } catch (error) {
      console.error('Error updating order status:', error)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary">Commandes</h1>
        <p className="text-muted-foreground">Suivez et gérez les commandes</p>
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
            <OrderTable 
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

      <OrderDialog open={dialogOpen} onOpenChange={setDialogOpen} order={selected} onUpdateStatus={handleUpdateStatus} />
    </div>
  )
}
