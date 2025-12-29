"use client"

import { useSidebar } from "@/contexts/SidebarContext"
import { cn } from "@/lib/utils"

export function MainContent({ children }: { children: React.ReactNode }) {
  const { isOpen } = useSidebar()

  return (
    <main className={cn(
      "min-h-[calc(100vh-3.5rem-57px)] pt-14 transition-all duration-300",
      isOpen ? "ml-64" : "ml-0"
    )}>
      <div className="p-6">{children}</div>
    </main>
  )
}
