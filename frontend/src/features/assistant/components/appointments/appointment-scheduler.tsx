import { useState, useEffect } from "react"
import { Calendar, momentLocalizer, type View } from "react-big-calendar"
import moment from "moment"
import "react-big-calendar/lib/css/react-big-calendar.css"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Configuration du localisateur pour le calendrier
moment.locale("fr")
const localizer = momentLocalizer(moment)

// Types pour les rendez-vous
interface Appointment {
  id: string
  title: string
  start: Date
  end: Date
  patientId: string
  patientName: string
  type: string
  status: "scheduled" | "completed" | "cancelled"
  notes?: string
}

// Fonction pour générer des rendez-vous fictifs
const generateAppointments = (): Appointment[] => {
  const today = new Date()
  const appointments: Appointment[] = []

  // Générer des rendez-vous pour les 7 prochains jours
  for (let i = 0; i < 20; i++) {
    const startDate = new Date(today)
    startDate.setDate(today.getDate() - 3 + Math.floor(Math.random() * 10))
    startDate.setHours(9 + Math.floor(Math.random() * 8), Math.floor(Math.random() * 4) * 15, 0)

    const endDate = new Date(startDate)
    endDate.setMinutes(startDate.getMinutes() + 30 + Math.floor(Math.random() * 4) * 15)

    const types = ["Consultation", "Suivi", "Examen", "Urgence"]
    const statuses: ("scheduled" | "completed" | "cancelled")[] = ["scheduled", "completed", "cancelled"]
    const patientNames = [
      "Jean Dupont",
      "Marie Martin",
      "Pierre Durand",
      "Sophie Lefebvre",
      "Thomas Bernard",
      "Camille Petit",
      "Lucas Moreau",
    ]

    appointments.push({
      id: `appt-${i}`,
      title: `RDV: ${patientNames[Math.floor(Math.random() * patientNames.length)]}`,
      start: startDate,
      end: endDate,
      patientId: `patient-${Math.floor(Math.random() * 10) + 1}`,
      patientName: patientNames[Math.floor(Math.random() * patientNames.length)],
      type: types[Math.floor(Math.random() * types.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      notes: Math.random() > 0.5 ? "Notes importantes concernant ce rendez-vous." : undefined,
    })
  }

  return appointments
}

// Fonction pour obtenir la couleur en fonction du type de rendez-vous
const getAppointmentColor = (type: string): string => {
  switch (type) {
    case "Consultation":
      return "bg-blue-100 border-blue-300 text-blue-800"
    case "Suivi":
      return "bg-green-100 border-green-300 text-green-800"
    case "Examen":
      return "bg-purple-100 border-purple-300 text-purple-800"
    case "Urgence":
      return "bg-red-100 border-red-300 text-red-800"
    default:
      return "bg-gray-100 border-gray-300 text-gray-800"
  }
}

export function AppointmentScheduler() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [editedAppointment, setEditedAppointment] = useState<Partial<Appointment>>({})
  const [calendarView, setCalendarView] = useState<View>("month");
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    // Charger les rendez-vous fictifs
    const loadedAppointments = generateAppointments()
    setAppointments(loadedAppointments)
  }, [])

  // Gestionnaire d'événements pour l'affichage des détails d'un rendez-vous
  const handleSelectEvent = (event: Appointment) => {
    setSelectedAppointment(event)
    setIsDialogOpen(true)
    setIsEditMode(false)
  }

  // Gestionnaire pour l'édition d'un rendez-vous
  const handleEditAppointment = () => {
    setIsEditMode(true)
    setEditedAppointment({ ...selectedAppointment })
  }

  // Gestionnaire pour la sauvegarde des modifications
  const handleSaveChanges = () => {
    if (selectedAppointment && editedAppointment) {
      const updatedAppointments = appointments.map((appt) =>
        appt.id === selectedAppointment.id ? { ...selectedAppointment, ...editedAppointment } : appt,
      )
      setAppointments(updatedAppointments)
      setSelectedAppointment({ ...selectedAppointment, ...editedAppointment })
      setIsEditMode(false)
    }
  }

  // Gestionnaire pour l'annulation d'un rendez-vous
  const handleCancelAppointment = () => {
    if (selectedAppointment) {
      const updatedAppointments = appointments.map((appt) =>
        appt.id === selectedAppointment.id ? { ...appt, status: "cancelled" } : appt,
      )
      setAppointments(updatedAppointments)
      setSelectedAppointment({ ...selectedAppointment, status: "cancelled" })
    }
  }

  // Composant personnalisé pour l'affichage des événements dans le calendrier
  const EventComponent = ({ event }: { event: Appointment }) => (
    <div className={`p-1 rounded border ${getAppointmentColor(event.type)}`}>
      <div className="font-medium text-sm truncate">{event.title}</div>
      <div className="text-xs">{event.type}</div>
    </div>
  )

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 mb-4">
        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Consultation</Badge>
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Suivi</Badge>
        <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">Examen</Badge>
        <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Urgence</Badge>
      </div>

      <Card>
        <CardContent className="p-4">
          <div style={{ height: 700, width: "100%" }}>
            <Calendar
              view={calendarView}
              onView={setCalendarView}
              date={currentDate}
              onNavigate={setCurrentDate}
              style={{ height: "100%" }}
              localizer={localizer}
              events={appointments}
              startAccessor="start"
              endAccessor="end"
              onSelectEvent={handleSelectEvent}
              components={{
                event: EventComponent,
              }}
              formats={{
                dayHeaderFormat: (date) =>
                  moment(date).format("dddd DD MMMM").charAt(0).toUpperCase() +
                  moment(date).format("dddd DD MMMM").slice(1),
                dayRangeHeaderFormat: ({ start, end }) =>
                  `${moment(start).format("DD MMMM")} - ${moment(end).format("DD MMMM YYYY")}`,
              }}
              messages={{
                today: "Aujourd'hui",
                previous: "Précédent",
                next: "Suivant",
                month: "Mois",
                week: "Semaine",
                day: "Jour",
                agenda: "Agenda",
                date: "Date",
                time: "Heure",
                event: "Événement",
                noEventsInRange: "Aucun rendez-vous dans cette période",
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Dialogue pour afficher/modifier les détails d'un rendez-vous */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{isEditMode ? "Modifier le rendez-vous" : "Détails du rendez-vous"}</DialogTitle>
          </DialogHeader>

          {selectedAppointment && !isEditMode && (
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Patient</h3>
                <p>{selectedAppointment.patientName}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium">Date</h3>
                  <p>{moment(selectedAppointment.start).format("DD/MM/YYYY")}</p>
                </div>
                <div>
                  <h3 className="font-medium">Heure</h3>
                  <p>
                    {moment(selectedAppointment.start).format("HH:mm")} -{" "}
                    {moment(selectedAppointment.end).format("HH:mm")}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium">Type</h3>
                  <Badge className={getAppointmentColor(selectedAppointment.type)}>{selectedAppointment.type}</Badge>
                </div>
                <div>
                  <h3 className="font-medium">Statut</h3>
                  <Badge
                    className={
                      selectedAppointment.status === "scheduled"
                        ? "bg-blue-100 text-blue-800"
                        : selectedAppointment.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                    }
                  >
                    {selectedAppointment.status === "scheduled"
                      ? "Programmé"
                      : selectedAppointment.status === "completed"
                        ? "Terminé"
                        : "Annulé"}
                  </Badge>
                </div>
              </div>

              {selectedAppointment.notes && (
                <div>
                  <h3 className="font-medium">Notes</h3>
                  <p className="text-gray-700">{selectedAppointment.notes}</p>
                </div>
              )}
            </div>
          )}

          {selectedAppointment && isEditMode && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="patient">Patient</Label>
                <Input
                  id="patient"
                  value={editedAppointment.patientName || ""}
                  onChange={(e) => setEditedAppointment({ ...editedAppointment, patientName: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={moment(editedAppointment.start).format("YYYY-MM-DD")}
                    onChange={(e) => {
                      const newDate = moment(e.target.value).format("YYYY-MM-DD")
                      const currentTime = moment(editedAppointment.start).format("HH:mm")
                      const newStart = moment(`${newDate} ${currentTime}`).toDate()
                      const newEnd = new Date(newStart)
                      newEnd.setMinutes(newStart.getMinutes() + 30)
                      setEditedAppointment({ ...editedAppointment, start: newStart, end: newEnd })
                    }}
                  />
                </div>
                <div>
                  <Label htmlFor="time">Heure</Label>
                  <Input
                    id="time"
                    type="time"
                    value={moment(editedAppointment.start).format("HH:mm")}
                    onChange={(e) => {
                      const currentDate = moment(editedAppointment.start).format("YYYY-MM-DD")
                      const newTime = e.target.value
                      const newStart = moment(`${currentDate} ${newTime}`).toDate()
                      const newEnd = new Date(newStart)
                      newEnd.setMinutes(newStart.getMinutes() + 30)
                      setEditedAppointment({ ...editedAppointment, start: newStart, end: newEnd })
                    }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="type">Type</Label>
                  <Select
                    value={editedAppointment.type}
                    onValueChange={(value) => setEditedAppointment({ ...editedAppointment, type: value })}
                  >
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Sélectionner un type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Consultation">Consultation</SelectItem>
                      <SelectItem value="Suivi">Suivi</SelectItem>
                      <SelectItem value="Examen">Examen</SelectItem>
                      <SelectItem value="Urgence">Urgence</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="status">Statut</Label>
                  <Select
                    value={editedAppointment.status}
                    onValueChange={(value: "scheduled" | "completed" | "cancelled") =>
                      setEditedAppointment({ ...editedAppointment, status: value })
                    }
                  >
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Sélectionner un statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="scheduled">Programmé</SelectItem>
                      <SelectItem value="completed">Terminé</SelectItem>
                      <SelectItem value="cancelled">Annulé</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="notes">Notes</Label>
                <textarea
                  id="notes"
                  className="w-full p-2 border rounded-md"
                  rows={3}
                  value={editedAppointment.notes || ""}
                  onChange={(e) => setEditedAppointment({ ...editedAppointment, notes: e.target.value })}
                />
              </div>
            </div>
          )}

          <DialogFooter className="flex justify-between">
            {!isEditMode ? (
              <>
                <div>
                  {selectedAppointment?.status !== "cancelled" && (
                    <Button variant="destructive" onClick={handleCancelAppointment}>
                      Annuler le rendez-vous
                    </Button>
                  )}
                </div>
                <div className="space-x-2">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Fermer
                  </Button>
                  {selectedAppointment?.status !== "cancelled" && (
                    <Button onClick={handleEditAppointment}>Modifier</Button>
                  )}
                </div>
              </>
            ) : (
              <div className="flex justify-end w-full space-x-2">
                <Button variant="outline" onClick={() => setIsEditMode(false)}>
                  Annuler
                </Button>
                <Button onClick={handleSaveChanges}>Enregistrer</Button>
              </div>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
