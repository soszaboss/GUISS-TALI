import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { CalendarIcon, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { useNavigate } from "react-router-dom"

// Types pour les patients
interface Patient {
  id: string
  name: string
}

// Liste fictive de patients
const patients: Patient[] = [
  { id: "1", name: "Jean Dupont" },
  { id: "2", name: "Marie Martin" },
  { id: "3", name: "Pierre Durand" },
  { id: "4", name: "Sophie Lefebvre" },
  { id: "5", name: "Thomas Bernard" },
]

// Types pour les rendez-vous
interface AppointmentData {
  patientId: string
  date: Date | undefined
  time: string
  type: string
  notes: string
}

// Types pour les props
interface AppointmentFormProps {
  onAppointmentCreated?: () => void
}

export function AppointmentForm({ onAppointmentCreated }: AppointmentFormProps) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<AppointmentData>({
    patientId: "",
    date: undefined,
    time: "",
    type: "",
    notes: "",
  })
  const [followUpDates, setFollowUpDates] = useState<Date[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Gestionnaire de changement pour les champs du formulaire
  const handleChange = (
    field: keyof AppointmentData,
    value: string | Date | undefined
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    // Si la date ou l'heure change, calculer les dates de suivi
    if ((field === "date" || field === "time") && formData.date && formData.time) {
      calculateFollowUpDates(field === "date" ? (value as Date) : formData.date, field === "time" ? (value as string) : formData.time)
    }
  }

  // Calculer les dates de suivi (15 jours et 30 jours après)
  const calculateFollowUpDates = (date: Date, timeString: string) => {
    if (!date || !timeString) return

    const [hours, minutes] = timeString.split(":").map(Number)

    // Premier rendez-vous de suivi (15 jours après)
    const followUp1 = new Date(date)
    followUp1.setDate(date.getDate() + 15)
    followUp1.setHours(hours, minutes)

    // Deuxième rendez-vous de suivi (30 jours après)
    const followUp2 = new Date(date)
    followUp2.setDate(date.getDate() + 30)
    followUp2.setHours(hours, minutes)

    setFollowUpDates([followUp1, followUp2])
  }

  // Gestionnaire de soumission du formulaire
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simuler l'enregistrement des rendez-vous
    setTimeout(() => {
      console.log("Rendez-vous principal:", formData)
      console.log("Rendez-vous de suivi:", followUpDates)

      // Réinitialiser le formulaire
      setFormData({
        patientId: "",
        date: undefined,
        time: "",
        type: "",
        notes: "",
      })
      setFollowUpDates([])
      setIsSubmitting(false)

      // Notifier le parent que le rendez-vous a été créé
      if (onAppointmentCreated) {
        onAppointmentCreated()
      }
    }, 1000)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="patient">Patient</Label>
            <Select value={formData.patientId} onValueChange={(value) => handleChange("patientId", value)} required>
              <SelectTrigger id="patient">
                <SelectValue placeholder="Sélectionner un patient" />
              </SelectTrigger>
              <SelectContent>
                {patients.map((patient) => (
                  <SelectItem key={patient.id} value={patient.id}>
                    {patient.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="date">Date du rendez-vous</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.date && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.date ? format(formData.date, "PPP", { locale: fr }) : <span>Sélectionner une date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.date}
                  onSelect={(date) => handleChange("date", date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <Label htmlFor="time">Heure du rendez-vous</Label>
            <div className="relative">
              <Clock className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                id="time"
                type="time"
                className="pl-10"
                value={formData.time}
                onChange={(e) => handleChange("time", e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="type">Type de rendez-vous</Label>
            <Select value={formData.type} onValueChange={(value) => handleChange("type", value)} required>
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
            <Label htmlFor="notes">Notes</Label>
            <textarea
              id="notes"
              className="w-full p-2 border rounded-md"
              rows={3}
              value={formData.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
            />
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-4">Rendez-vous de suivi automatiques</h3>
          <p className="text-sm text-gray-500 mb-4">
            Deux rendez-vous de suivi seront automatiquement programmés à 15 et 30 jours après le rendez-vous initial.
          </p>

          {formData.date && formData.time ? (
            <div className="space-y-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                    <div className="flex-1">
                      <p className="font-medium">Premier rendez-vous</p>
                      <p className="text-sm text-gray-500">
                        {format(formData.date, "PPP", { locale: fr })} à {formData.time}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {followUpDates.map((date, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-center">
                      <div
                        className={`w-3 h-3 rounded-full mr-2 ${index === 0 ? "bg-green-500" : "bg-purple-500"}`}
                      ></div>
                      <div className="flex-1">
                        <p className="font-medium">{index === 0 ? "Premier suivi" : "Deuxième suivi"}</p>
                        <p className="text-sm text-gray-500">
                          {format(date, "PPP", { locale: fr })} à {formData.time}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-40 border border-dashed rounded-md">
              <p className="text-gray-500">Sélectionnez une date et une heure pour voir les rendez-vous de suivi</p>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button variant="outline" type="button" onClick={() => navigate(-1)}>
          Annuler
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Enregistrement..." : "Enregistrer les rendez-vous"}
        </Button>
      </div>
    </form>
  )
}
