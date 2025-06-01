"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Eye, FileText, MoreHorizontal, Search, SlidersHorizontal } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Link } from "react-router-dom"

// Données fictives pour les patients
const patientsData = [
  {
    id: "P12345",
    name: "Jean Dupont",
    email: "jean.dupont@example.com",
    phone: "06 12 34 56 78",
    lastVisit: "15/05/2023",
    status: "Actif",
    category: "Conducteur professionnel",
  },
  {
    id: "P12346",
    name: "Marie Martin",
    email: "marie.martin@example.com",
    phone: "06 23 45 67 89",
    lastVisit: "22/04/2023",
    status: "En attente",
    category: "Conducteur particulier",
  },
  {
    id: "P12347",
    name: "Pierre Durand",
    email: "pierre.durand@example.com",
    phone: "06 34 56 78 90",
    lastVisit: "10/05/2023",
    status: "Actif",
    category: "Conducteur professionnel",
  },
  {
    id: "P12348",
    name: "Sophie Lefebvre",
    email: "sophie.lefebvre@example.com",
    phone: "06 45 67 89 01",
    lastVisit: "05/05/2023",
    status: "Inactif",
    category: "Conducteur particulier",
  },
  {
    id: "P12349",
    name: "Thomas Bernard",
    email: "thomas.bernard@example.com",
    phone: "06 56 78 90 12",
    lastVisit: "18/05/2023",
    status: "Actif",
    category: "Conducteur professionnel",
  },
  {
    id: "P12350",
    name: "Camille Petit",
    email: "camille.petit@example.com",
    phone: "06 67 89 01 23",
    lastVisit: "12/04/2023",
    status: "En attente",
    category: "Conducteur particulier",
  },
  {
    id: "P12351",
    name: "Lucas Moreau",
    email: "lucas.moreau@example.com",
    phone: "06 78 90 12 34",
    lastVisit: "20/05/2023",
    status: "Actif",
    category: "Conducteur professionnel",
  },
  {
    id: "P12352",
    name: "Emma Dubois",
    email: "emma.dubois@example.com",
    phone: "06 89 01 23 45",
    lastVisit: "08/05/2023",
    status: "Actif",
    category: "Conducteur particulier",
  },
]

export default function AdminPatientsList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")

  // Filtrer les patients en fonction des critères de recherche et des filtres
  const filteredPatients = patientsData.filter((patient) => {
    const matchesSearch =
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.id.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || patient.status === statusFilter
    const matchesCategory = categoryFilter === "all" || patient.category === categoryFilter

    return matchesSearch && matchesStatus && matchesCategory
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Gestion des patients</h1>
        <p className="text-muted-foreground">Consultez et gérez tous les patients enregistrés sur la plateforme</p>
      </div>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
          <CardTitle>Liste des patients</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Rechercher un patient..."
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
                  <SelectItem value="Actif">Actif</SelectItem>
                  <SelectItem value="En attente">En attente</SelectItem>
                  <SelectItem value="Inactif">Inactif</SelectItem>
                </SelectContent>
              </Select>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Catégorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les catégories</SelectItem>
                  <SelectItem value="Conducteur professionnel">Conducteur professionnel</SelectItem>
                  <SelectItem value="Conducteur particulier">Conducteur particulier</SelectItem>
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
                  <TableHead>ID</TableHead>
                  <TableHead>Nom</TableHead>
                  <TableHead className="hidden md:table-cell">Email</TableHead>
                  <TableHead className="hidden md:table-cell">Téléphone</TableHead>
                  <TableHead className="hidden md:table-cell">Dernière visite</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Catégorie</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPatients.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell className="font-medium">{patient.id}</TableCell>
                    <TableCell>{patient.name}</TableCell>
                    <TableCell className="hidden md:table-cell">{patient.email}</TableCell>
                    <TableCell className="hidden md:table-cell">{patient.phone}</TableCell>
                    <TableCell className="hidden md:table-cell">{patient.lastVisit}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          patient.status === "Actif"
                            ? "default"
                            : patient.status === "En attente"
                              ? "outline"
                              : "secondary"
                        }
                      >
                        {patient.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{patient.category}</TableCell>
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
                            <Link to={`/admin/patients/${patient.id}`} className="flex items-center">
                              <Eye className="mr-2 h-4 w-4" />
                              <span>Voir le profil</span>
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Link to={`/admin/medical-records/${patient.id}`} className="flex items-center">
                              <FileText className="mr-2 h-4 w-4" />
                              <span>Voir la fiche médicale</span>
                            </Link>
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
              Affichage de {filteredPatients.length} sur {patientsData.length} patients
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
