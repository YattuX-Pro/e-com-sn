"use client"

import { Menu, Moon, Sun, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSidebar } from "@/contexts/SidebarContext"
import { useTheme } from "@/contexts/ThemeContext"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function TopNav() {
  const { toggle } = useSidebar()
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-14 border-b bg-card backdrop-blur">
      <div className="flex h-full items-center gap-4 px-4">
        <Button variant="ghost" size="icon" onClick={toggle}>
          <Menu className="size-5" />
        </Button>

        <span className="font-semibold text-primary">Admin E-Com</span>

        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Bell className="size-5" />
          </Button>

          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === "dark" ? <Sun className="size-5 text-secondary" /> : <Moon className="size-5" />}
          </Button>

          <Avatar className="size-8 bg-primary">
            <AvatarFallback className="bg-primary text-primary-foreground">AD</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  )
}
