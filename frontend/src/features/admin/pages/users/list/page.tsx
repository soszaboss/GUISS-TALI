import { useState } from "react"
import {
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  UserCog,
  User,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Link } from "react-router-dom"

export function AdminUsersList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<null | { id: number; name: string }>(null)

  // Données pour la liste des utilisateurs
  const users = [
    {
      id: 1,
      name: "Dr. Jean Martin",
      email: "jean.martin@example.com",
      role: "Médecin",
      lastLogin: "Aujourd'hui, 10:30",
      status: "active",
    },
    {
      id: 2,
      name: "Sophie Lefebvre",
      email: "sophie.lefebvre@example.com",
      role: "Technicien",
      lastLogin: "Hier, 15:45",
      status: "active",
    },
    {
      id: 3,
      name: "Pierre Dubois",
      email: "pierre.dubois@example.com",
      role: "Assistant",
      lastLogin: "22/04/2023, 09:15",
      status: "inactive",
    },
    {
      id: 4,
      name: "Marie Leclerc",
      email: "marie.leclerc@example.com",
      role: "Médecin",
      lastLogin: "Aujourd'hui, 08:20",
      status: "active",
    },
    {
      id: 5,
      name: "Thomas Bernard",
      email: "thomas.bernard@example.com",
      role: "Administrateur",
      lastLogin: "Aujourd'hui, 11:05",
      status: "active",
    },
    {
      id: 6,
      name: "Camille Moreau",
      email: "camille.moreau@example.com",
      role: "Technicien",
      lastLogin: "Hier, 14:30",
      status: "active",
    },
    {
      id: 7,
      name: "Lucas Petit",
      email: "lucas.petit@example.com",
      role: "Assistant",
      lastLogin: "21/04/2023, 16:40",
      status: "inactive",
    },
    {
      id: 8,
      name: "Emma Roux",
      email: "emma.roux@example.com",
      role: "Médecin",
      lastLogin: "Aujourd'hui, 09:45",
      status: "active",
    },
    {
      id: 9,
      name: "Hugo Fournier",
      email: "hugo.fournier@example.com",
      role: "Technicien",
      lastLogin: "20/04/2023, 10:15",
      status: "active",
    },
    {
      id: 10,
      name: "Léa Girard",
      email: "lea.girard@example.com",
      role: "Assistant",
      lastLogin: "Hier, 11:30",
      status: "active",
    },
  ]

  // Filtrer les utilisateurs
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === "all" || user.role.toLowerCase() === roleFilter.toLowerCase()
    const matchesStatus = statusFilter === "all" || user.status === statusFilter
    return matchesSearch && matchesRole && matchesStatus
  })

  // Gérer la suppression d'un utilisateur
  const handleDeleteClick = (user: { id: number; name: string }) => {
    setUserToDelete(user)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    // Logique de suppression ici
    console.log(`Suppression de l'utilisateur ${userToDelete?.name}`)
    setIsDeleteDialogOpen(false)
    setUserToDelete(null)
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Gestion des utilisateurs</h1>
            <p className="text-gray-500 mt-1">Gérez les utilisateurs et leurs permissions</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button asChild>
              <Link to="/admin-platform/users/add">
                <Plus className="h-4 w-4 mr-2" />
                Ajouter un utilisateur
              </Link>
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                placeholder="Rechercher un utilisateur..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Rôle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les rôles</SelectItem>
                  <SelectItem value="administrateur">Administrateur</SelectItem>
                  <SelectItem value="médecin">Médecin</SelectItem>
                  <SelectItem value="technicien">Technicien</SelectItem>
                  <SelectItem value="assistant">Assistant</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="active">Actif</SelectItem>
                  <SelectItem value="inactive">Inactif</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filtres
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Rôle</TableHead>
                  <TableHead>Dernière connexion</TableHead>
                  <TableHead className="text-center">Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>{user.lastLogin}</TableCell>
                    <TableCell className="text-center">
                      <Badge className={user.status === "active" ? "bg-green-500" : "bg-gray-500"}>
                        {user.status === "active" ? "Actif" : "Inactif"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link to={`/admin-platform/users/profile/${user.id}`}>
                              <User className="h-4 w-4 mr-2" />
                              Voir le profil
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link to={`/admin-platform/users/edit/${user.id}`}>
                              <Edit className="h-4 w-4 mr-2" />
                              Modifier
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link to={`/admin-platform/users/permissions/${user.id}`}>
                              <UserCog className="h-4 w-4 mr-2" />
                              Permissions
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-500"
                            onClick={() => handleDeleteClick({ id: user.id, name: user.name })}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between px-4 py-3 border-t">
            <div className="text-sm text-gray-500">Affichage de 1 à 10 sur 42 utilisateurs</div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="icon">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" className="bg-blue-50">
                1
              </Button>
              <Button variant="outline" size="sm">
                2
              </Button>
              <Button variant="outline" size="sm">
                3
              </Button>
              <Button variant="outline" size="sm">
                4
              </Button>
              <Button variant="outline" size="sm">
                5
              </Button>
              <Button variant="outline" size="icon">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Dialogue de confirmation de suppression */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer l'utilisateur <strong>{userToDelete?.name}</strong> ? Cette action est
              irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
