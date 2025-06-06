import type React from "react"
import { useState } from "react"
import { TechnicianHeader } from "./technician-header"
import { TechnicianSidebar } from "./technician-sidebar"

interface TechnicianLayoutProps {
  children: React.ReactNode
}

export function TechnicianLayout({ children }: TechnicianLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-gray-100">
      <TechnicianSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TechnicianHeader onMenuButtonClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
