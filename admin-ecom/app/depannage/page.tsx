"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RepairRequest, repairRequestsApi } from "@/lib/api"
import { RepairRequestTable } from "@/components/repairrequests/RepairRequestTable"
import { RepairRequestDialog } from "@/components/repairrequests/RepairRequestDialog"

export default function DepannagePage() {
  const [requests, setRequests] = useState<RepairRequest[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selected, setSelected] = useState<RepairRequest | null>(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState("")

  useEffect(() => {
    loadRequests()
  }, [])

  const loadRequests = async () => {
    try {
      setLoading(true)
      const data = await repairRequestsApi.getAll()
      setRequests(data)
    } catch (error) {
      console.error('Error loading repair requests:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleView = (request: RepairRequest) => { setSelected(request); setDialogOpen(true) }

  const handleSearchChange = (newSearch: string) => {
    setSearch(newSearch)
  }

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus)
  }

  const handleUpdateStatus = async (requestId: string, status: string, notes?: string) => {
    try {
      await repairRequestsApi.updateStatus(requestId, status, notes)
      await loadRequests()
      if (selected?.id === requestId) {
        setSelected({ ...selected, status, notes: notes || null })
      }
    } catch (error) {
      console.error('Error updating repair request status:', error)
    }
  }

  const filteredRequests = requests.filter(r => {
    const matchSearch = !search || r.customerName.toLowerCase().includes(search.toLowerCase()) || r.customerPhone.includes(search)
    const matchStatus = !status || r.status === status
    return matchSearch && matchStatus
  })

  const pendingCount = requests.filter(r => r.status === 'pending').length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">Demandes de Dépannage</h1>
          <p className="text-muted-foreground">Suivez et gérez les demandes de dépannage</p>
        </div>
        {pendingCount > 0 && (
          <div className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 px-4 py-2 rounded-lg font-medium">
            {pendingCount} en attente
          </div>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des demandes ({requests.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex flex-col items-center gap-2">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                <p className="text-sm text-muted-foreground">Chargement des demandes...</p>
              </div>
            </div>
          ) : (
            <RepairRequestTable 
              requests={filteredRequests} 
              onView={handleView}
              onSearchChange={handleSearchChange}
              onStatusChange={handleStatusChange}
              currentSearch={search}
              currentStatus={status}
            />
          )}
        </CardContent>
      </Card>

      <RepairRequestDialog open={dialogOpen} onOpenChange={setDialogOpen} request={selected} onUpdateStatus={handleUpdateStatus} />
    </div>
  )
}
