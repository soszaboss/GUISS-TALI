import { Button } from "@/components/ui/button"
import { AlertTriangle, ArrowRight, CalendarClock, Gauge } from "lucide-react"
import { Link } from "react-router-dom"

// Données fictives pour les alertes
const alerts = [
  {
    id: "1",
    type: "calibration",
    message: "Le tonomètre doit être calibré avant demain",
    severity: "warning",
    time: "Il y a 2 heures",
  },
  {
    id: "2",
    type: "patient",
    message: "Score d'Esterman anormal pour Pierre Richard",
    severity: "high",
    time: "Il y a 30 minutes",
    patientId: "105",
  },
  {
    id: "3",
    type: "schedule",
    message: "Visite ajoutée pour aujourd'hui à 16:45",
    severity: "info",
    time: "Il y a 15 minutes",
  },
]

export function TechnicianAlerts() {
  return (
    <div className="space-y-4">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className={`flex items-start justify-between rounded-lg border p-3 shadow-sm ${
            alert.severity === "high"
              ? "border-red-200 bg-red-50"
              : alert.severity === "warning"
                ? "border-amber-200 bg-amber-50"
                : "border-blue-200 bg-blue-50"
          }`}
        >
          <div className="flex gap-3">
            <div
              className={`mt-0.5 rounded-full p-1.5 ${
                alert.severity === "high"
                  ? "bg-red-100 text-red-600"
                  : alert.severity === "warning"
                    ? "bg-amber-100 text-amber-600"
                    : "bg-blue-100 text-blue-600"
              }`}
            >
              {alert.type === "calibration" ? (
                <Gauge className="h-4 w-4" />
              ) : alert.type === "patient" ? (
                <AlertTriangle className="h-4 w-4" />
              ) : (
                <CalendarClock className="h-4 w-4" />
              )}
            </div>
            <div>
              <div className="font-medium">{alert.message}</div>
              <div className="text-xs text-muted-foreground">{alert.time}</div>
            </div>
          </div>
          {alert.type === "patient" && alert.patientId && (
            <Link to={`/technician/visits/${alert.patientId}`}>
              <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          )}
        </div>
      ))}
      <div className="flex justify-center pt-2">
        <Link to="/technician/alerts">
          <Button variant="link" size="sm" className="text-primary">
            Voir toutes les alertes
          </Button>
        </Link>
      </div>
    </div>
  )
}
