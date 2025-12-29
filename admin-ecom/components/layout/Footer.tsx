"use client"

import { useSidebar } from "@/contexts/SidebarContext"
import { cn } from "@/lib/utils"

export function Footer() {
  const { isOpen } = useSidebar()

  return (
    <footer className={cn(
      "border-t py-4 text-center text-sm text-muted-foreground transition-all duration-300",
      isOpen ? "ml-64" : "ml-0"
    )}>
      © {new Date().getFullYear()} E-Com Admin
    </footer>
  )
}
