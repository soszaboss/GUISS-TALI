import type React from "react"
import { useState } from "react"
import { Header } from "./Header"
import { Sidebar } from "./Sidebar"

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1">
        <Header />
        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
