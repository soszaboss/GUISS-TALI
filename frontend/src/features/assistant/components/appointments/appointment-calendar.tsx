import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent } from "@/components/ui/card"

export function AppointmentCalendar() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [appointments, setAppointments] = useState([
    {
      id: "1",
      patientName: "Jean Dupont",
      time: "09:00",
      type: "Consultation",
    },
    {
      id: "2",
      patientName: "Marie Martin",
      time: "10:30",
      type: "Suivi",
    },
    {
      id: "3",
      patientName: "Pierre Durand",
      time: "14:00",
      type: "Examen",
    },
  ])

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-1">
        <Card>
          <CardContent className="p-4">
            <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md border" />
          </CardContent>
        </Card>
      </div>
      <div className="md:col-span-2">
        <Card>
          <CardContent className="p-4">
            <h2 className="text-xl font-semibold mb-4">
              Rendez-vous du {date?.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
            </h2>
            {appointments.length === 0 ? (
              <p className="text-gray-500">Aucun rendez-vous pour cette date</p>
            ) : (
              <div className="space-y-4">
                {appointments.map((appointment) => (
                  <div key={appointment.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">{appointment.patientName}</h3>
                        <p className="text-sm text-gray-500">{appointment.type}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{appointment.time}</p>
                        <div className="flex space-x-2 mt-2">
                          <button className="text-blue-500 hover:text-blue-700 text-sm">Détails</button>
                          <button className="text-red-500 hover:text-red-700 text-sm">Annuler</button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
