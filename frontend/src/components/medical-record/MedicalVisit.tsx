 import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TechnicalExam } from "./TechnicalExam"
import { DrivingExperience } from "./DrivingExperience"
import { useAuth } from "@/hooks/auth/Auth"
import { defaultDriverExperienceValues, type Antecedent as AntecedentModel, type DriverExperience} from "@/types/medicalRecord"
import { initialClinicalExamen, type ClinicalExamen } from "@/types/examensClinic"
import { initialTechnicalExamen, type TechnicalExamen } from "@/types/examenTechniques"
import { ClinicalExam } from "./ClinicalExam"

type extraProps = {
  patientID?: number
  examenID?: number
  visitID?: number
}
type MedicalVisitProps = {
  clinical_examen?: ClinicalExamen
  technical_examen?: TechnicalExamen
  driving_experience?: DriverExperience
  antecedent?: AntecedentModel
  extra?: extraProps
}

export function MedicalVisit({ extra, driving_experience, technical_examen, clinical_examen }: MedicalVisitProps) {
  const {currentUser} = useAuth()
  const role = currentUser?.role?.toLocaleLowerCase()
  // Onglet actif
  const [activeTab, setActiveTab] = useState("driving")

  // États pour chaque sous-formulaire (adapte selon ta structure)
  const [technicalData] = useState(technical_examen || initialTechnicalExamen)
  const [clinicalData] = useState(clinical_examen || initialClinicalExamen)
  const [drivingData] = useState(driving_experience || defaultDriverExperienceValues)

  // États pour l'édition et le statut d'enregistrement
  const canEditTechnical = role === "employee" || role === "technician"
  const canEditClinical = role === "employee" || role === "doctor"
  const canEditDriving = role === "employee" || role === "doctor"


  return (
    <div className="p-4">
      {/* ... header, workflow, etc ... */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 mb-6">
          {/* <TabsTrigger value="history">Antécédents médicaux</TabsTrigger> */}
          <TabsTrigger value="driving">Expérience de conduite</TabsTrigger>
          <TabsTrigger value="technical">Examen technique</TabsTrigger>
          <TabsTrigger value="clinical">Examen clinique</TabsTrigger>
        </TabsList>
        <TabsContent value="driving">
          <DrivingExperience
            driverExperienceData={drivingData}
            canEdit={canEditDriving}
            visiteID={extra?.visitID}
            patientID={extra?.patientID}
          />
        </TabsContent>
        <TabsContent value="technical">
          <TechnicalExam
            technicalData={technicalData}
            examenID={extra?.examenID}
            visiteID={extra?.visitID}
            patientID={extra?.patientID}
            canEditTechnical={canEditTechnical}
          />
        </TabsContent>
        <TabsContent value="clinical">
          <ClinicalExam
            clinicalData={clinicalData}
            canEditClinical={canEditClinical}
            examenID={extra?.examenID}
            visiteID={extra?.visitID}
            patientID={extra?.patientID}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}