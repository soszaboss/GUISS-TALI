import { X, Home, Calendar, Users, FileText, AlertTriangle, BarChart2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Link, useLocation } from "react-router-dom"

interface DoctorMedicalSidebarProps {
  open: boolean
  onClose: () => void
}

export function DoctorMedicalSidebar({ open, onClose }: DoctorMedicalSidebarProps) {
  const location = useLocation()
  const pathname = location.pathname

  const menuItems = [
    {
      icon: Home,
      label: "Tableau de bord",
      href: "/doctor/dashboard",
    },
    {
      icon: Users,
      label: "Patients",
      href: "/doctor/patients",
    },
    {
      icon: Calendar,
      label: "Consultations",
      href: "/doctor/consultations",
    },
    {
      icon: AlertTriangle,
      label: "Patients à risque",
      href: "/doctor/risk-patients",
      badge: 5,
    },
    {
      icon: BarChart2,
      label: "Statistiques",
      href: "/doctor/statistics",
    },
    {
      icon: FileText,
      label: "Historique & Suivi",
      href: "/doctor/history",
    },
  ]

  return (
    <>
      {/* Mobile overlay */}
      {open && <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={onClose}></div>}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between p-4 border-b md:hidden">
          <h2 className="text-xl font-semibold">Menu</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-6 w-6" />
          </Button>
        </div>

        <nav className="p-4 space-y-1 ">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center px-4 py-3 rounded-md transition-colors",
                pathname === item.href ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-700 hover:bg-gray-100",
              )}
            >
              <item.icon className="h-5 w-5 mr-3" />
              <span>{item.label}</span>
              {item.badge && (
                <span className="ml-auto bg-blue-100 text-blue-600 text-xs font-medium px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
        </nav>
      </aside>
    </>
  )
}
