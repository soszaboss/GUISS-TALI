import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Search, Plus, Filter, ChevronLeft, ChevronRight, MoreHorizontal, Eye, Edit, Trash2, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DeleteConfirmationModal } from "./delete-confirmation-modal"

// Données fictives pour les patients
const patients = [
  {
    id: 1,
    first_name: "Amadou",
    last_name: "Diallo",
    email: "amadou.diallo@example.com",
    phone_number: "+221 77 123 4567",
    date_naissance: "1985-06-15",
    numero_permis: "SN12345678",
    type_permis: "Léger",
    annees_experience: 8,
    service: "Privé",
    status: "active",
  },
  {
    id: 2,
    first_name: "Fatou",
    last_name: "Ndiaye",
    email: "fatou.ndiaye@example.com",
    phone_number: "+221 78 234 5678",
    date_naissance: "1990-03-22",
    numero_permis: "SN23456789",
    type_permis: "Lourd",
    annees_experience: 5,
    service: "Public",
    status: "inactive",
  },
  {
    id: 3,
    first_name: "Moussa",
    last_name: "Sow",
    email: "moussa.sow@example.com",
    phone_number: "+221 76 345 6789",
    date_naissance: "1982-11-10",
    numero_permis: "SN34567890",
    type_permis: "Léger",
    annees_experience: 12,
    service: "Particulier",
    status: "active",
  },
  {
    id: 4,
    first_name: "Aïssatou",
    last_name: "Diop",
    email: "aissatou.diop@example.com",
    phone_number: "+221 70 456 7890",
    date_naissance: "1995-08-05",
    numero_permis: "SN45678901",
    type_permis: "Autres",
    annees_experience: 3,
    service: "Privé",
    status: "active",
  },
  {
    id: 5,
    first_name: "Ousmane",
    last_name: "Gueye",
    email: "ousmane.gueye@example.com",
    phone_number: "+221 77 567 8901",
    date_naissance: "1988-02-28",
    numero_permis: "SN56789012",
    type_permis: "Lourd",
    annees_experience: 10,
    service: "Public",
    status: "inactive",
  },
]

export function PatientsList() {
  const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [filterStatus, setFilterStatus] = useState("all")

  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [patientToDelete, setPatientToDelete] = useState<any>(null)
  // Filtrer les patients
  const filteredPatients = patients.filter((patient) => {
    const matchesSearch =
      patient.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phone_number.includes(searchTerm)

    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "active" && patient.status === "active") ||
      (filterStatus === "inactive" && patient.status === "inactive")

    return matchesSearch && matchesStatus
  })

  // Pagination
  const totalPages = Math.ceil(filteredPatients.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedPatients = filteredPatients.slice(startIndex, startIndex + itemsPerPage)

  // Redirection vers les détails du patient
  const handleViewPatient = (id: number) => {
   navigate(`/assistant/patients/${id}`)
  }

  // Redirection vers les détails du patient
  const handleMediaclRecord = (id: number) => {
   navigate(`/assistant/patients/medical-record/${id}`)
  }

  // Redirection vers le formulaire d'édition
  const handleEditPatient = (id: number) => {
   navigate(`/assistant/patients/edit/${id}`)
  }

  const handleDeleteClick = (patient: any) => {
    setPatientToDelete(patient)
    setDeleteModalOpen(true)
  }

  const handleConfirmDelete = () => {
    // Ici vous pouvez ajouter la logique de suppression
    console.log("Patient supprimé:", patientToDelete)
    // Dans une vraie application, vous feriez un appel API ici
    setDeleteModalOpen(false)
    setPatientToDelete(null)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold">Gestion des Patients</h1>
        <Button className="bg-blue-600 hover:bg-blue-700" onClick={() =>navigate("/assistant/patients/new")}>
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
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filtrer par statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="active">Actif</SelectItem>
                  <SelectItem value="inactive">Inactif</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Téléphone</TableHead>
                  <TableHead>Type de permis</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedPatients.length > 0 ? (
                  paginatedPatients.map((patient) => (
                    <TableRow key={patient.id}>
                      <TableCell className="font-medium">
                        {patient.first_name} {patient.last_name}
                      </TableCell>
                      <TableCell>{patient.email}</TableCell>
                      <TableCell>{patient.phone_number}</TableCell>
                      <TableCell>{patient.type_permis}</TableCell>
                      <TableCell>{patient.service}</TableCell>
                      <TableCell>
                        <Badge
                          variant={patient.status === "active" ? "default" : "secondary"}
                          className={
                            patient.status === "active"
                              ? "bg-green-100 text-green-800 hover:bg-green-100"
                              : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                          }
                        >
                          {patient.status === "active" ? "Actif" : "Inactif"}
                        </Badge>
                      </TableCell>
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
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-500">
              Affichage de {Math.min(filteredPatients.length, startIndex + 1)} à{" "}
              {Math.min(filteredPatients.length, startIndex + itemsPerPage)} sur {filteredPatients.length} patients
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <div className="text-sm">
                Page {currentPage} sur {totalPages || 1}
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages || totalPages === 0}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>

              <Select
                value={itemsPerPage.toString()}
                onValueChange={(value) => {
                  setItemsPerPage(Number(value))
                  setCurrentPage(1)
                }}
              >
                <SelectTrigger className="w-[70px]">
                  <SelectValue placeholder="10" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
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
