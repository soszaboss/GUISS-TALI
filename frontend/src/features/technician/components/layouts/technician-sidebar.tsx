import { cn } from "@/lib/utils"
import { Activity, Calendar, ClipboardList, LayoutDashboard, LineChart, Settings, Users } from "lucide-react"
import { Link, useLocation } from "react-router-dom"


const sidebarItems = [
  {
    title: "Tableau de bord",
    href: "/technician/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Patients",
    href: "/technician/patients",
    icon: Users,
  },
  {
    title: "Historique",
    href: "/technician/history",
    icon: ClipboardList,
  },
  {
    title: "Statistiques",
    href: "/technician/statistics",
    icon: LineChart,
  },
]

export function TechnicianSidebar() {
  const location = useLocation()
  const pathname = location.pathname

  return (
    <div className="flex min-h-screen flex-col border-r bg-background w-56">
      <div className="flex h-14 items-center border-b px-3">
        <Link to="/technician" className="flex items-center gap-1.5 font-semibold">
          <Activity className="h-5 w-5 text-primary" />
          <span className="text-sm">GUISS TALI</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-1">
        <nav className="grid items-start px-1.5 text-lg font-medium p-4 space-y-1">
          {sidebarItems.map((item, index) => {
            const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`)
            return (
              <Link
                key={index}
                to={item.href}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-2.5 py-1.5 transition-all",
                  isActive ? "bg-primary text-primary-foreground" : "hover:bg-accent hover:text-accent-foreground",
                )}
              >
                <item.icon className="h-3.5 w-3.5" />
                {item.title}
              </Link>
            )
          })}
        </nav>
      </div>
      <div className="mt-auto p-3">
        <div className="rounded-lg bg-muted p-2.5">
          <h5 className="mb-1.5 text-xs font-medium">Besoin d'aide?</h5>
          <p className="mb-2 text-[10px] text-muted-foreground">Consultez notre guide ou contactez le support.</p>
          <Link to="/support">
            <div className="text-[10px] font-medium text-primary hover:underline">Centre d'aide</div>
          </Link>
        </div>
      </div>
    </div>
  )
}
