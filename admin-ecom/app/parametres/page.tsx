"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ParametresPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary">Paramètres</h1>
        <p className="text-muted-foreground">Configurez votre application</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Paramètres généraux</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Fonctionnalité en cours de développement</p>
        </CardContent>
      </Card>
    </div>
  )
}
