import type React from "react"
import { useState } from "react"
import { AssistantHeader } from "./assistant-header"
import { AssistantSidebar } from "./assistant-sidebar"

interface AssistantLayoutProps {
  children: React.ReactNode
}

export function AssistantLayout({ children }: AssistantLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AssistantSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1">
        <AssistantHeader onMenuClick={() => setSidebarOpen(true)} />
        <main className="p-4 md:p-6 max-w-[960px]">{children}</main>
      </div>
    </div>
  )
}
