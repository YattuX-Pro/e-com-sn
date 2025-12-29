import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, ShoppingCart, Users } from "lucide-react"

const stats = [
  { label: "Produits", value: "0", icon: Package, color: "text-primary" },
  { label: "Commandes", value: "0", icon: ShoppingCart, color: "text-secondary" },
  { label: "Utilisateurs", value: "0", icon: Users, color: "text-primary" },
]

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary">Dashboard</h1>
        <p className="text-muted-foreground">Vue d&apos;ensemble</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <Card key={label} className="border-l-4 border-l-primary">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{label}</CardTitle>
              <Icon className={`size-5 ${color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Commandes récentes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Aucune commande récente.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Produits populaires</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Aucun produit populaire.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
