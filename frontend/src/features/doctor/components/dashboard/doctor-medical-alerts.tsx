import { AlertTriangle, Clock, Eye } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

export function DoctorMedicalAlerts() {
  // Ces données seraient normalement récupérées depuis une API
  const alerts = [
    {
      id: 1,
      type: "technical",
      patient: "Jean Dupont",
      message: "Visite bloquée - données techniques manquantes",
      icon: Clock,
      color: "text-amber-500 bg-amber-100",
      action: "Vérifier",
      link: "/doctor/patients/1/medical-record",
      severity: "medium",
    },
    {
      id: 2,
      type: "risk",
      patient: "Marie Martin",
      message: "Patient à risque - antécédents cardiaques sévères",
      icon: AlertTriangle,
      color: "text-red-500 bg-red-100",
      action: "Consulter",
      link: "/doctor/patients/2/medical-record",
      severity: "high",
    },
    {
      id: 3,
      type: "followup",
      patient: "Pierre Durand",
      message: "Suivi requis - vision détériorée depuis la dernière visite",
      icon: Eye,
      color: "text-blue-500 bg-blue-100",
      action: "Revoir",
      link: "/doctor/patients/3/medical-record",
      severity: "low",
    },
  ]

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center">
          <AlertTriangle className="h-4 w-4 mr-2 text-amber-500" />
          Alertes médicales
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-3 rounded-lg border-l-4 ${
                alert.severity === "high"
                  ? "border-red-500 bg-red-50"
                  : alert.severity === "medium"
                    ? "border-amber-500 bg-amber-50"
                    : "border-blue-500 bg-blue-50"
              }`}
            >
              <div className="flex items-start">
                <div className={`p-1.5 rounded-full mr-3 ${alert.color}`}>
                  <alert.icon className="h-3.5 w-3.5" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-sm">{alert.patient}</h4>
                  <p className="text-xs text-gray-600 mt-0.5">{alert.message}</p>
                </div>
              </div>
              <div className="mt-2 flex justify-end">
                <Button size="sm" variant="ghost" className="h-7 text-xs px-2" asChild>
                  <Link to={alert.link}>{alert.action}</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
