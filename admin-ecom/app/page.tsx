"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Package, ShoppingCart, Users, Cog, Wrench, PackageSearch } from "lucide-react"
import { dashboardApi, DashboardStats, RecentOrder, RecentSparePartOrder } from "@/lib/api"

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  confirmed: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  shipped: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  delivered: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  cancelled: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
}

const statusLabels: Record<string, string> = {
  pending: "En attente",
  confirmed: "Confirmée",
  shipped: "Expédiée",
  delivered: "Livrée",
  cancelled: "Annulée",
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([])
  const [recentSparePartOrders, setRecentSparePartOrders] = useState<RecentSparePartOrder[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [statsData, orders, spOrders] = await Promise.all([
          dashboardApi.getStats(),
          dashboardApi.getRecentOrders(5),
          dashboardApi.getRecentSparePartOrders(5),
        ])
        setStats(statsData)
        setRecentOrders(orders)
        setRecentSparePartOrders(spOrders)
      } catch (error) {
        console.error("Error loading dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  const statCards = [
    { label: "Produits", value: stats?.productsCount ?? 0, icon: Package, bg: "bg-blue-50 dark:bg-blue-950", iconColor: "text-blue-600", borderColor: "border-blue-500" },
    { label: "Pièces", value: stats?.sparePartsCount ?? 0, icon: Cog, bg: "bg-slate-50 dark:bg-slate-900", iconColor: "text-slate-600", borderColor: "border-slate-500" },
    { label: "Commandes", value: stats?.ordersCount ?? 0, icon: ShoppingCart, bg: "bg-green-50 dark:bg-green-950", iconColor: "text-green-600", borderColor: "border-green-500" },
    { label: "Cmd. Pièces", value: stats?.sparePartOrdersCount ?? 0, icon: PackageSearch, bg: "bg-purple-50 dark:bg-purple-950", iconColor: "text-purple-600", borderColor: "border-purple-500" },
    { label: "Dépannages", value: stats?.repairRequestsCount ?? 0, icon: Wrench, bg: "bg-orange-50 dark:bg-orange-950", iconColor: "text-orange-600", borderColor: "border-orange-500" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary">Dashboard</h1>
        <p className="text-muted-foreground">Vue d&apos;ensemble</p>
      </div>

      <div className="grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        {statCards.map(({ label, value, icon: Icon, bg, iconColor, borderColor }) => (
          <Card key={label} className={`${bg} border-l-4 ${borderColor}`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground font-medium">{label}</p>
                  <p className="text-2xl font-bold mt-1">{value}</p>
                </div>
                <div className={`p-2 rounded-full ${bg}`}>
                  <Icon className={`size-5 ${iconColor}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <ShoppingCart className="size-5 text-green-600" />
              Commandes de tricycles récentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentOrders.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">Aucune commande récente.</p>
            ) : (
              <div className="space-y-3">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                    <div className="space-y-1">
                      <p className="font-medium text-sm">{order.customerName}</p>
                      <p className="text-xs text-muted-foreground">{order.orderId}</p>
                    </div>
                    <div className="text-right space-y-1">
                      <p className="font-semibold text-sm">
                        {order.totalAmount ? new Intl.NumberFormat('fr-FR').format(order.totalAmount) : '0'} FCFA
                      </p>
                      <Badge className={`text-xs ${statusColors[order.status] || 'bg-gray-100'}`}>
                        {statusLabels[order.status] || order.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <PackageSearch className="size-5 text-purple-600" />
              Commandes de pièces récentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentSparePartOrders.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">Aucune commande de pièces récente.</p>
            ) : (
              <div className="space-y-3">
                {recentSparePartOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                    <div className="space-y-1">
                      <p className="font-medium text-sm">{order.customerName}</p>
                      <p className="text-xs text-muted-foreground">{order.sparePartName}</p>
                    </div>
                    <div className="text-right space-y-1">
                      <p className="font-semibold text-sm">
                        {order.totalPrice ? new Intl.NumberFormat('fr-FR').format(order.totalPrice) : '0'} FCFA
                      </p>
                      <Badge className={`text-xs ${statusColors[order.status] || 'bg-gray-100'}`}>
                        {statusLabels[order.status] || order.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
