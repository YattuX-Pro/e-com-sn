"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FolderOpen, Tags } from "lucide-react"
import { Category, categoriesApi, SparePartCategory, sparePartCategoriesApi } from "@/lib/api"
import { ProductCategoriesTab, SparePartCategoriesTab } from "@/components/parametres"

export default function ParametresPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [sparePartCategories, setSparePartCategories] = useState<SparePartCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("categories")

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [cats, spCats] = await Promise.all([
        categoriesApi.getAll(),
        sparePartCategoriesApi.getAll()
      ])
      setCategories(cats)
      setSparePartCategories(spCats)
    } catch (error) {
      console.error("Error loading data:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary">Paramètres</h1>
        <p className="text-muted-foreground">Configurez votre application</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="categories" className="flex items-center gap-2">
            <FolderOpen className="size-4" /> Catégories Produits
          </TabsTrigger>
          <TabsTrigger value="spare-part-categories" className="flex items-center gap-2">
            <Tags className="size-4" /> Catégories Pièces
          </TabsTrigger>
        </TabsList>

        <TabsContent value="categories">
          <ProductCategoriesTab categories={categories} onRefresh={loadData} />
        </TabsContent>

        <TabsContent value="spare-part-categories">
          <SparePartCategoriesTab categories={sparePartCategories} onRefresh={loadData} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
