import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChevronLeft, ChevronRight, Eye, Search } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useQueryRequest } from "@/hooks/_QueryRequestProvider"
import { useMedicalRecordQueryResponsePagination, useMedicalRecordQueryResponseLoading, MedicalRecordQueryResponseProvider } from "@/hooks/health record/MedicalRecordQueryResponseProvider"
import type { HealthRecord } from "@/types/medicalRecord"
import { useAuth } from "@/hooks/auth/Auth"
import type { ID } from "@/types/_models"
import { anonymizeName } from "@/helpers/anonymaseFullName"

function AtRiskPatients() {
  const navigate = useNavigate()
  const { state, updateState } = useQueryRequest()
  const { results = [], count = 0, next, previous } = useMedicalRecordQueryResponsePagination()
  const isLoading = useMedicalRecordQueryResponseLoading()
  const { currentUser } = useAuth()
  const role = currentUser?.role?.toLocaleLowerCase()

  // Recherche
  const [searchTerm, setSearchTerm] = useState(state.search ?? "")
  // Pagination
  const rowsPerPage = state.limit ?? 10
  const offset = state.offset ?? 0

  // Forcer le filtre risky_patient=true à chaque changement de query
  useEffect(() => {
    updateState({
      ...state,
      filter: { ...(state.filter || {}), risky_patient: true },
      offset: state.offset ?? 0,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Recherche
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    updateState({
      ...state,
      search: e.target.value,
      offset: 0,
      filter: { ...(state.filter || {}), risky_patient: true },
    })
  }

  // Pagination
  const rowPageOnValueChange = (rowsPerPage: 10 | 20 | 50 | 100) => {
    updateState({
      ...state,
      limit: rowsPerPage,
      offset: 0,
      filter: { ...(state.filter || {}), risky_patient: true },
    })
  }

  const pagNav = (nav: "prev" | "next") => {
    let newOffset = offset
    if (nav === "next" && next) {
      newOffset = offset + rowsPerPage
    } else if (nav === "prev" && previous) {
      newOffset = Math.max(0, offset - rowsPerPage)
    }
    updateState({
      ...state,
      offset: newOffset,
      filter: { ...(state.filter || {}), risky_patient: true },
    })
  }

  // Navigation vers le dossier médical du patient
  const handleViewMedicalRecord = (recordId: ID) => {
    if(!recordId) return
    // Rediriger vers la page du dossier médical du patient
    navigate(`/${role}/patients/medical-records/${recordId}`)
  }

  return (
    <div className="p-6 space-y-6">

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Liste des patients à risque</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between">
            <div className="flex items-center gap-2 w-full md:w-1/2">
              <div className="relative w-full">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Rechercher un patient à risque..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* Pas de filtre supplémentaire ici, mais tu peux en ajouter si besoin */}
            </div>
          </div>

          <div className="rounded-md border overflow-hidden min-h-[200px]">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <svg className="animate-spin h-8 w-8 text-red-600 mb-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                <span className="text-red-600 font-medium">Chargement des patients à risque...</span>
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
                    results.map((record: HealthRecord) => (
                      <TableRow key={record.patient.id}>
                        <TableCell className="font-medium">
                          {record.patient.numero_permis}
                        </TableCell>
                        <TableCell>
                          {anonymizeName(`${record.patient.first_name} ${record.patient.last_name}`)}
                        </TableCell>
                        <TableCell>
                          {record.patient.email ? record.patient.email : <span className="italic text-gray-400">Non renseigné</span>}
                        </TableCell>
                        <TableCell>{record.patient.phone_number}</TableCell>
                        <TableCell>{record.patient.type_permis}</TableCell>
                        <TableCell>{record.patient.service}</TableCell>
                        <TableCell className="text-right">
                          <Button size="sm" variant="outline" onClick={() => handleViewMedicalRecord(record.id)}>
                            <Eye className="h-4 w-4 mr-1" />
                            Voir le dossier
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                        Aucun patient à risque trouvé
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-500">
              Affichage de {count === 0 ? 0 : offset + 1} à {count === 0 ? 0 : Math.min(offset + rowsPerPage, count)} sur {count} patients à risque
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
    </div>
  )
}

export default function AtRiskPatientsLayout() {
  return (
    <MedicalRecordQueryResponseProvider >
      <AtRiskPatients />
    </MedicalRecordQueryResponseProvider>
  )
}
