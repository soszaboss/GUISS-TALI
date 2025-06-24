import { useState } from "react"
import {
  Search, Plus, Edit, Trash2, MoreVertical, User, ChevronLeftIcon, ChevronRightIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import { Link } from "react-router-dom"
import { useQueryResponsePagination, useQueryResponseLoading } from "@/hooks/user/UserQueryResponseProvider"
import { formatLastLogin } from "@/lib/utils"
import { Pagination, PaginationContent, PaginationItem } from "@/components/ui/pagination"
import { Label } from "@/components/ui/label";
import { useQueryRequest } from "@/hooks/_QueryRequestProvider"
import { deleteUser } from "@/services/usersService"
import type { UserRole } from "@/types/userModels"
import { toast } from 'sonner';
import { useListView } from "@/hooks/_ListViewProvider"
import { useMutation } from "@tanstack/react-query"


export function AdminUsersList() {
  const {state, updateState} = useQueryRequest()
  const {results = [], count = 0, next, previous} = useQueryResponsePagination()
  const { setItemIdForUpdate } = useListView()
  const isLoading = useQueryResponseLoading()
  const mutation = useMutation({
    mutationFn: (userId: number) => deleteUser(userId),
    onSuccess: () => {
      if (userToDelete) {
        toast.success(`Utilisateur ${userToDelete.name} supprimé avec succès.`)
      }
    }
  , onError: () => {
      toast.error(`Erreur lors de la suppression de l'utilisateur ${userToDelete?.name ?? ''}.`)
    }
  })
  // Pagination
  const rowsPerPage = state.limit ?? 10
  const offset = state.offset ?? 0


  // Filtres
  const [roleFilter, setRoleFilter] = useState("")
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<null | { id: number; name: string }>(null)

  // Recherche
  const [searchTerm, setSearchTerm] = useState(state.search ?? "")

  // Gérer la recherche
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    updateState({ search: e.target.value, offset: 0 }) // reset page on search
  }

  // Gérer le changement du nombre de lignes par page
  const rowPageOnValueChange = (rowsPerPage: 10 | 20 | 50 | 100 ) => {
    updateState({
      limit: rowsPerPage,
      offset: 0, // reset to first page
    })
  }

  // Navigation pagination
  const pagNav = (nav: 'prev'|'next') => {
    let newOffset = offset
    if (nav === 'next' && next) {
      newOffset = offset + rowsPerPage
    } else if (nav === 'prev' && previous) {
      newOffset = Math.max(0, offset - rowsPerPage)
    }
    updateState({
      offset: newOffset
    })
  }

  // Filtrage par role
  function handleFilterRole(role:UserRole & 'all') {
    if(role === 'all'){
      setRoleFilter('')
      updateState({
        filter: undefined
      })
    }else{
      setRoleFilter(role)
      updateState({
        filter: {role:role}
      })
    }
  }

  // Suppression utilisateur
  const handleDeleteClick = (user: { id: number; name: string }) => {
    setUserToDelete(user)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (userToDelete) {
      mutation.mutate(userToDelete.id)
      setIsDeleteDialogOpen(false)
      setUserToDelete(null)
    }
  }

  // Pour la liste des options de pagination
  const rowsPerPageList = [10, 20, 50, 100].filter(value => value <= (count || 100))

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
              <Link to="/admin/users/add" onClick={()=>setItemIdForUpdate(null)}>
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
                onChange={handleSearchChange}
              />
            </div>
            <div className="flex gap-2">
              <Select value={roleFilter} onValueChange={handleFilterRole}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Rôle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les rôles</SelectItem>
                  <SelectItem value="ADMIN">Administrateur</SelectItem>
                  <SelectItem value="EMPLOYEE">Employé</SelectItem>
                </SelectContent>
              </Select>
              {/* <Select value={statusFilter} onValueChange={setStatusFilter}>
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
              </Button> */}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            {isLoading ?
              (
                <div className="p-8 flex flex-col items-center justify-center">
                  <svg className="animate-spin h-8 w-8 text-primary mb-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  <div className="w-full max-w-2xl">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="flex items-center space-x-4 mb-4 animate-pulse">
                        <div className="h-4 w-1/5 bg-gray-200 rounded"></div>
                        <div className="h-4 w-1/5 bg-gray-200 rounded"></div>
                        <div className="h-4 w-1/6 bg-gray-200 rounded"></div>
                        <div className="h-4 w-1/6 bg-gray-200 rounded"></div>
                        <div className="h-4 w-1/6 bg-gray-200 rounded"></div>
                        <div className="h-4 w-1/12 bg-gray-200 rounded"></div>
                      </div>
                    ))}
                  </div>
                  <span className="text-gray-400 mt-4">Chargement des utilisateurs...</span>
                </div>
              ) :
              (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nom Complet</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Rôle</TableHead>
                        <TableHead>Dernière connexion</TableHead>
                        <TableHead className="text-center">Statut</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {results.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.profile?.first_name} {user.profile?.last_name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{user.role}</TableCell>
                          <TableCell>{formatLastLogin(user.last_login)}</TableCell>
                          <TableCell className="text-center">
                            <Badge className={user.is_active === true ? "bg-green-500" : "bg-gray-500"}>
                              {user.is_active === true ? "Actif" : "Inactif"}
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
                                  <Link to={`/admin/users/profile/${user.id}`}>
                                    <User className="h-4 w-4 mr-2" />
                                    Voir le profil
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                  <Link to={`/admin/users/edit`} onClick={() => setItemIdForUpdate(user.id)}>
                                    <Edit className="h-4 w-4 mr-2" />
                                    Modifier
                                  </Link>
                                </DropdownMenuItem>
                                {/* <DropdownMenuItem asChild>
                                  <Link to={`/admin/users/permissions/${user.id}`}>
                                    <UserCog className="h-4 w-4 mr-2" />
                                    Permissions
                                  </Link>
                                </DropdownMenuItem> */}
                                <DropdownMenuItem
                                  className="text-red-500"
                                  onClick={() => user.id !== undefined ? handleDeleteClick({ id: Number(user.id), name: `${user.profile?.first_name} ${user.profile?.last_name}` }) : undefined}
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
              )
            }
          </div>

          <div className="w-full flex items-center justify-between gap-2 px-4 py-3 border-t">
            <div className="flex items-center gap-2">
              <Label className="whitespace-nowrap">Rows per page:</Label>
              <Select
                value={rowsPerPage.toString()}
                onValueChange={(value) => rowPageOnValueChange(Number(value) as 10 | 20 | 50 | 100)}
              >
                <SelectTrigger className="w-[65px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {rowsPerPageList.map((value, index) => (
                    <SelectItem value={value.toString()} key={index}>{value}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground whitespace-nowrap">
                {count === 0
                  ? "0"
                  : `${offset + 1}-${Math.min(offset + rowsPerPage, count)} sur ${count}`}
              </span>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <Button
                      aria-label="Go to previous page"
                      size="icon"
                      variant="ghost"
                      disabled={!previous}
                      onClick={()=> pagNav('prev')}
                    >
                      <ChevronLeftIcon className="h-4 w-4" />
                    </Button>
                  </PaginationItem>
                  <PaginationItem>
                    <Button
                      aria-label="Go to next page"
                      size="icon"
                      variant="ghost"
                      disabled={!next}
                      onClick={()=> pagNav('next')}
                    >
                      <ChevronRightIcon className="h-4 w-4" />
                    </Button>
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
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