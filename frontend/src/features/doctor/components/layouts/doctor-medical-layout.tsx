import type React from "react"

import { useState } from "react"
import { DoctorMedicalHeader } from "./doctor-medical-header"
import { DoctorMedicalSidebar } from "./doctor-medical-sidebar"

interface DoctorMedicalLayoutProps {
  children: React.ReactNode
}

export function DoctorMedicalLayout({ children }: DoctorMedicalLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen bg-gray-50">
      <DoctorMedicalSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <DoctorMedicalHeader onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}
