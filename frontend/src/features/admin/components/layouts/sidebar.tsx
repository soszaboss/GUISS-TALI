import type React from "react"


import {
  Users,
  ClipboardList,
  Settings,
  FileText,
  User,
  FileCheck,
  Home,
  ChevronDown,
  ChevronRight,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { Link, useLocation } from "react-router-dom"

interface AdminSidebarProps {
  isOpen: boolean
}

interface SidebarItemProps {
  href: string
  icon: React.ReactNode
  title: string
  active: boolean
  hasSubmenu?: boolean
  isSubmenuOpen?: boolean
  onClick?: () => void
}

function SidebarItem({ href, icon, title, active, hasSubmenu, isSubmenuOpen, onClick }: SidebarItemProps) {
  return (
    <Link
      to={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 transition-all",
        active ? "bg-blue-100 text-blue-900" : "text-gray-700 hover:bg-blue-50 hover:text-blue-900",
      )}
      onClick={onClick}
    >
      <div className="w-6 h-6 flex items-center justify-center">{icon}</div>
      <span className="flex-1">{title}</span>
      {hasSubmenu && (
        <div className="w-4 h-4">{isSubmenuOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}</div>
      )}
    </Link>
  )
}

export default function AdminSidebar({ isOpen }: AdminSidebarProps) {
  const location = useLocation();
  const pathname = location.pathname;
  const [usersSubmenuOpen, setUsersSubmenuOpen] = useState(false)
  const [settingsSubmenuOpen, setSettingsSubmenuOpen] = useState(false)
  const [patientsSubmenuOpen, setPatientsSubmenuOpen] = useState(false)

  return (
    <div
      className={cn(
        "bg-white border-r border-gray-200 flex flex-col transition-all duration-300",
        isOpen ? "w-64" : "w-16",
      )}
    >
      <div className="p-4 border-b border-gray-200 flex items-center justify-center">
        {isOpen ? (
          <h1 className="text-xl font-bold text-blue-900">Admin Panel</h1>
        ) : (
          <div className="w-8 h-8 bg-blue-900 rounded-full flex items-center justify-center text-white font-bold">
            A
          </div>
        )}
      </div>
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        <SidebarItem
          href="/admin-platform"
          icon={<Home size={20} />}
          title="Tableau de bord"
          active={pathname === "/admin-platform"}
        />

        <div>
          <SidebarItem
            href="#"
            icon={<Users size={20} />}
            title="Utilisateurs"
            active={pathname.startsWith("/admin-platform/users")}
            hasSubmenu={true}
            isSubmenuOpen={usersSubmenuOpen}
            onClick={() => setUsersSubmenuOpen(!usersSubmenuOpen)}
          />
          {usersSubmenuOpen && isOpen && (
            <div className="ml-6 mt-1 space-y-1">
              <SidebarItem
                href="/admin-platform/users"
                icon={<User size={16} />}
                title="Liste des utilisateurs"
                active={pathname === "/admin-platform/users"}
              />
              <SidebarItem
                href="/admin-platform/users/add"
                icon={<User size={16} />}
                title="Ajouter un utilisateur"
                active={pathname === "/admin-platform/users/add"}
              />
              <SidebarItem
                href="/admin-platform/users/roles"
                icon={<User size={16} />}
                title="Rôles et permissions"
                active={pathname === "/admin-platform/users/roles"}
              />
            </div>
          )}
        </div>

        <div>
          <SidebarItem
            href="#"
            icon={<FileCheck size={20} />}
            title="Patients"
            active={pathname.startsWith("/admin-platform/patients")}
            hasSubmenu={true}
            isSubmenuOpen={patientsSubmenuOpen}
            onClick={() => setPatientsSubmenuOpen(!patientsSubmenuOpen)}
          />
          {patientsSubmenuOpen && isOpen && (
            <div className="ml-6 mt-1 space-y-1">
              <SidebarItem
                href="/admin-platform/patients"
                icon={<User size={16} />}
                title="Liste des patients"
                active={pathname === "/admin-platform/patients"}
              />
              <SidebarItem
                href="/admin-platform/medical-records"
                icon={<FileText size={16} />}
                title="Fiches médicales"
                active={pathname === "/admin-platform/medical-records"}
              />
            </div>
          )}
        </div>

        <SidebarItem
          href="/admin-platform/logs"
          icon={<ClipboardList size={20} />}
          title="Journal d'activité"
          active={pathname === "/admin-platform/logs"}
        />

        <div>
          <SidebarItem
            href="#"
            icon={<Settings size={20} />}
            title="Paramètres"
            active={pathname.startsWith("/admin-platform/settings")}
            hasSubmenu={true}
            isSubmenuOpen={settingsSubmenuOpen}
            onClick={() => setSettingsSubmenuOpen(!settingsSubmenuOpen)}
          />
          {settingsSubmenuOpen && isOpen && (
            <div className="ml-6 mt-1 space-y-1">
              <SidebarItem
                href="/admin-platform/settings"
                icon={<Settings size={16} />}
                title="Paramètres globaux"
                active={pathname === "/admin-platform/settings/global"}
              />
            </div>
          )}
        </div>
      </nav>
    </div>
  )
}
