"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit, FileText } from "lucide-react"

export function UpcomingAppointments() {
  // Données fictives pour la démo
  const upcomingAppointments = [
    {
      id: "1",
      patientName: "Jean Dupont",
      doctorName: "Dr. Emma Rousseau",
      date: "16 mai 2023",
      time: "09:00 - 09:30",
      type: "Consultation",
      status: "confirmed",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "2",
      patientName: "Marie Martin",
      doctorName: "Dr. Thomas Petit",
      date: "16 mai 2023",
      time: "10:30 - 11:00",
      type: "Suivi",
      status: "confirmed",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "3",
      patientName: "Pierre Durand",
      doctorName: "Dr. Julie Moreau",
      date: "16 mai 2023",
      time: "14:00 - 14:30",
      type: "Examen",
      status: "pending",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "4",
      patientName: "Sophie Lefebvre",
      doctorName: "Dr. Nicolas Lambert",
      date: "17 mai 2023",
      time: "11:00 - 11:30",
      type: "Consultation",
      status: "confirmed",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "5",
      patientName: "Lucas Bernard",
      doctorName: "Dr. Emma Rousseau",
      date: "17 mai 2023",
      time: "15:30 - 16:00",
      type: "Suivi",
      status: "confirmed",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ]

  return (
    <div className="space-y-4">
      {upcomingAppointments.map((appointment) => (
        <div key={appointment.id} className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage src={appointment.avatar || "/placeholder.svg"} alt={appointment.patientName} />
              <AvatarFallback>{appointment.patientName.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{appointment.patientName}</p>
              <p className="text-xs text-gray-500">{appointment.doctorName}</p>
              <div className="flex items-center space-x-2">
                <p className="text-xs text-gray-400">
                  {appointment.date} • {appointment.time}
                </p>
                <Badge
                  variant="outline"
                  className={
                    appointment.status === "confirmed"
                      ? "bg-green-50 text-green-700 border-green-200"
                      : "bg-amber-50 text-amber-700 border-amber-200"
                  }
                >
                  {appointment.status === "confirmed" ? "Confirmé" : "En attente"}
                </Badge>
              </div>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button size="sm" variant="ghost">
              <FileText className="h-4 w-4" />
              <span className="sr-only">Voir les détails</span>
            </Button>
            <Button size="sm" variant="ghost">
              <Edit className="h-4 w-4" />
              <span className="sr-only">Modifier</span>
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
