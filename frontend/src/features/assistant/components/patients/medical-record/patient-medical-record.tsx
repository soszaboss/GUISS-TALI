import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { InfoIcon, FileText } from "lucide-react"

// Importons les composants nécessaires
// Note: Ces imports sont des placeholders, les composants réels seraient définis dans leurs fichiers respectifs
import { PatientHeader } from "./patient-header"
import { MedicalHistory } from "./medical-history"



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
        </TabsList>

        <TabsContent value="antecedents" aria-selected={activeTab === "antecedents"}>
          <MedicalHistory patientId={patientId} userRole={userRole} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
