"use client"

import { usePathname } from "next/navigation"
import { ThemeProvider } from "@/contexts/ThemeContext"
import { SidebarProvider } from "@/contexts/SidebarContext"
import { TopNav } from "./TopNav"
import { SideNav } from "./SideNav"
import { Footer } from "./Footer"
import { MainContent } from "./MainContent"

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isLoginPage = pathname === "/login"

  if (isLoginPage) {
    return (
      <ThemeProvider>
        {children}
      </ThemeProvider>
    )
  }

  return (
    <ThemeProvider>
      <SidebarProvider>
        <div className="min-h-screen bg-background">
          <TopNav />
          <SideNav />
          <MainContent>{children}</MainContent>
          <Footer />
        </div>
      </SidebarProvider>
    </ThemeProvider>
  )
}
