import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Bell, HelpCircle, LogOut, Menu, Search, Settings, User } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { AlertCircle, Calendar } from "lucide-react"
import { Link } from "react-router-dom"

interface TechnicianHeaderProps {
  onMenuButtonClick: () => void
}

export function TechnicianHeader({ onMenuButtonClick }: TechnicianHeaderProps) {
  const [showSearch, setShowSearch] = useState(false)

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:px-6">
      <Button variant="ghost" size="icon" className="md:hidden" onClick={onMenuButtonClick}>
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle Menu</span>
      </Button>

      <div className={cn("hidden items-center md:flex", showSearch ? "hidden" : "flex")}>
        <h2 className="text-lg font-semibold">Espace Technicien</h2>
      </div>

      <div className={cn("flex-1", showSearch ? "block" : "hidden md:block")}>
        <form className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Rechercher..."
            className="w-full appearance-none bg-background pl-8 md:w-2/3 lg:w-1/3"
          />
        </form>
      </div>

      <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setShowSearch(!showSearch)}>
        <Search className="h-5 w-5" />
        <span className="sr-only">Toggle Search</span>
      </Button>

      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
              <span className="absolute right-1 top-1 flex h-2 w-2 rounded-full bg-primary" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-80 overflow-auto">
              {/* Notifications content */}
              <div className="flex items-center gap-4 p-3 hover:bg-accent">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Calendar className="h-4 w-4" />
                </span>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">Nouvelle visite planifiée</p>
                  <p className="text-xs text-muted-foreground">Jean Dupont - Examen de la vue - 15 juin, 09:30</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-3 hover:bg-accent">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <AlertCircle className="h-4 w-4" />
                </span>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">Calibration requise</p>
                  <p className="text-xs text-muted-foreground">Le tonomètre doit être calibré avant demain</p>
                </div>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className="justify-center">
              <Link to="/technician/notifications">Voir toutes les notifications</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <HelpCircle className="h-5 w-5" />
              <span className="sr-only">Aide</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link to="/support">Centre d'aide</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/documentation">Documentation</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/contact">Contacter le support</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg" alt="Thomas Martin" />
                <AvatarFallback>TM</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link to="/technician/profile">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profil</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/technician/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Paramètres</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/logout">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Déconnexion</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
