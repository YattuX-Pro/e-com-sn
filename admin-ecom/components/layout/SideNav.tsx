"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { LayoutDashboard, Package, ShoppingCart, Users, Settings, LogOut, Wrench, Cog, PackageSearch, Bike } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { setAuthToken } from "@/lib/api"
import { useSidebar } from "@/contexts/SidebarContext"

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/produits", label: "Tricycles", icon: Bike },
  { href: "/pieces", label: "Pièces Détachées", icon: Cog },
  { href: "/commandes", label: "Commandes Tricycles", icon: ShoppingCart },
  { href: "/commandes-pieces", label: "Commandes Pièces", icon: PackageSearch },
  { href: "/depannage", label: "Dépannage", icon: Wrench },
  { href: "/utilisateurs", label: "Utilisateurs", icon: Users },
]

export function SideNav() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = () => {
    setAuthToken(null)
    document.cookie = 'token=; path=/; max-age=0'
    window.location.href = "/login"
  }
  const { isOpen } = useSidebar()

  return (
    <aside className={cn(
      "fixed left-0 top-14 z-40 h-[calc(100vh-3.5rem)] border-r bg-card transition-all duration-300",
      isOpen ? "w-64" : "w-0 overflow-hidden border-r-0"
    )}>
      <nav className="flex flex-col gap-1 p-3">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              pathname === href ? "bg-primary text-primary-foreground" : "hover:bg-muted"
            )}
          >
            <Icon className="size-5" />
            <span>{label}</span>
          </Link>
        ))}
      </nav>
      <div className="mt-auto p-3 border-t space-y-1">
        <Link
          href="/parametres"
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
            pathname === "/parametres" ? "bg-primary text-primary-foreground" : "hover:bg-muted"
          )}
        >
          <Settings className="size-5" />
          <span>Paramètres</span>
        </Link>
        <Button
          variant="ghost"
          className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          onClick={handleLogout}
        >
          <LogOut className="mr-3 size-5" />
          Déconnexion
        </Button>
      </div>
    </aside>
  )
}
