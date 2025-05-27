import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Calendar, FileText } from "lucide-react"

export function RecentPatients() {
  // Données fictives pour la démo
  const recentPatients = [
    {
      id: "1",
      name: "Jean Dupont",
      email: "jean.dupont@example.com",
      dateRegistered: "15 mai 2023",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "2",
      name: "Marie Martin",
      email: "marie.martin@example.com",
      dateRegistered: "14 mai 2023",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "3",
      name: "Pierre Durand",
      email: "pierre.durand@example.com",
      dateRegistered: "12 mai 2023",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "4",
      name: "Sophie Lefebvre",
      email: "sophie.lefebvre@example.com",
      dateRegistered: "10 mai 2023",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "5",
      name: "Lucas Bernard",
      email: "lucas.bernard@example.com",
      dateRegistered: "8 mai 2023",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ]

  return (
    <div className="space-y-4">
      {recentPatients.map((patient) => (
        <div key={patient.id} className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage src={patient.avatar || "/placeholder.svg"} alt={patient.name} />
              <AvatarFallback>{patient.name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{patient.name}</p>
              <p className="text-xs text-gray-500">{patient.email}</p>
              <p className="text-xs text-gray-400">Inscrit le {patient.dateRegistered}</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button size="sm" variant="ghost">
              <FileText className="h-4 w-4" />
              <span className="sr-only">Voir le dossier</span>
            </Button>
            <Button size="sm" variant="ghost">
              <Calendar className="h-4 w-4" />
              <span className="sr-only">Planifier un rendez-vous</span>
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
