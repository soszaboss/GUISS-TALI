/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TechnicalExam } from "./TechnicalExam"
import { ClinicalExam } from "./ClinicalExam"
import { DrivingExperience } from "./DrivingExperience"
import { MedicalHistory } from "./MedicalHistory"

// Exemple de props, adapte selon ton projet
type DoctorMedicalVisitProps = {
  visit: any
  userRole?: "doctor" | "admin" | "readonly"
}

export function MedicalVisit({ visit, userRole = "admin" }: DoctorMedicalVisitProps) {
  // Onglet actif
  const [activeTab, setActiveTab] = useState("technical")

  // États pour chaque sous-formulaire (adapte selon ta structure)
  const [technicalData, setTechnicalData] = useState(visit?.technicalData || {})
  const [clinicalData, setClinicalData] = useState(visit?.clinicalData || { od: {}, og: {} })
  const [drivingData, setDrivingData] = useState(visit?.drivingData || {})

  // États pour l'édition et le statut d'enregistrement
  const canEditTechnical = userRole === "doctor" || userRole === "admin"
  const canEditClinical = userRole === "doctor" || userRole === "admin"
  const canEditDriving = userRole === "doctor" || userRole === "admin"
  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "success" | "error">("idle")
  const [medicalHistoryData, setMedicalHistoryData] = useState(
    visit?.medicalHistory || {
      antecedents_medico_chirurgicaux: "",
      pathologie_ophtalmologique: "",
      // ...autres champs selon ta structure...
    }
  )
  const [medicalHistoryErrors, setMedicalHistoryErrors] = useState<Record<string, string>>({})

  // ...handlers pour chaque sous-formulaire...

  const handleMedicalHistoryChange = (field: string, value: any) => {
    setMedicalHistoryData((prev) => ({ ...prev, [field]: value }))
    // Optionnel: gestion des erreurs
    setMedicalHistoryErrors((prev) => ({ ...prev, [field]: "" }))
  }
  // Handlers pour chaque sous-formulaire
  const handleTechnicalChange = (field: string, value: any) => {
    setTechnicalData((prev: any) => ({ ...prev, [field]: value }))
  }
  const handleClinicalChange = (eye: "od" | "og", field: string, value: any) => {
    setClinicalData((prev: any) => ({
      ...prev,
      [eye]: { ...prev[eye], [field]: value }
    }))
  }
  const handleDrivingChange = (field: string, value: any) => {
    setDrivingData((prev: any) => ({ ...prev, [field]: value }))
  }

  // Handler d'enregistrement (exemple, à adapter)
  const handleSave = async () => {
    setIsSaving(true)
    setSaveStatus("saving")
    try {
      // Appelle ici ton API ou ta logique de sauvegarde
      // await saveVisit({ technicalData, clinicalData, drivingData })
      setSaveStatus("success")
    } catch (e) {
      setSaveStatus("error")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="p-4">
      {/* ... header, workflow, etc ... */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="history">Antécédents médicaux</TabsTrigger>
          <TabsTrigger value="technical">Examen technique</TabsTrigger>
          <TabsTrigger value="clinical">Examen clinique</TabsTrigger>
          <TabsTrigger value="driving">Expérience de conduite</TabsTrigger>
        </TabsList>
        <TabsContent value="history">
          <MedicalHistory
            formData={medicalHistoryData}
            errors={medicalHistoryErrors}
            canEdit={canEditTechnical}
            isSaving={isSaving}
            saveStatus={saveStatus}
            onChange={handleMedicalHistoryChange}
            onSave={handleSave}
          />
        </TabsContent>
        <TabsContent value="technical">
          <TechnicalExam
            technicalData={technicalData}
            canEditTechnical={canEditTechnical}
            handleTechnicalChange={handleTechnicalChange}
            handleSave={handleSave}
            isSaving={isSaving}
            saveStatus={saveStatus}
          />
        </TabsContent>
        <TabsContent value="clinical">
          <ClinicalExam
            clinicalData={clinicalData}
            canEditClinical={canEditClinical}
            handleClinicalChange={handleClinicalChange}
            handleSave={handleSave}
            isSaving={isSaving}
            saveStatus={saveStatus}
          />
        </TabsContent>
        <TabsContent value="driving">
          <DrivingExperience
            drivingData={drivingData}
            canEditDriving={canEditDriving}
            handleDrivingChange={handleDrivingChange}
            handleSave={handleSave}
            isSaving={isSaving}
            saveStatus={saveStatus}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}