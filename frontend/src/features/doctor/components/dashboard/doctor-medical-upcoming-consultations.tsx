import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, User } from "lucide-react"
import { Link } from "react-router-dom"

export function DoctorMedicalUpcomingConsultations() {
  // Ces données seraient normalement récupérées depuis une API
  const upcomingConsultations = [
    {
      id: 1,
      patient: "Jean Dupont",
      time: "10:00",
      date: "Aujourd'hui",
      type: "Première visite",
      status: "confirmed",
    },
    {
      id: 2,
      patient: "Marie Martin",
      time: "11:30",
      date: "Aujourd'hui",
      type: "Suivi",
      status: "confirmed",
    },
    {
      id: 3,
      patient: "Pierre Durand",
      time: "14:15",
      date: "Aujourd'hui",
      type: "Contrôle annuel",
      status: "pending",
    },
  ]

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">Consultations à venir</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          {upcomingConsultations.map((consultation) => (
            <div
              key={consultation.id}
              className={`flex items-center p-3 rounded-lg border-l-4 ${
                consultation.status === "confirmed" ? "border-green-500 bg-green-50" : "border-amber-500 bg-amber-50"
              }`}
            >
              <div className="flex-1">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2 text-gray-500" />
                  <h4 className="font-medium">{consultation.patient}</h4>
                </div>
                <div className="flex items-center text-sm text-gray-600 mt-1">
                  <Clock className="h-3.5 w-3.5 mr-1" />
                  <span>
                    {consultation.date} • {consultation.time}
                  </span>
                </div>
                <div className="text-xs text-gray-500 mt-1">{consultation.type}</div>
              </div>
              <Button size="sm" variant="ghost" className="h-8 px-2" asChild>
                <Link to={`/doctor/patients/${consultation.id}/medical-record`}>
                  <span className="sr-only">Consulter</span>
                  <Calendar className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          ))}
        </div>
        <div className="mt-4 text-center">
          <Button variant="outline" size="sm" asChild className="w-full">
            <Link to="/doctor/consultations">Voir toutes les consultations</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
