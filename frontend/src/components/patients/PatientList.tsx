import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Search, Plus, Edit, Trash2, MoreHorizontal, Eye, FileText, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DeleteConfirmationModal } from "./DeleteConfirmationModal"
import { useQueryRequest } from "@/hooks/_QueryRequestProvider"
import { usePatientQueryResponsePagination, usePatientQueryResponseLoading } from "@/hooks/patient/PatientQueryResponseProvider"
import { toast } from "sonner"
import type { ID } from "@/types/_models"
import type { Conducteur } from "@/types/patientsModels"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deletePatient } from "@/services/patientsService"
import { QUERIES } from "@/helpers/crud-helper/consts"
import { stringifyRequestQuery } from "@/helpers/crud-helper/helpers"
import { useListView } from "@/hooks/_ListViewProvider"
import { useAuth } from "@/hooks/auth/Auth"
import { anonymizeName } from "@/helpers/anonymaseFullName"

export function PatientsList() {
  const navigate = useNavigate()
  const queryClient = useQueryClient();
  const { state, updateState } = useQueryRequest()
  const {setItemIdForUpdate} = useListView()
  const { currentUser } = useAuth()
  const { results = [], count = 0, next, previous } = usePatientQueryResponsePagination()
  const isLoading = usePatientQueryResponseLoading()
  const role = currentUser?.role

  const mutation = useMutation({
    mutationFn: (id: ID) => deletePatient(id!.toString()),
    mutationKey: [QUERIES.PATIENTS_LIST, "deletePatient"],
    onSuccess: () => {
      toast.success("Patient supprimé avec succès.")
      // Rafraîchir la liste des patients
      queryClient.invalidateQueries({
        queryKey: [QUERIES.PATIENTS_LIST, stringifyRequestQuery(state)],
      }); // Rafraîchit proprement
      setDeleteModalOpen(false)
      setPatientToDelete(null)
    },
    onError: () => {
      toast.error("Erreur lors de la suppression du patient, réessayez plus tard.")
      setDeleteModalOpen(false)
    },
  })
  // Recherche
  const [searchTerm, setSearchTerm] = useState(state.search ?? "")
  // Filtre type_permis
  const [typePermisFilter, setTypePermisFilter] = useState(
    (state.filter && typeof state.filter === "object" && "type_permis" in state.filter
      ? (state.filter as { type_permis?: string }).type_permis
      : "all"
    ) ?? "all"
  )

  // Pagination
  const rowsPerPage = state.limit ?? 10
  const offset = state.offset ?? 0

  // Suppression
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [patientToDelete, setPatientToDelete] = useState<Conducteur|null>(null)

  // Recherche
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    updateState({ search: e.target.value, offset: 0 })
  }

  // Filtre type_permis
  const handleTypePermisFilter = (value: string) => {
    setTypePermisFilter(value)
    updateState({
      filter: value !== "all" ? { type_permis: value } : undefined,
      offset: 0,
    })
  }

  // Pagination
  const rowPageOnValueChange = (rowsPerPage: 10 | 20 | 50 | 100) => {
    updateState({
      limit: rowsPerPage,
      offset: 0,
    })
  }

  const pagNav = (nav: "prev" | "next") => {
    let newOffset = offset
    if (nav === "next" && next) {
      newOffset = offset + rowsPerPage
    } else if (nav === "prev" && previous) {
      newOffset = Math.max(0, offset - rowsPerPage)
    }
    updateState({ offset: newOffset })
  }


  // Actions
  const handleViewPatient = (id: ID) => {
    if (id !== undefined) {
      navigate(`/${role?.toLowerCase()}/patients/${id}`)
    }
  }
  const handleMediaclRecord = (id: ID) => {
    if (id !== undefined) {
      navigate(`/${role?.toLowerCase()}/patients/medical-record/${id}`)
    }
  }
  const handleEditPatient = (id: ID) => {
    if (id !== undefined) {
      setItemIdForUpdate(id)
      navigate(`/${role?.toLowerCase()}/patients/edit`)
    }
  }
  const handleDeleteClick = (patient: Conducteur) => {
    setPatientToDelete(patient)
    setDeleteModalOpen(true)
  }
  const handleConfirmDelete = () => {
    // À compléter avec l'appel API
    mutation.mutate(patientToDelete?.id as ID)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold">Gestion des Patients</h1>
        <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => {
          setItemIdForUpdate(null)
          navigate(`/${role?.toLowerCase()}/patients/new`)
        }}>
          <Plus className="mr-2 h-4 w-4" />
          Nouveau Patient
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Liste des Patients</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between">
            <div className="flex items-center gap-2 w-full md:w-1/2">
              <div className="relative w-full">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Rechercher un patient..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Select value={typePermisFilter} onValueChange={handleTypePermisFilter}>
                <SelectTrigger className="w-[220px]">
                  <SelectValue placeholder="Filtrer par type de permis" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les types</SelectItem>
                  <SelectItem value="leger">Léger</SelectItem>
                  <SelectItem value="lourd">Lourd</SelectItem>
                  <SelectItem value="autres">Autres à préciser</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-md border overflow-hidden min-h-[200px]">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <svg className="animate-spin h-8 w-8 text-blue-600 mb-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                <span className="text-blue-600 font-medium">Chargement des patients...</span>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>N°</TableHead>
                    <TableHead>Nom Complet</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Téléphone</TableHead>
                    <TableHead>Type de permis</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.length > 0 ? (
                    results.map((patient) => (
                      <TableRow key={patient.id}>
                        <TableCell className="font-medium">
                          {patient.numero_permis}
                        </TableCell>
                        <TableCell >
                          {anonymizeName(`${patient.first_name} ${patient.last_name}`)}
                        </TableCell>
                        <TableCell className="font-semibold">
                          {patient.email ? patient.email : <span className="italic text-gray-400">Non renseigné</span>}
                        </TableCell>
                        <TableCell>{patient.phone_number}</TableCell>
                        <TableCell>{patient.type_permis}</TableCell>
                        <TableCell>{patient.service}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleViewPatient(patient.id)}>
                                <Eye className="mr-2 h-4 w-4" />
                                <span>Voir</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleMediaclRecord(patient.id)}>
                                <FileText className="mr-2 h-4 w-4" />
                                <span>Cahier médical</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEditPatient(patient.id)}>
                                <Edit className="mr-2 h-4 w-4" />
                                <span>Modifier</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDeleteClick(patient)}>
                                <Trash2 className="mr-2 h-4 w-4" />
                                <span>Supprimer</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                        Aucun patient trouvé
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-500">
              Affichage de {count === 0 ? 0 : offset + 1} à {count === 0 ? 0 : Math.min(offset + rowsPerPage, count)} sur {count} patients
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => pagNav("prev")}
                disabled={!previous}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="text-sm">
                Page {count === 0 ? 0 : Math.floor(offset / rowsPerPage) + 1} sur {Math.ceil(count / rowsPerPage) || 1}
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => pagNav("next")}
                disabled={!next}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Select
                value={rowsPerPage.toString()}
                onValueChange={(value) => rowPageOnValueChange(Number(value) as 10 | 20 | 50 | 100)}
              >
                <SelectTrigger className="w-[70px]">
                  <SelectValue placeholder="10" />
                </SelectTrigger>
                <SelectContent>
                  {[10, 20, 50, 100].map((value) => (
                    <SelectItem value={value.toString()} key={value}>{value}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        patientName={patientToDelete ? `${patientToDelete.first_name} ${patientToDelete.last_name}` : ""}
      />
    </div>
  )
}