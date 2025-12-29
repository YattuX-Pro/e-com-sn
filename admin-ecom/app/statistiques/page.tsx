"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function StatistiquesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary">Statistiques</h1>
        <p className="text-muted-foreground">Analysez vos performances</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Ventes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Statistiques de ventes à venir</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Commandes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Statistiques de commandes à venir</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Clients</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Statistiques clients à venir</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
