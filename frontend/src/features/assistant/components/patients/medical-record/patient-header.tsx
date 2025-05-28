"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft, FileText, Edit } from "lucide-react"
import { Link } from "react-router-dom"

interface PatientHeaderProps {
  patient: {
    id: string
    first_name: string
    last_name: string
    date_of_birth: string
    gender: string
    license_number: string
    license_type: string
    photo: string
  }
}

export function PatientHeader({ patient }: PatientHeaderProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("fr-FR")
  }

  const calculateAge = (dateString: string) => {
    const birthDate = new Date(dateString)
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }

    return age
  }

  return (
    <div className="sticky top-0 z-20 bg-white border-b pb-4 mb-6 py-3 px-6 rounded">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">
          Cahier Médical – {patient.first_name} {patient.last_name}
        </h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link to={`/assistant/patients/${patient.id}`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link to={`/assistant/patients/edit/${patient.id}`}>
              <Edit className="h-4 w-4 mr-2" />
              Modifier
            </Link>
          </Button>
          <Button variant="outline" size="sm">
            <FileText className="h-4 w-4 mr-2" />
            Exporter PDF
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative h-16 w-16 rounded-full overflow-hidden border">
          <img
            src={patient.photo || "/placeholder.svg"}
            alt={`${patient.first_name} ${patient.last_name}`}
            className="object-cover"
          />
        </div>
        <div className="grid grid-cols-3 gap-x-8 gap-y-2 flex-1">
          <div>
            <p className="text-sm text-gray-500">Nom complet</p>
            <p className="font-medium">
              {patient.first_name} {patient.last_name}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Date de naissance</p>
            <p className="font-medium">
              {formatDate(patient.date_of_birth)} ({calculateAge(patient.date_of_birth)} ans)
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Genre</p>
            <p className="font-medium">{patient.gender}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Numéro de permis</p>
            <p className="font-medium">{patient.license_number}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Type de permis</p>
            <p className="font-medium">{patient.license_type}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
