import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Calendar, CheckCircle, Clock, Eye, Search } from "lucide-react"
import { Link } from "react-router-dom"

const visits = [
  {
    id: "101",
    patient: "Martin Dupont",
    date: "2023-05-15",
    status: "completed",
  },
  {
    id: "102",
    patient: "Sophie Martin",
    date: "2023-05-14",
    status: "completed",
  },
  {
    id: "103",
    patient: "Jean Dujardin",
    date: "2023-05-12",
    status: "completed",
  },
  {
    id: "104",
    patient: "Marie Curie",
    date: "2023-05-10",
    status: "completed",
  },
  {
    id: "105",
    patient: "Pierre Richard",
    date: "2023-05-08",
    status: "completed",
  },
  {
    id: "106",
    patient: "Amélie Poulain",
    date: "2023-05-05",
    status: "completed",
  },
  {
    id: "107",
    patient: "Luc Besson",
    date: "2023-05-03",
    status: "completed",
  },
  {
    id: "108",
    patient: "Juliette Binoche",
    date: "2023-05-02",
    status: "completed",
  },
  {
    id: "109",
    patient: "Vincent Cassel",
    date: "2023-04-28",
    status: "completed",
  },
  {
    id: "110",
    patient: "Audrey Tautou",
    date: "2023-04-25",
    status: "completed",
  },
]

export function TechnicianHistoryPage() {
  const [statusFilter, setStatusFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredVisits = visits.filter((visit) => {
    const matchesStatus = statusFilter === "all" || visit.status === statusFilter
    const matchesSearch = visit.patient.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesSearch
  })

  return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Historique des visites</h1>

        <Card>
          <div className="p-4 flex flex-col md:flex-row gap-4">
            <div className="flex-1 flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Rechercher un patient..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-gray-500" />
                <Input type="date" className="w-auto" />
              </div>
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="completed">Complété</SelectItem>
                <SelectItem value="submitted">Soumis</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVisits.map((visit) => (
                <TableRow key={visit.id}>
                  <TableCell className="font-medium">{visit.patient}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                      {new Date(visit.date).toLocaleDateString("fr-FR")}
                    </div>
                  </TableCell>
                  <TableCell>
                    {visit.status === "completed" && (
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                        <CheckCircle className="h-3.5 w-3.5 mr-1" />
                        Complété
                      </Badge>
                    )}
                    {visit.status === "submitted" && (
                      <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                        <Clock className="h-3.5 w-3.5 mr-1" />
                        Soumis
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Link to={`/technician/visits/${visit.id}`}>
                      <Button variant="ghost" size="sm" className="text-gray-500">
                        <Eye className="h-4 w-4 mr-1" />
                        Voir
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
  )
}
