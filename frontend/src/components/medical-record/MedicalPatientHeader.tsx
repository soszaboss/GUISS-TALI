import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Phone, Mail, MapPin, CreditCard, Clock, AlertTriangle } from "lucide-react"

interface DoctorMedicalPatientHeaderProps {
  patient: any
}

export function MedicalPatientHeader({ patient }: DoctorMedicalPatientHeaderProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-shrink-0">
            <img
              src={patient.photo || "/placeholder.svg"}
              alt={patient.name}
              className="w-32 h-32 rounded-lg object-cover border border-gray-200"
            />
          </div>

          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <div className="flex items-center">
                <h2 className="text-2xl font-bold">{patient.name}</h2>
                <Badge
                  variant="outline"
                  className={`ml-2 ${
                    patient.riskLevel === "Élevé"
                      ? "bg-red-100 text-red-800 border-red-200"
                      : patient.riskLevel === "Modéré"
                        ? "bg-amber-100 text-amber-800 border-amber-200"
                        : "bg-green-100 text-green-800 border-green-200"
                  }`}
                >
                  {patient.riskLevel}
                </Badge>
              </div>
              <p className="text-gray-500">
                {patient.age} ans • {patient.gender}
              </p>
              <div className="flex items-center text-sm text-gray-600 mt-1">
                <Calendar className="h-4 w-4 mr-1" />
                <span>Né(e) le {patient.birthdate}</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center text-sm">
                <Phone className="h-4 w-4 mr-2 text-gray-500" />
                <span>{patient.phone}</span>
              </div>
              <div className="flex items-center text-sm">
                <Mail className="h-4 w-4 mr-2 text-gray-500" />
                <span>{patient.email}</span>
              </div>
              <div className="flex items-center text-sm">
                <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                <span>{patient.address}</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center text-sm">
                <CreditCard className="h-4 w-4 mr-2 text-gray-500" />
                <span>
                  Permis catégorie {patient.permitCategory} ({patient.permitDate})
                </span>
              </div>
              <div className="flex items-center text-sm">
                <Clock className="h-4 w-4 mr-2 text-gray-500" />
                <span>Dernière visite: {patient.lastVisit}</span>
              </div>
              <div className="flex items-center text-sm">
                <AlertTriangle className="h-4 w-4 mr-2 text-amber-500" />
                <span>Prochaine visite: {patient.nextVisit}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
