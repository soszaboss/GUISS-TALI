import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Download, Eye, FileText, MoreHorizontal, Printer, Search, SlidersHorizontal } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Link } from "react-router-dom"

// Données fictives pour les fiches médicales
const medicalRecordsData = [
  {
    id: "MR12345",
    patientId: "P12345",
    patientName: "Jean Dupont",
    dateCreated: "15/05/2023",
    lastUpdated: "15/05/2023",
    status: "Complet",
    visionStatus: "Compatible",
    category: "Conducteur professionnel",
  },
  {
    id: "MR12346",
    patientId: "P12346",
    patientName: "Marie Martin",
    dateCreated: "22/04/2023",
    lastUpdated: "22/04/2023",
    status: "Incomplet",
    visionStatus: "En attente",
    category: "Conducteur particulier",
  },
  {
    id: "MR12347",
    patientId: "P12347",
    patientName: "Pierre Durand",
    dateCreated: "10/05/2023",
    lastUpdated: "12/05/2023",
    status: "Complet",
    visionStatus: "Compatible avec restrictions",
    category: "Conducteur professionnel",
  },
  {
    id: "MR12348",
    patientId: "P12348",
    patientName: "Sophie Lefebvre",
    dateCreated: "05/05/2023",
    lastUpdated: "05/05/2023",
    status: "Complet",
    visionStatus: "Incompatible",
    category: "Conducteur particulier",
  },
  {
    id: "MR12349",
    patientId: "P12349",
    patientName: "Thomas Bernard",
    dateCreated: "18/05/2023",
    lastUpdated: "18/05/2023",
    status: "Complet",
    visionStatus: "Compatible",
    category: "Conducteur professionnel",
  },
  {
    id: "MR12350",
    patientId: "P12350",
    patientName: "Camille Petit",
    dateCreated: "12/04/2023",
    lastUpdated: "12/04/2023",
    status: "Incomplet",
    visionStatus: "En attente",
    category: "Conducteur particulier",
  },
  {
    id: "MR12351",
    patientId: "P12351",
    patientName: "Lucas Moreau",
    dateCreated: "20/05/2023",
    lastUpdated: "20/05/2023",
    status: "Complet",
    visionStatus: "Compatible",
    category: "Conducteur professionnel",
  },
  {
    id: "MR12352",
    patientId: "P12352",
    patientName: "Emma Dubois",
    dateCreated: "08/05/2023",
    lastUpdated: "10/05/2023",
    status: "Complet",
    visionStatus: "Compatible avec restrictions",
    category: "Conducteur particulier",
  },
]

export default function AdminMedicalRecordsList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [visionFilter, setVisionFilter] = useState("all")

  // Filtrer les fiches médicales en fonction des critères de recherche et des filtres
  const filteredRecords = medicalRecordsData.filter((record) => {
    const matchesSearch =
      record.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.patientId.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || record.status === statusFilter
    const matchesVision = visionFilter === "all" || record.visionStatus === visionFilter

    return matchesSearch && matchesStatus && matchesVision
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Fiches médicales</h1>
        <p className="text-muted-foreground">Consultez et gérez toutes les fiches médicales des patients</p>
      </div>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
          <CardTitle>Liste des fiches médicales</CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Exporter
            </Button>
            <Button variant="default" size="sm">
              <Eye className="h-4 w-4 mr-2" />
              Voir les statistiques
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Rechercher une fiche..."
                className="pl-8 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="Complet">Complet</SelectItem>
                  <SelectItem value="Incomplet">Incomplet</SelectItem>
                </SelectContent>
              </Select>
              <Select value={visionFilter} onValueChange={setVisionFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Statut vision" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  <SelectItem value="Compatible">Compatible</SelectItem>
                  <SelectItem value="Compatible avec restrictions">Avec restrictions</SelectItem>
                  <SelectItem value="Incompatible">Incompatible</SelectItem>
                  <SelectItem value="En attente">En attente</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <SlidersHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID Fiche</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead className="hidden md:table-cell">Date création</TableHead>
                  <TableHead className="hidden md:table-cell">Dernière mise à jour</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Vision</TableHead>
                  <TableHead className="hidden md:table-cell">Catégorie</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">{record.id}</TableCell>
                    <TableCell>
                      <div className="font-medium">{record.patientName}</div>
                      <div className="text-xs text-muted-foreground">{record.patientId}</div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{record.dateCreated}</TableCell>
                    <TableCell className="hidden md:table-cell">{record.lastUpdated}</TableCell>
                    <TableCell>
                      <Badge variant={record.status === "Complet" ? "default" : "outline"}>{record.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          record.visionStatus === "Compatible"
                            ? "default"
                            : record.visionStatus === "Compatible avec restrictions"
                              ? "secondary"
                              : record.visionStatus === "Incompatible"
                                ? "destructive"
                                : "outline"
                        }
                      >
                        {record.visionStatus}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{record.category}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Link to={`/admin/medical-records/${record.id}`} className="flex items-center">
                              <Eye className="mr-2 h-4 w-4" />
                              <span>Voir la fiche</span>
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Link to={`/admin/patients/${record.patientId}`} className="flex items-center">
                              <FileText className="mr-2 h-4 w-4" />
                              <span>Voir le patient</span>
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <div className="flex items-center">
                              <Printer className="mr-2 h-4 w-4" />
                              <span>Imprimer</span>
                            </div>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Affichage de {filteredRecords.length} sur {medicalRecordsData.length} fiches médicales
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" disabled>
                Précédent
              </Button>
              <Button variant="outline" size="sm">
                Suivant
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
