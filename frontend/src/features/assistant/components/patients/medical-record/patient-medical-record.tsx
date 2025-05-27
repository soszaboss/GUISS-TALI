"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { InfoIcon, FileText, Car, Calendar } from "lucide-react"

// Importons les composants nécessaires
// Note: Ces imports sont des placeholders, les composants réels seraient définis dans leurs fichiers respectifs
import { PatientHeader } from "./patient-header"
import { MedicalHistory } from "./medical-history"
import { DrivingExperience } from "./driving-experience"
import { Visit } from "./visit"


// Utilisons export function au lieu de export default
export function PatientMedicalRecord() {
  const [patient, setPatient] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("antecedents")
  const [loading, setLoading] = useState(true)
  const [userRole, setUserRole] = useState("assistant") // assistant, technician, doctor, admin
  const patientId = "12345" // Simuler un ID de patient, dans une application réelle, cela serait passé en props ou récupéré d'une autre manière
  useEffect(() => {
    // Simuler le chargement des données du patient
    const fetchPatient = async () => {
      try {
        // Dans une application réelle, cela serait un appel API
        const mockPatient = {
          id: patientId,
          first_name: "Vincent",
          last_name: "Viscaal",
          date_of_birth: "1985-03-29",
          gender: "Homme",
          license_number: "SN12345678",
          license_type: "Permis B",
          photo: "/placeholder.svg?height=100&width=100",
        }

        setPatient(mockPatient)
        setLoading(false)
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error)
        setLoading(false)
      }
    }

    fetchPatient()
  }, [patientId])

  if (loading) {
    return <div className="flex justify-center items-center h-64">Chargement du dossier médical...</div>
  }

  if (!patient) {
    return (
      <Alert variant="destructive">
        <InfoIcon className="h-4 w-4" />
        <AlertTitle>Erreur</AlertTitle>
        <AlertDescription>Impossible de charger les informations du patient.</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      <PatientHeader patient={patient} />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-5 mb-6 sticky top-16 z-10 bg-gray-200">
          <TabsTrigger value="antecedents" className="flex items-center">
            <FileText className="h-4 w-4 mr-2" />
            Antécédents Médicaux
          </TabsTrigger>
          <TabsTrigger value="experience" className="flex items-center">
            <Car className="h-4 w-4 mr-2" />
            Expérience de Conduite
          </TabsTrigger>
          <TabsTrigger value="visite-1" className="flex items-center text-green-600">
            <Calendar className="h-4 w-4 mr-2" />
            Visite 1
          </TabsTrigger>
          <TabsTrigger value="visite-2" className="flex items-center text-blue-600">
            <Calendar className="h-4 w-4 mr-2" />
            Visite 2
          </TabsTrigger>
          <TabsTrigger value="visite-3" className="flex items-center text-purple-600">
            <Calendar className="h-4 w-4 mr-2" />
            Visite 3
          </TabsTrigger>
        </TabsList>

        <TabsContent value="antecedents">
          <MedicalHistory patientId={patientId} userRole={userRole} />
        </TabsContent>

        <TabsContent value="experience">
          <DrivingExperience patientId={patientId} userRole={userRole} />
        </TabsContent>

        <TabsContent value="visite-1">
          <Visit
            visitNumber={1}
            patientId={patientId}
            userRole={userRole}
            colorClass="border-green-500"
            date="2023-05-15"
          />
        </TabsContent>

        <TabsContent value="visite-2">
          <Visit
            visitNumber={2}
            patientId={patientId}
            userRole={userRole}
            colorClass="border-blue-500"
            date="2023-06-15"
          />
        </TabsContent>

        <TabsContent value="visite-3">
          <Visit
            visitNumber={3}
            patientId={patientId}
            userRole={userRole}
            colorClass="border-purple-500"
            date="2023-07-15"
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
