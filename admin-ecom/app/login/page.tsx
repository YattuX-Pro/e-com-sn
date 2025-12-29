"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { authApi, setAuthToken } from "@/lib/api"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !password) {
      setError("Veuillez remplir tous les champs")
      return
    }
    
    setError("")
    setLoading(true)

    try {
      const response = await authApi.login({ email, password })
      setAuthToken(response.token)
      
      document.cookie = `token=${response.token}; path=/; max-age=86400; SameSite=Lax`
      
      window.location.href = "/"
    } catch (err: any) {
      console.error('Login error:', err)
      
      let errorMessage = ""
      
      if (err.message?.includes('fetch') || err.message?.includes('Failed to fetch')) {
        errorMessage = "❌ Impossible de se connecter au serveur. Vérifiez que l'API est démarrée."
      } else if (err.message?.includes('401') || err.message?.includes('Unauthorized') || err.message?.includes('incorrect')) {
        errorMessage = "❌ Email ou mot de passe incorrect. Veuillez réessayer."
      } else if (err.message?.includes('400')) {
        errorMessage = "❌ Données invalides. Vérifiez vos informations."
      } else {
        errorMessage = `❌ Erreur de connexion: ${err.message || 'Une erreur est survenue'}`
      }
      
      setError(errorMessage)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center text-primary">Connexion</CardTitle>
          <CardDescription className="text-center">
            Connectez-vous à votre compte administrateur
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@hasilaza.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && (
              <div className="text-sm text-red-700 bg-red-100 dark:bg-red-900/30 dark:text-red-400 p-4 rounded-lg border-2 border-red-300 dark:border-red-800 font-medium animate-in fade-in slide-in-from-top-2 duration-300">
                {error}
              </div>
            )}
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90"
              disabled={loading}
            >
              {loading ? "Connexion..." : "Se connecter"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
