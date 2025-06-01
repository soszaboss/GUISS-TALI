import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Eye, FileEdit } from "lucide-react"
import { Link } from "react-router-dom"

// Données fictives pour le tableau des visites
const visits = [
  {
    id: "1",
    patientName: "Jean Dupont",
    patientId: "101",
    date: "2023-06-14",
    time: "09:30",
    type: "Examen de la vue",
    status: "completed",
  },
  {
    id: "2",
    patientName: "Marie Martin",
    patientId: "102",
    date: "2023-06-14",
    time: "11:00",
    type: "Tonométrie",
    status: "completed",
  },
  {
    id: "3",
    patientName: "Pierre Durand",
    patientId: "103",
    date: "2023-06-13",
    time: "14:15",
    type: "Examen du champ visuel",
    status: "pending",
  },
  {
    id: "4",
    patientName: "Sophie Lefebvre",
    patientId: "104",
    date: "2023-06-13",
    time: "16:00",
    type: "Examen de la vue",
    status: "completed",
  },
  {
    id: "5",
    patientName: "Lucas Bernard",
    patientId: "105",
    date: "2023-06-12",
    time: "10:30",
    type: "Tonométrie",
    status: "completed",
  },
]

export function TechnicianVisitsTable() {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Patient</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Heure</TableHead>
            <TableHead>Type d'examen</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {visits.map((visit) => (
            <TableRow key={visit.id}>
              <TableCell className="font-medium">
                <div>{visit.patientName}</div>
                <div className="text-xs text-muted-foreground">ID: {visit.patientId}</div>
              </TableCell>
              <TableCell>{visit.date}</TableCell>
              <TableCell>{visit.time}</TableCell>
              <TableCell>{visit.type}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    visit.status === "completed" ? "default" : visit.status === "pending" ? "outline" : "secondary"
                  }
                >
                  {visit.status === "completed" ? "Complété" : visit.status === "pending" ? "En attente" : "Annulé"}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <Link to={`/technician/visits/${visit.id}`}>
                    <Button size="icon" variant="ghost">
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">Voir détails</span>
                    </Button>
                  </Link>
                  {visit.status === "pending" && (
                    <Link to={`/technician/visits/${visit.id}`}>
                      <Button size="icon" variant="ghost">
                        <FileEdit className="h-4 w-4" />
                        <span className="sr-only">Modifier</span>
                      </Button>
                    </Link>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
