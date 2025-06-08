import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Clock, Shield, User } from "lucide-react"
import { Link } from "react-router-dom"

// Données fictives pour les alertes
const alertsData = [
  {
    id: 1,
    type: "critical",
    title: "Cas critique détecté",
    description: "Patient #12458 - Vision incompatible détectée",
    time: "Il y a 35 minutes",
    icon: <AlertTriangle className="h-4 w-4 text-red-500" />,
  },
  {
    id: 2,
    type: "pending",
    title: "Validation en attente",
    description: "5 examens techniques en attente de validation médicale",
    time: "Depuis plus de 24h",
    icon: <Clock className="h-4 w-4 text-amber-500" />,
  },
  {
    id: 3,
    type: "security",
    title: "Alerte de sécurité",
    description: "Tentative de connexion suspecte détectée",
    time: "Il y a 2 heures",
    icon: <Shield className="h-4 w-4 text-red-500" />,
  },
  {
    id: 4,
    type: "user",
    title: "Nouvel utilisateur",
    description: "Dr. Martin a été ajouté comme médecin",
    time: "Il y a 4 heures",
    icon: <User className="h-4 w-4 text-green-500" />,
  },
  {
    id: 5,
    type: "pending",
    title: "Rappel",
    description: "Rapport mensuel à générer avant le 30/05",
    time: "Échéance dans 3 jours",
    icon: <Clock className="h-4 w-4 text-blue-500" />,
  },
]

export default function AdminAlerts() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg font-medium">Alertes & Rappels</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5 overflow-auto max-h-[600px] p-5">
        {alertsData.map((alert) => (
          <div
            key={alert.id}
            className="flex items-start space-x-4 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <div className="mt-0.5">{alert.icon}</div>
            <div className="space-y-1 flex-1">
              <div className="flex items-center justify-between">
                <p className="font-medium text-sm mb-1">{alert.title}</p>
                <Badge
                  variant={
                    alert.type === "critical"
                      ? "destructive"
                      : alert.type === "pending"
                        ? "outline"
                        : alert.type === "security"
                          ? "destructive"
                          : "secondary"
                  }
                >
                  {alert.type}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-1">{alert.description}</p>
              <p className="text-xs text-muted-foreground">{alert.time}</p>
            </div>
          </div>
        ))}

        <div className="pt-2 text-center">
          <Link to="#" className="text-sm text-blue-600 hover:underline">
            Voir toutes les alertes
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
