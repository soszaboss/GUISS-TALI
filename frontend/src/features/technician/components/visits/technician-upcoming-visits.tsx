import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Clock, Eye } from "lucide-react"
import { Link } from "react-router-dom"

// Données fictives pour les visites à venir
const upcomingVisits = [
  {
    id: "1",
    patientName: "Marie Curie",
    patientId: "104",
    time: "13:45",
    type: "Examen de la vue",
  },
  {
    id: "2",
    patientName: "Pierre Richard",
    patientId: "105",
    time: "14:30",
    type: "Tonométrie",
  },
  {
    id: "3",
    patientName: "Amélie Poulain",
    patientId: "106",
    time: "15:15",
    type: "Examen du champ visuel",
  },
]

export function TechnicianUpcomingVisits() {
  return (
    <div className="space-y-4">
      {upcomingVisits.map((visit) => (
        <div
          key={visit.id}
          className="flex items-center justify-between rounded-lg border p-3 shadow-sm transition-all hover:bg-accent/20"
        >
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={`/placeholder.svg?height=40&width=40`} alt={visit.patientName} />
              <AvatarFallback>{visit.patientName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{visit.patientName}</div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>{visit.time}</span>
                <span>•</span>
                <span>{visit.type}</span>
              </div>
            </div>
          </div>
          <Link to={`/technician/visits/${visit.id}`}>
            <Button size="sm" variant="outline">
              <Eye className="mr-1 h-3.5 w-3.5" />
              Accéder
            </Button>
          </Link>
        </div>
      ))}
      <div className="flex justify-center pt-2">
        <Link to="/technician/visits">
          <Button variant="link" size="sm" className="text-primary">
            Voir toutes les visites
          </Button>
        </Link>
      </div>
    </div>
  )
}
