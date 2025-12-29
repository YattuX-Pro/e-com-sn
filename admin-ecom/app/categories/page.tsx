"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function CategoriesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">Catégories</h1>
          <p className="text-muted-foreground">Gérez les catégories de produits</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="size-4" />
          Ajouter
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des catégories</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Fonctionnalité en cours de développement</p>
        </CardContent>
      </Card>
    </div>
  )
}
