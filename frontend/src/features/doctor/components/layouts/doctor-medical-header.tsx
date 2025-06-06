import { Bell, Menu, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Link } from "react-router-dom"

interface DoctorMedicalHeaderProps {
  onMenuClick: () => void
}

export function DoctorMedicalHeader({ onMenuClick }: DoctorMedicalHeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 py-4 px-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" className="md:hidden mr-2" onClick={onMenuClick}>
            <Menu className="h-6 w-6" />
          </Button>
          <Link to="/doctor" className="flex items-center">
            <span className="text-xl font-bold">GUISS-TALI</span>
            <span className="ml-2 text-sm bg-blue-100 text-blue-600 px-2 py-0.5 rounded">Médecin</span>
          </Link>
        </div>

        <div className="hidden md:flex items-center bg-gray-100 rounded-md px-3 py-2 flex-1 max-w-md mx-4">
          <Search className="h-5 w-5 text-gray-500 mr-2" />
          <Input
            type="text"
            placeholder="Rechercher un patient..."
            className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>

        <div className="flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-80 overflow-auto">
                {[
                  {
                    title: "Patient à risque",
                    description: "Robert Lefebvre présente des symptômes nécessitant une attention particulière",
                    time: "Il y a 10 minutes",
                  },
                  {
                    title: "Rapport en attente",
                    description: "Le rapport médical de Marie Martin est en attente de finalisation",
                    time: "Il y a 30 minutes",
                  },
                  {
                    title: "Suivi à programmer",
                    description: "Sophie Petit nécessite un suivi dans les 6 mois",
                    time: "Il y a 1 heure",
                  },
                ].map((notification, index) => (
                  <DropdownMenuItem key={index} className="flex flex-col items-start py-2">
                    <div className="font-medium">{notification.title}</div>
                    <div className="text-sm text-gray-500">{notification.description}</div>
                    <div className="text-xs text-gray-400 mt-1">{notification.time}</div>
                  </DropdownMenuItem>
                ))}
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="justify-center font-medium">Voir toutes les notifications</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-sm font-medium">MD</span>
                </div>
                <span className="hidden md:inline">Dr. Martin Dupont</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link to="/doctor/profile" className="w-full">
                  Mon Profil
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link to="/doctor/settings" className="w-full">
                  Paramètres
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-500">
                <Link to="/login" className="w-full">
                  Déconnexion
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
